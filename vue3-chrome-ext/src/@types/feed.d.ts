export interface Article {
  title: string
  link: string
  comments: string
  pubDate: string
  creator: string
  category: string
  description: string
  guid: string
  'content:encoded': string
  'dc:creator': string
  'slash:comments': string
  'wfw:commentRss': string
}
//
export interface RssInfo {
  type: string
  version: string
  language: string | null
  url: string
  title: string | null | undefined
  description: string
  updated: string
  updatePeriod: string
  updateFrequency: string
  generator: string
  favicon: {
    url: string
    title: string
    link: string
    width: number
    height: number
  }
  articles: Article[]
}
