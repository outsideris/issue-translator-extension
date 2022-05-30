import { enableTranslation } from './translate';

let API_KEY = '';
let LANGUAGE = '';

chrome.storage.sync.get({
  token: '',
  lang: 'ko'
}, function(items) {
  API_KEY = items.token;
  LANGUAGE = items.lang;
  if (!API_KEY) {
    console.error('There is no API key in options for GitHub Translation.');
  } else {
    enableTranslation(API_KEY, LANGUAGE);
  }
});

chrome.runtime.onMessage.addListener(function(msg) {
  if (msg.action === 'rerun') {
    if (msg.url === location.href) {
      enableTranslation(API_KEY, LANGUAGE);
    }
  }
});
