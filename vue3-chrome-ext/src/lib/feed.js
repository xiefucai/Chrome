/* interface RssInfo {
  title: string;
  description: string;
  updated: string;
  updatePeriod: string;
  updateFrequency: string;
  generator: string;
  favicon: {
    url: string;
    title: string;
    link: string;
    width: number;
    height: number;
  };
} */
const conf = {
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
const readNode = node => {
  if (node.children.length > 0) {
    const result = {}
      ;[...node.children].forEach(child => {
        result[child.nodeName] = readNode(child)
      })
    return result
  } else {
    return (node.textContent || '').replace(/^\s+|\s+$/g, '')
  }
}
const getNodeInfo = (feed, doc) => {
  for (const key in conf[feed.type]) {
    const node = doc.querySelector(conf[feed.type][key])
    if (node) {
      feed[key] = readNode(node)
    }
  }
}

const getArticles = (feed, doc) => {
  const articles = []
  switch (feed.type) {
    case 'rss':
      ;[...doc.querySelectorAll('channel > item')].forEach(item => {
        articles.push(readNode(item))
      })
      break
  }
  return articles
}
const readFeed = doc => {
  const feed = {}
  const typeNode = doc.firstChild // doc.querySelector('atom:feed,rss,rdf:RDF,atom03:feed')
  if (typeNode) {
    console.log(typeNode)
    switch (typeNode.nodeName) {
      case 'feed':
      case 'atom:feed':
        feed.type = 'atom'
        feed.version = '1.0'
        feed.title = doc.querySelector('title').textContent
        feed.language = typeNode.getAttribute('language')
        feed.articles = getArticles(feed, doc, 'channel > item')
        // TODO: 没有favicon 信息
        getNodeInfo(feed, doc)
        break
      case 'atom03:feed':
        feed.type = 'atom'
        feed.version = '0.3'
        feed.title = doc.querySelector('atom03:title').textContent
        break
      case 'rss':
        feed.type = 'rss'
        feed.version = typeNode.getAttribute('version') + ''
        feed.articles = getArticles(feed, doc, 'channel > item')
        getNodeInfo(feed, doc)
        break
      case 'rdf:RDF':
        feed.type = 'rdf'
        feed.version = '1.0'
        feed.title = doc.querySelector(
          'rss10:channel > rss10:title'
        ).textContent
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

module.exports = { readFeed }
