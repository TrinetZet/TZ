(() => {
'use strict';
const bridge = window.ClientBridgeAndroid;
if (!bridge) return;
let sequence = 0, timer;
const pending = new Map();
function toast(message) { const el=document.querySelector('#toast'); if(!el)return; el.textContent=message;el.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>el.classList.remove('visible'),4500); }
bridge.onmessage = event => { try { const reply=JSON.parse(event.data), done=pending.get(reply.id);if(done){pending.delete(reply.id);done(reply);} } catch {} };
function request(type,text,name) { return new Promise(resolve=>{const id=String(++sequence);pending.set(id,resolve);try{bridge.postMessage(JSON.stringify({id,type,text,name}));}catch{pending.delete(id);resolve({error:'Native action unavailable.'});}}); }
document.addEventListener('click', async event => {
 const button=event.target.closest('[data-copy],[data-download],[data-export]'); if(!button)return;
 event.preventDefault();event.stopImmediatePropagation();
 let type='save',text,name;
 if(button.hasAttribute('data-export')) {text=localStorage.getItem('clientbridge.progress.v1') || JSON.stringify({version:1,active:null,answers:{},reviews:{},history:[],drafts:{}});name='clientbridge-progress.json';}
 else {text=document.querySelector('#client-email').value;name=`clientbridge-${button.dataset.download || 'email'}-email.txt`;if(button.hasAttribute('data-copy'))type='copy';}
 const reply=await request(type,text,name);
 toast(reply.ok ? (type==='copy'?'Email copied.':'File saved in your chosen location.') : reply.cancelled?'Save cancelled.':reply.error || 'Could not complete this action.');
},true);
})();
