import { FeedStatus } from '@/data/feedStatus'

type SessionValue = number | string
interface Session {
  key: string
  value: SessionValue
}

export interface CollectionValue {
  created: number
  updated: number
  id?: number
  name: string
  sort: number
}
interface Collection {
  key: number
  value: CollectionValue
  indexes: { 'by-name': string }
}
export interface FeedValue {
  id?: string
  name: string
  url: string
  icon: string

  originalName: string
  unreadEntries: number
  updateEnterval: number
  lastUpdate: number

  link: string
  maxNumEntries: number
  updated: number
  created: number
  autoUpdate: boolean
  notificationEnabled: boolean

  collectionId: number
  latestArticleIdList?: string[] // 最近一次获取的文章id列表
  status: FEEDStatus.INITED | FEEDStatus.SUCCESS | FEEDStatus.FAILED
}

interface Feed {
  key: string
  value: FeedValue
  indexes: { 'by-url': string; 'by-name': string }
}

export interface EntireValue {
  id?: string
  title: string
  link: string

  shortContent: string
  content?: string

  author?: string

  image?: string
  published: number
  readLater: 0 | 1

  // type: 'rss' | 'atom' | 'feed'
  readed: 0 | 1

  feed?: string
  feedId: string

  ctime?: number
  utime?: number
}
export interface FeedDB extends DBSchema {
  session: Session
  collections: Collection
  feeds: Feed
  entries: {
    key: string
    value: EntireValue
    indexes: {
      'by-link': string
      'by-feed-id': number
      'by-ctime': number
      'by-utime': number
    }
  }
  /* products: {
    value: {
      name: string
      price: number
      productCode: string
    }
    key: string
    indexes: { 'by-price': number }
  } */
}
