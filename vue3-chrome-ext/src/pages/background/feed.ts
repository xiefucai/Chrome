import { feed, entries, EntireValue } from '@/lib/db'
import { readFeed } from '@/lib/feed'
import { get } from '@/lib/ajax'
import { Article } from '@/@types/feed'

const updateFeed = () => {}

const saveArticles = async (articles: Article[], collectionId: number) => {
  const idList = []
  for (let i = 0, k = articles.length; i < k; i++) {
    const article = articles[i]
    const entrie: EntireValue = {
      title: article.title,
      link: article.link,

      shortContent: article.description,
      content: article['content:encoded'],

      author: article.creator,

      image: '',
      published: Math.floor(new Date(article.pubDate).getTime() / 1000),
      readLater: 0,
      readed: 0,
      // feed?: string
      feedId: collectionId
    }
    const id = await entries.add(entrie).then(id => {
      idList.push(id)
    })
  }
}
const getAllFeed = async () => {
  const feeds = await feed.getAll()
  for (let i = 0, k = feeds.length; i < k; i++) {
    const feed = feeds[i]
    // const feedInfo = await readFeed()
    const doc = await get({ url: feed.url }).then((res: any) => res.responseXML)
    if (doc) {
      const data = readFeed(doc)
      if (data && data.articles && data.articles.length) {
        await saveArticles(data.articles, feed.collectionId)
      }
      console.log(feed, data)
    } else {
      console.error('无法加载源' + feed.url + '预览: 601 无效的XML')
      // 无法加载源预览: 601 无效的XML
    }
  }
  console.log(feeds)
}

const initFeed = async () => {
  await getAllFeed()
}

export default initFeed
