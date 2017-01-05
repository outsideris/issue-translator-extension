// Saves options to chrome.storage
function save_options() {
  const token = document.getElementById('token').value;
  chrome.storage.sync.set({
    token: token,
  }, function() {});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    token: ''
  }, function(items) {
    document.getElementById('token').value = items.token;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

