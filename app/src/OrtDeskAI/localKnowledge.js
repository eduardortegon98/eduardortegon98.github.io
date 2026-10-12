const DB='ortdesk-knowledge-v1',STORE='sources';
function database(){
 return new Promise((resolve,reject)=>{
  const request=indexedDB.open(DB,1);
  request.onupgradeneeded=()=>{const store=request.result.createObjectStore(STORE,{keyPath:['owner','id']});store.createIndex('owner','owner');};
  request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
  request.onblocked=()=>reject(new Error('Storage blocked'));
 });
}
export async function readSources(owner){
 const db=await database();
 try{return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),request=tx.objectStore(STORE).index('owner').getAll(owner);request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
 finally{db.close();}
}
export async function writeSources(owner,items){
 const db=await database();
 try{await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');for(const item of items)tx.objectStore(STORE).put({...item,owner});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Storage aborted'));});}
 finally{db.close();}
}
export async function removeSource(owner,id){
 const db=await database();
 try{await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete([owner,id]);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Storage aborted'));});}
 finally{db.close();}
}
