function loadScript(name, tabId, cb) {
    if (process.env.NODE_ENV === 'production') {
        chrome.tabs.executeScript(tabId, {
            file: `/js/${name}.bundle.js`,
            runAt: 'document_end'
        }, cb);
    } else {
        // dev: async fetch bundle
        fetch(`http://localhost:3000/js/${name}.bundle.js`)
            .then(res => res.text())
            .then((fetchRes) => {
                chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, cb);
            });
    }
}

const arrowURLs = ['^https://github\\.com'];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'loading' || !tab.url.match(arrowURLs.join('|'))) return;

    loadScript('inject', tabId, () => console.log('giphub init'));
});
