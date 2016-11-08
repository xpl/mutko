document.addEventListener ('selectionchange', () => {

    const selection = window.getSelection().toString().trim()

    chrome.runtime.sendMessage ({
        request: 'updateContextMenu',
        selection: selection
    })
})

