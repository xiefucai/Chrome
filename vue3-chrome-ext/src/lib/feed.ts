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
const readNode = <T>(node: HTMLElement | Element) => {
  if (node.children.length > 0) {
    const result: T = {} as T
    ;[...node.children].forEach(child => {
      ;(result as any)[child.nodeName] = readNode(child)
    })
    return result
  } else {
    return (node.textContent || '').replace(/^\s+|\s+$/g, '')
  }
}
const getNodeInfo = (feed: RssInfo, doc: Document) => {
  for (const key in conf[feed.type]) {
    const node = doc.querySelector(conf[feed.type][key])
    if (node) {
      ;(feed as any)[key] = readNode<any>(node)
    }
  }
}

const getArticles = (feed: RssInfo, doc: Document) => {
  const articles: Article[] = []
  switch (feed.type) {
    case 'rss':
      ;[...doc.querySelectorAll('channel > item')].forEach(item => {
        articles.push(readNode<Article>(item) as Article)
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
