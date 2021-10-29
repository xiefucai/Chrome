import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { Md5 } from 'ts-md5/dist/md5'
// https://github.com/jakearchibald/idb#examples
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
  feedId: number
}
interface FeedDB extends DBSchema {
  session: Session
  collections: Collection
  feeds: Feed
  entries: {
    key: string
    value: EntireValue
    indexes: { 'by-link': string; 'by-collection-id': number }
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
let cacheDb: IDBPDatabase<FeedDB>
const getDb = async (name: string, version: number) => {
  if (cacheDb) {
    return cacheDb
  }

  cacheDb = await openDB<FeedDB>(name, version, {
    upgrade (db) {
      db.createObjectStore('session')

      const collectionStore = db.createObjectStore('collections', {
        keyPath: 'id',
        autoIncrement: true
      })
      collectionStore.createIndex('by-name', 'name')

      const feedStore = db.createObjectStore('feeds', {
        keyPath: 'id'
      })
      feedStore.createIndex('by-name', 'name')
      feedStore.createIndex('by-url', 'url')

      const entrieStore = db.createObjectStore('entries', {
        keyPath: 'id'
      })
      entrieStore.createIndex('by-link', 'link')
      /* const productStore = db.createObjectStore('products', {
        keyPath: 'productCode'
      })
      productStore.createIndex('by-price', 'price') */
    }
  })

  return cacheDb
}

const DB_NAME = 'feeddb'
const DB_VERSION = 1
const session = {
  async set (key: string, val: string | number) {
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.put('session', val, key)
  },
  async get (key: string) {
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.get('session', key)
  }
}

const collection = {
  async add (name: string) {
    const db = await getDb(DB_NAME, DB_VERSION)
    const now = Math.floor(Date.now() / 1000)
    /* {
      created: number
      updated: number
      id?: number
      name: string
      sort: number
    } */

    return await db.add('collections', {
      created: now,
      updated: now,
      name: name,
      sort: now
    })
  },
  async set (key: number, val: CollectionValue) {
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.put('collections', val, key)
  },
  async get (key: number) {
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.get('collections', key)
  },
  async getByName (key: string) {
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.getFromIndex('collections', 'by-name', key)
  },
  async getAll () {
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.getAll('collections')
  }
}

const feed = {
  async add (val: FeedValue) {
    val.id = Md5.hashStr(val.url)
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.add('feeds', val)
  },
  async set (key: string, val: FeedValue) {
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.put('feeds', val, key)
  },
  async get (url: string) {
    const db = await getDb(DB_NAME, DB_VERSION)
    const key = Md5.hashStr(url)
    return await db.get('feeds', key)
  },
  async getAll () {
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.getAll('feeds')
  },
  async remove (url: string) {
    const db = await getDb(DB_NAME, DB_VERSION)
    const key = Md5.hashStr(url)
    return await db.delete('feeds', key)
  }
}

const entries = {
  async add (val: EntireValue) {
    val.id = Md5.hashStr(val.link)
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.add('entries', val)
  },
  async set (key: string, val: EntireValue) {
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.put('entries', val, key)
  },
  async get (url: string) {
    const db = await getDb(DB_NAME, DB_VERSION)
    const key = Md5.hashStr(url)
    return await db.get('entries', key)
  },
  async getAll () {
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.getAll('entries')
  },
  async remove (url: string) {
    const db = await getDb(DB_NAME, DB_VERSION)
    const key = Md5.hashStr(url)
    return await db.delete('entries', key)
  }
}
/* async function demo () {
  // This works
  await db.put('favourite-number', 7, 'Jen')
  // This fails at compile time, as the 'favourite-number' store expects a number.
  await db.put('favourite-number', 'Twelve', 'Jake')
} */

export { session, collection, feed, entries }
