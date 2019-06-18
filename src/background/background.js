import '../icon/16.png';
import '../icon/32.png';
import '../icon/48.png';
import '../icon/64.png';
import '../icon/96.png';
import '../icon/128.png';

const arrowURLs = ['^https://github\\.com'];
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'loading' || !tab.url.match(arrowURLs.join('|'))) return;
    browser.tabs.executeScript({
        file: 'entry.bundle.js'
    });
});
