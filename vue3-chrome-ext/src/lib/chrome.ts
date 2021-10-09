interface ViewBox {
  width: number;
  height: number;
  top: number;
  left: number;
}

const getTab = (data: chrome.tabs.QueryInfo) => {
  return new Promise<chrome.tabs.Tab>((resolve, reject) => {
    chrome.tabs.query(
      data,
      tabs => {
        resolve(tabs && tabs[0])
      }
    )
  })
}
const getCurrentTab = async () => {
  return await getTab({
    active: true,
    currentWindow: true
  })
}
const openUrl = async (url: string) => {
  const tab = await getTab({ url }) as chrome.tabs.Tab
  if (tab) {
    console.log('openUrl update', url)

    chrome.tabs.update(tab.id || tab.windowId, {
      active: true,
      // focused: true,
      url
    })
    try {
      window.close()
    } catch (j) {
      console.log('Failed to close popup window')
    }
  } else {
    console.log('openUrl create', url)

    chrome.tabs.create(
      {
        // active: true,
        url: chrome.runtime.getURL(url)
      },
      function (ac) {
        try {
          window.close()
        } catch (j) {
          console.log('Failed to close popup window')
        }
      }
    )
  }
}

const popUrl = (url: string, view?: ViewBox) => {
  const rect: ViewBox = {
    width: 500,
    height: 500,
    top: 0,
    left: 0,
    ...view
  }
  chrome.windows.create({
    url: chrome.runtime.getURL(url),
    type: 'popup',
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left
  })
}

const sendRequest = async (name: string, callback: (data: any) => void) => {
  const tab = await getCurrentTab()
  if (tab) {
    chrome.tabs.sendMessage(tab.id as number, { name }, response => {
      callback(response && response[name])
    })
  }
}

// chrome.extension.getBackgroundPage() 获取background的window对象
export { getTab, getCurrentTab, openUrl, popUrl, sendRequest }
