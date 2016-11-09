const fetchSync = url => {

    const xhr = new XMLHttpRequest ()

    xhr.open ('GET', url, false /* SYNCHRONOUS XHR FTW :) */)
    xhr.send (null)

    return xhr.responseText
}

const updateMenu = data => {
	chrome.runtime.sendMessage (Object.assign ({ request: 'updateContextMenu' }, data))
}

const sleep = ms => {
    for (let t = Date.now (); (Date.now () - t) < ms;) {}
}

document.addEventListener ('contextmenu', e => {

	const sel = window.getSelection ().toString ().trim ()

	const url = 'https://api.lingvolive.com/Translation/WordListPart?prefix=' + sel + '&srcLang=1033&dstLang=1049&pageSize=10&startIndex=0'
	
	if (sel && (sel.split (/\s+/).length < 3)) {

        try {

            const json = JSON.parse (fetchSync (url))

            const translations = json.items.map (item => item.lingvoTranslations)

            if (translations.length) {
                updateMenu ({

                	text: translations[0],
                	link: 'https://www.lingvolive.com/ru-ru/translate/en-ru/' + sel })
            } else {
                updateMenu ()
            }

        } catch (e) {
            updateMenu ({ text: String (e) })
        }

    } else {
    	updateMenu ()
    }

    sleep (50) // HACK: delays context menu, so the 'updateContextMenu' message gets processed first
})

