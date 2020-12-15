// Saves options to chrome.storage
function save_options() {
  const token = document.getElementById('token').value;
  const sourcelang = document.getElementById('sourcelang').value;
  const targetlang = document.getElementById('targetlang').value;

  // test
  console.warn('>>>>> token:', token);
  console.warn('>>>>> sourcelang:', sourcelang);
  console.warn('>>>>> targetlang:', targetlang);

  chrome.storage.sync.set({
    token: token,
    sourcelang: sourcelang,
    targetlang: targetlang
  }, function() {
    const status = document.getElementById('status');

    console.warn('>>>>> storage sync set:', status);

    status.textContent = 'Options saved.';
    setTimeout(() => { status.textContent = ''; }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    token: '',
    sourcelang: 'en',
    targetlang: 'ko'
  }, function(items) {
    document.getElementById('token').value = items.token;
    document.getElementById('sourcelang').value = items.sourcelang;
    document.getElementById('targetlang').value = items.targetlang;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

