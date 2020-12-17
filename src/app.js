import { enableTranslation } from './translate';

let API_KEY = '';
let SOURCE_LANG = '';
let TARGET_LANG= '';

chrome.storage.sync.get({
  token: '',
  sourcelang: 'en',
  targetlang: 'ko'
}, function(items) {
  API_KEY = items.token;
  SOURCE_LANG = items.sourcelang;
  TARGET_LANG = items.targetlang;
  if (!API_KEY) {
    console.error('There is no API key in options for GitHub Translation.');
  } else {
    enableTranslation(API_KEY, SOURCE_LANG, TARGET_LANG);
  }
});

chrome.extension.onMessage.addListener(function(msg) {
  if (msg.action === 'rerun') {
    if (msg.url === location.href) {
      enableTranslation(API_KEY, SOURCE_LANG, TARGET_LANG);
    }
  }
});
