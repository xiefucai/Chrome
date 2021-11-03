import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { Md5 } from 'ts-md5/dist/md5'
import { FeedDB, CollectionValue, FeedValue, EntireValue } from '@/@types/db'
// https://github.com/jakearchibald/idb#examples

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
      entrieStore.createIndex('by-feed-id', 'feedId')
      entrieStore.createIndex('by-ctime', 'ctime')
      entrieStore.createIndex('by-utime', 'utime')
      /* const productStore = db.createObjectStore('products', {
        keyPath: 'productCode'
      })
      productStore.createIndex('by-price', 'price') */
    }
  })

  return cacheDb
}

const getNow = () => Math.floor(Date.now() / 1000)
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
    const now = getNow()
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
    // delete val.id
    val.updated = getNow()
    return await db.put('feeds', val)
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
    if (!val.link) {
      throw new Error('文章链接不能为空')
    }
    val.ctime = getNow()
    val.utime = val.ctime
    val.id = Md5.hashStr(val.link)
    const db = await getDb(DB_NAME, DB_VERSION)
    return await db.add('entries', val)
  },
  async set (key: string, val: EntireValue) {
    const db = await getDb(DB_NAME, DB_VERSION)
    val.utime = getNow()
    console.log('update entries', key, val)
    delete val.id
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
  },
  async getStore (mode?: 'readonly' | 'readwrite') {
    const db = await getDb(DB_NAME, DB_VERSION)
    return db.transaction('entries', mode || 'readonly')
  }
}
/* async function demo () {
  // This works
  await db.put('favourite-number', 7, 'Jen')
  // This fails at compile time, as the 'favourite-number' store expects a number.
  await db.put('favourite-number', 'Twelve', 'Jake')
} */

export { session, collection, feed, entries }
