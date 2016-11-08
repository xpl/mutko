let menu = null
let link = null

chrome.runtime.onMessage.addListener (msg => {

    if (msg.request === 'updateContextMenu') {

        link = msg.link

        if (!msg.text) {

            if (menu) {
                chrome.contextMenus.remove (menu.id)
                menu = null
            }

        } else {

            if (!menu) {

                chrome.contextMenus.create (menu = {
                    id: 'mutko', 
                    enabled: link ? true : false, 
                    title: msg.text,
                    contexts: ['selection'],
                    onclick: () => {
                         chrome.tabs.create ({ url: link })
                    }
                })

            } else {
                chrome.contextMenus.update (menu.id, { title: msg.text, enabled: link ? true : false })
            }
        }
    }
})