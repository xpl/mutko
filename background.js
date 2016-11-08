let menu = null

const updateMenu = (text, link) => {
    if (!text) {
        if (menu) {
            chrome.contextMenus.remove (menu.id)
            menu = null
        }
    } else {
        if (!menu) {
            chrome.contextMenus.create (menu = {
                'id': 'mutko', 
                'enabled': true, 
                'title': text,
                "contexts": ["selection"],
                onclick: () => {
                     chrome.tabs.create ({ url: menu.link })
                }
            })
        } else {
            chrome.contextMenus.update (menu.id, { title: text })
        }

        menu.link = link
    }
}

chrome.runtime.onMessage.addListener (msg => {

    if (msg.request === 'updateContextMenu') {

        if (msg.selection && (msg.selection.split (/\s+/).length < 3)) {

            updateMenu ('Перевод...')

            fetch (new Request ('https://api.lingvolive.com/Translation/WordListPart?prefix=' + msg.selection + '&srcLang=1033&dstLang=1049&pageSize=10&startIndex=0'))
                .then (r => r.json ())
                .then (json => {

                    if (json.items.length && json.items[0].lingvoTranslations) {

                        updateMenu (json.items[0].lingvoTranslations, 'https://www.lingvolive.com/ru-ru/translate/en-ru/' + msg.selection)
                    } else {

                        updateMenu ()
                    }

                })
                .catch (e => {
                    updateMenu (e)
                })

        } else {
            updateMenu ()
        }

        // setTimeout (() => {
        //     chrome.contextMenus.update (menu.id, { title: msg.selection })
        // }, 2000)
    }
});