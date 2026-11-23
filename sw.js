/* Kinetiq – offline service worker. Version: e4a3cf9e43 */
const V='hybrid-e4a3cf9e43',SHELL=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k.startsWith('hybrid-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  // the app itself: answer from cache at once (works offline), refresh the cache in the background
  if(r.mode==='navigate'||(u.origin===location.origin)){
    e.respondWith(caches.open(V).then(async c=>{const key=r.mode==='navigate'?'index.html':r;const hit=await c.match(key,{ignoreSearch:true});
      const net=fetch(r).then(res=>{if(res&&res.ok)c.put(key,res.clone());return res}).catch(()=>null);
      if(hit){e.waitUntil(net);return hit}const res=await net;return res||(await c.match('index.html'))||Response.error()}));return}
  // Google Fonts: cache on first online use, then serve offline
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(V+'-fonts').then(async c=>{const hit=await c.match(r);if(hit)return hit;try{const res=await fetch(r);if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}catch(x){return Response.error()}}))}});
