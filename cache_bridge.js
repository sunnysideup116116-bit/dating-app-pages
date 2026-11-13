/* Account data lives in IndexedDB, separately from the public app shell. */
(() => {
  let database;
  function open() {
    return database ??= new Promise((resolve, reject) => {
      const request = indexedDB.open('folks-cache-v2', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('entries');
      request.onsuccess = () => {
        request.result.onversionchange = () => { request.result.close(); database = null; };
        resolve(request.result);
      };
      request.onerror = () => { database = null; reject(request.error); };
    });
  }
  async function run(mode, operation) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('entries', mode);
      const request = operation(transaction.objectStore('entries'));
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = transaction.onerror = () => reject(transaction.error || request.error);
    });
  }
  const channel = typeof BroadcastChannel === 'function' ? new BroadcastChannel('folks-account-cache') : null;
  let onClear = () => {};
  if (channel) channel.onmessage = event => onClear(String(event.data));
  addEventListener('storage', event => {
    if (event.key === 'folks-cache-clear' && event.newValue) onClear(JSON.parse(event.newValue).user);
  });
  window.folksCache = {
    read: key => run('readonly', store => store.get(key)).then(value => value == null ? null : new Uint8Array(value)),
    write: (key, bytes) => run('readwrite', store => store.put(bytes.slice().buffer, key)),
    remove: key => run('readwrite', store => store.delete(key)),
    keys: () => run('readonly', store => store.getAllKeys()),
    onClear: callback => { onClear = callback; },
    broadcastClear: user => {
      if (channel) channel.postMessage(user);
      else { try { localStorage.setItem('folks-cache-clear', JSON.stringify({user, at: Date.now()})); } catch (_) {} }
    }
  };
})();
