interface Rss {
  title: string
  href: string
}
interface Icon {
  name: string
  href: string
}
const TYPES = {
  'application/rss+xml': 'rss',
  'application/rsd+xml': 'rsd',
  'application/atom+xml': 'atom',
  'application/wlwmanifest+xml': 'wl'
}
const TYPEKEYS = Object.keys(TYPES)
const getDocumentRssLinks = () => {
  const arr: Rss[] = []
  switch (document.documentElement.tagName) {
    case 'rss':
      arr.push({
        href: location.href,
        title:
          document.documentElement.querySelector('channel > title')
            ?.textContent || '未定义标题'
      })
      break
    case 'HTML':
      ;[...document.getElementsByTagName('link')].forEach(function (link) {
        if (TYPEKEYS.indexOf(link.type) >= 0) {
          arr.push({
            href: link.href,
            title: link.title
          })
        } else {
          console.log('ignore', link.type, link.href)
        }
      })
      break
  }

  return Promise.resolve(arr)
}
const getDocumentIcons = () => {
  const icons: Icon[] = []
  ;[...document.querySelectorAll('link[rel*="icon"]')].forEach(
    (link: Element) => {
      icons.push({
        name: (link as HTMLLinkElement).rel,
        href: (link as HTMLLinkElement).href
      })
    }
  )
  return Promise.resolve(icons)
}
const actions: { [key: string]: () => any } = {
  getRssInfo: async () => {
    const links = await getDocumentRssLinks()
    const icons = await getDocumentIcons()
    if (links && links.length) {
      return { links, icons }
    }
    return {}
  }
}

const onMessage = async (
  request: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => {
  const name = request.name
  const callback = name && actions[name]
  if (callback) {
    callback().then((data: any) => {
      console.log(name, data, sendResponse)
      sendResponse({ [name]: data })
    })
  } else {
    console.warn(`no actions named ${name}`)
    sendResponse({ [name]: null })
  }
}

const sendMessage = (
  data: any,
  callback?: ((response: any) => void) | undefined
) => {
  chrome.runtime.sendMessage(data, callback)
}

chrome.runtime.onMessage.addListener(onMessage)
document.addEventListener(
  'DOMContentLoaded',
  async () => {
    const { links, icons } = await actions.getRssInfo()
    if (links && links.length) {
      sendMessage(
        {
          action: 'setRssLinks',
          links,
          icons
        },
        rs => {
          console.log('sended rss links', rs)
        }
      )
    }
  },
  false
)
