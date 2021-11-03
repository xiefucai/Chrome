import { Md5 } from 'ts-md5/dist/md5'
import { FeedStatus } from '@/data/feedStatus'
import { EntireValue, FeedValue } from '@/@types/db'
import { feed, entries } from '@/lib/db'
import { readFeed } from '@/lib/feed'
import { get } from '@/lib/ajax'
import { Article } from '@/@types/feed'
import sleep from '@/lib/sleep'

const getArticleImage = async (article: Article) => {
  const getImages = (str: string) => {
    const dom: HTMLDivElement = document.createElement('div')
    dom.innerHTML = str
    const imgs = dom.querySelectorAll('img')
    if (imgs && imgs.length) {
      return [...imgs].map(
        img =>
          img.getAttribute('data-actualsrc') ||
          img.getAttribute('data-original-src') ||
          img.getAttribute('data-src') ||
          img.src
      )
    }
    return null
  }

  const contentImgs = getImages(
    article['content:encoded'] || article.description
  )

  if (contentImgs && contentImgs.length) {
    return contentImgs[0]
  }
}
const saveArticles = async (articles: Article[], _feed?: any) => {
  const keyList = []
  const tx = await entries.getStore('readwrite')
  const queues: any[] = []

  let idList: IDBValidKey[] = []
  let lastUpdate = 0

  for (let i = 0, k = articles.length; i < k; i++) {
    const article = articles[i]
    const key = Md5.hashStr(article.link)
    const pubDate = new Date(article.pubDate).getTime()
    keyList.push(key)

    if (pubDate && pubDate > lastUpdate) {
      lastUpdate = pubDate
    }

    if (
      _feed.latestArticleIdList &&
      _feed.latestArticleIdList.indexOf(key) >= 0
    ) {
      continue
    }

    const entrie: EntireValue = {
      title: article.title,
      link: article.link,

      shortContent: article.description,
      content: article['content:encoded'],

      author: article.creator,

      image: await getArticleImage(article),
      published: Math.floor(new Date(article.pubDate).getTime() / 1000),
      readLater: 0,
      readed: 0,
      // feed?: string
      feedId: _feed.id || ''
    }
    if (tx.store.add) {
      queues.push(tx.store.add({ ...entrie, id: Md5.hashStr(entrie.link) }))
    }
    /* await entries
      .add(entrie)
      .then(id => {
        idList.push(id)
      })
      .catch(err => {
        console.warn(key, entrie, err)
      }) */
  }

  if (queues.length) {
    queues.push(tx.done)
    const results = await Promise.all(queues)
    idList = results && results.filter(id => id)
  }

  lastUpdate = Math.floor(lastUpdate / 1000)

  return { idList, keyList, lastUpdate }
}

const updateFeed = async (_feed: FeedValue) => {
  // const feedInfo = await readFeed()
  const doc = await get({ url: _feed.url }).then((res: any) => res.responseXML)
  if (doc) {
    const data = readFeed(doc)
    if (data && data.articles && data.articles.length) {
      const { idList, keyList, lastUpdate } = await saveArticles(
        data.articles,
        _feed
      )
      if (idList.length > 0) {
        _feed.latestArticleIdList = keyList
        _feed.lastUpdate = lastUpdate
      }
      _feed.status = FeedStatus.SUCCESS
      if (_feed.id) {
        return await feed.set(_feed.id, _feed)
      }
    }
  } else {
    // console.error('无法加载源' + _feed.url + '预览: 601 无效的XML')
    // 无法加载源预览: 601 无效的XML
    _feed.status = FeedStatus.FAILED
    if (_feed.id) {
      return await feed.set(_feed.id, _feed)
    }
  }
}

const getAllFeed = async () => {
  const feeds = await feed.getAll()
  for (let i = 0, k = feeds.length; i < k; i++) {
    await updateFeed(feeds[i]).catch(err => {
      console.warn('update feed failed', feeds[i], err)
    })
  }
  await sleep(60)
  await getAllFeed()
}

const initFeed = async () => {
  await getAllFeed()
}

export default initFeed
