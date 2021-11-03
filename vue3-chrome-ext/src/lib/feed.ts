import { Article, RssInfo } from '@/@types/feed'
const conf: { [key: string]: any } = {
  rss: {
    title: 'channel > title',
    description: 'channel > description',
    updated: 'channel > lastBuildDate',
    language: 'channel > language',
    updatePeriod: 'channel > updatePeriod',
    updateFrequency: 'channel > updateFrequency',
    generator: 'channel > generator',
    favicon: 'channel > image'
  },
  atom: {
    title: 'feed > title',
    description: 'feed > subtitle',
    updated: 'feed > updated',
    // language: 'feed > language',
    updatePeriod: 'feed > updatePeriod',
    updateFrequency: 'feed > updateFrequency',
    generator: 'feed > generator',
    favicon: 'feed > image'
  }
}
const readNode = <T>(node: HTMLElement | Element, attr?: string) => {
  if (!node) {
    return ''
  }
  if (node.children.length > 0) {
    const result: T = {} as T
    ;[...node.children].forEach(child => {
      ;(result as any)[child.nodeName] = readNode(child, attr)
    })
    return result
  } else {
    if (attr) {
      return node.getAttribute(attr)
    }
    return (node.textContent || '').replace(/^\s+|\s+$/g, '')
  }
}
type ToKey = string | string[]
const readArticleNode = (
  node: HTMLElement | Element,
  keys: string[],
  toKeys: ToKey[]
) => {
  const data: { [key: string]: any } = {}
  const getKeyValue = (toKey: ToKey) => {
    const splitToKey = (k: string) => {
      return k.split('@')
    }
    const getSingToKey = (keyName: string) => {
      const [toInnerKey, toInnerAttr] = splitToKey(keyName)
      return readNode<string>(
        node.querySelector(toInnerKey) as Element,
        toInnerAttr
      )
    }
    if (typeof toKey === 'string') {
      return getSingToKey(toKey)
    }
    if (Array.isArray(toKey)) {
      for (let i = 0, k = toKey.length; i < k; i++) {
        const keyName = toKey[i]
        const value = getSingToKey(keyName)
        if (value) {
          return value
        }
      }
    }
    /* const [toKey, toAttr] = toKeys[i].split('@')
    try {
      data[key] = readNode<string>(node.querySelector(toKey) as Element, toAttr)
    } catch (err) {
      console.warn(`no exist ${i}:${key}=>${toKeys[i]}`, err)
    } */
  }

  keys.forEach((key, i) => {
    if (toKeys[i]) {
      data[key] = getKeyValue(toKeys[i])
    } else {
    }
  })

  return data
}
const getNodeInfo = (feed: RssInfo, doc: Document) => {
  for (const key in conf[feed.type]) {
    const node = doc.querySelector(conf[feed.type][key])
    if (node) {
      ;(feed as any)[key] = readNode<any>(node)
    }
  }
}

const ARTICLE_KEYS = [
  'title',
  'link',
  'comments',
  'pubDate',
  'creator',
  'category',
  'description',
  'guid',
  'encoded',
  'commentRss'
]

const ATOM_ARTICLE_KEYS = [
  'title',
  ['link', 'link@href'],
  'summary',
  'published',
  'author',
  '',
  'content',
  'id',
  'content'
]
const getArticles = (feed: RssInfo, doc: Document) => {
  const articles: Article[] = []
  switch (feed.type) {
    case 'rss':
      console.log(feed)
      ;[...doc.querySelectorAll('channel > item')].forEach(item => {
        articles.push(
          readArticleNode(item, ARTICLE_KEYS, ARTICLE_KEYS) as Article
        )
      })
      break
    case 'atom':
      ;[...doc.querySelectorAll('feed > entry')].forEach(item => {
        const article = readArticleNode(
          item,
          ARTICLE_KEYS,
          ATOM_ARTICLE_KEYS
        ) as Article
        articles.push(article)
      })
      break
  }
  return articles
}
const readFeed = (doc: Document) => {
  const feed: RssInfo = {} as RssInfo
  const typeNode = doc.firstChild as HTMLElement // doc.querySelector('atom:feed,rss,rdf:RDF,atom03:feed')
  if (typeNode) {
    switch (typeNode.nodeName) {
      case 'feed':
      case 'atom:feed':
        feed.type = 'atom'
        feed.version = '1.0'
        feed.title = doc.querySelector('title')?.textContent
        feed.language = typeNode.getAttribute('language')
        feed.articles = getArticles(feed, doc)
        // TODO: 没有favicon 信息
        getNodeInfo(feed, doc)
        break
      case 'atom03:feed':
        feed.type = 'atom'
        feed.version = '0.3'
        feed.title = doc.querySelector('atom03:title')?.textContent
        break
      case 'rss':
        feed.type = 'rss'
        feed.version = typeNode.getAttribute('version') + ''
        feed.articles = getArticles(feed, doc)
        getNodeInfo(feed, doc)

        break
      case 'rdf:RDF':
        feed.type = 'rdf'
        feed.version = '1.0'
        feed.title = doc.querySelector(
          'rss10:channel > rss10:title'
        )?.textContent
        break
    }
  }
  if (feed.type && typeof feed.title === 'undefined') {
    feed.title = 'Untitled feed'
  }
  if (feed.type) {
    return feed
  }
  return null
}

export { readFeed }
