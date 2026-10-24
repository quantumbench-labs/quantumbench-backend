import http from'node:http';import{readFile}from'node:fs/promises';import{runSuite}from'../quantumbench-runner/index.mjs';import{networkStatus,baseline}from'./capture.mjs';
export function allowed(h){return ['127.0.0.1:4600','127.0.0.1:4601'].includes(h.host)&&(!h.origin||h.origin==='http://127.0.0.1:4600')}
const vectorBundle=async()=>JSON.parse(await readFile(new URL('../quantumbench-vectors/vectors.json',import.meta.url)));
export function createBackend(){return http.createServer(async(req,res)=>{res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');try{if(!allowed(req.headers)){res.writeHead(403);res.end(JSON.stringify({error:'Local origin required'}));return}let r;
if(req.method==='GET'&&req.url==='/health')r={ok:true,signing:false};
else if(req.method==='GET'&&req.url==='/vectors')r=await vectorBundle();
else if(req.method==='GET'&&req.url==='/evidence')r=JSON.parse(await readFile(new URL('testnet-evidence.json',import.meta.url)));
else if(req.method==='POST'&&req.url==='/offline'){let b='';for await(const c of req){b+=c;if(Buffer.byteLength(b)>1048576)throw Error('Body limit 1 MiB')}const data=JSON.parse(b);r=runSuite(data.bundle||await vectorBundle(),{iterations:data.iterations??20})}
else if(req.method==='POST'&&req.url==='/network')r=await networkStatus();
else if(req.method==='POST'&&req.url==='/baseline')r=await baseline(JSON.parse(await readFile(new URL('specimen.json',import.meta.url))),(await vectorBundle()).vectors[0]);
else{res.writeHead(404);r={error:'Unknown endpoint'}}res.end(JSON.stringify(r));}catch(e){res.writeHead(400);res.end(JSON.stringify({error:e.message}))}})}
if(process.argv[1]===new URL(import.meta.url).pathname)createBackend().listen(4601,'127.0.0.1');
