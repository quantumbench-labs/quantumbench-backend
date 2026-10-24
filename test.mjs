import{test}from'node:test';import assert from'node:assert/strict';import{allowed}from'./server.mjs';import{networkStatus,baseline}from'./capture.mjs';
test('network mismatch stops before fetching ledger',async()=>assert.rejects(()=>networkStatus({server:{getNetwork:async()=>({passphrase:'other'})}}),/Wrong network/));
test('observed protocol 29 has no native ML-DSA measurements',async()=>{const s=await networkStatus({server:{getNetwork:async()=>({passphrase:'Test SDF Network ; September 2015',protocolVersion:29}),getLatestLedger:async()=>({sequence:1})}});assert.equal(s.nativeMlDsa,false);assert.equal(s.nativeHostMeasurement,null)});
test('origin and Host boundaries enforced',()=>{assert.equal(allowed({host:'127.0.0.1:4601'}),true);assert.equal(allowed({host:'evil.test'}),false);assert.equal(allowed({host:'127.0.0.1:4601',origin:'http://evil.test'}),false)});
test('invalid baseline identity rejected before RPC',async()=>assert.rejects(()=>baseline({},{}),/Invalid baseline/));
