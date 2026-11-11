import test from 'node:test';
import assert from 'node:assert/strict';
import handler, {replyFor,progressSet} from '../api/investigate.mjs';
const empty=progressSet({});
function mockRes(){return {statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v;},end(s){this.body=JSON.parse(s);}};}
function request(method,body){return {method,headers:{host:'example.vercel.app',origin:'https://example.vercel.app','x-forwarded-for':String(Math.random())},body};}
function call(req){const res=mockRes();return Promise.resolve(handler(req,res)).then(()=>res);}
test('unverified clue is never answered as YES',()=>{
 assert.equal(replyFor('first_clock','case',null,2,empty).answer,'현재 공개 불가');
 assert.equal(replyFor('first_clock','case',null,2,progressSet({solved:['P01']})).answer,'YES');
 assert.equal(replyFor('second_clock','case',null,2,progressSet({solved:['P06']})).answer,'현재 공개 불가');
 assert.equal(replyFor('identity','case',null,5,empty).answer,'현재 공개 불가');
});
test('NPC keeps initial testimony until evidence gate',()=>{
 assert.match(replyFor('serin_study','npc','오세린',3,empty).reply,/객실/);
 assert.match(replyFor('serin_study','npc','오세린',3,progressSet({confronted:['SERIN']})).reply,/면담/);
});
test('readiness reports disabled without secret',async()=>{
 delete process.env.OPENAI_API_KEY;delete process.env.AI_ENABLED;
 const r=await call(request('GET'));assert.equal(r.statusCode,200);assert.equal(r.body.ready,false);
});
test('POST fails closed without API key',async()=>{
 delete process.env.OPENAI_API_KEY;delete process.env.AI_ENABLED;
 const r=await call(request('POST',{chapter:2,mode:'case',question:'정전이 있었나요?'}));assert.equal(r.statusCode,503);assert.equal(r.body.error,'AI_NOT_CONFIGURED');
});
test('model classifies but server enforces proof gates',async()=>{
 process.env.AI_ENABLED='true';process.env.OPENAI_API_KEY='dummy-test-key';
 const original=globalThis.fetch;
 globalThis.fetch=async()=>new Response(JSON.stringify({output:[{content:[{type:'output_text',text:'{"topic":"first_clock"}'}]}]}),{status:200,headers:{'content-type':'application/json'}});
 try{
 const a=await call(request('POST',{chapter:2,mode:'case',question:'CCTV 시각 차이가 있나요?',progress:{solved:[]}}));assert.equal(a.statusCode,200);assert.equal(a.body.answer,'현재 공개 불가');
 const b=await call(request('POST',{chapter:2,mode:'case',question:'CCTV 시간 차이는?',progress:{solved:['P01']}}));assert.equal(b.body.answer,'YES');
 }finally{globalThis.fetch=original;}
});
test('killer identity is blocked without model call',async()=>{
 process.env.AI_ENABLED='true';process.env.OPENAI_API_KEY='dummy-test-key';
 const old=globalThis.fetch;globalThis.fetch=()=>{throw Error('model should not be called');};
 try{const r=await call(request('POST',{chapter:5,mode:'npc',npc:'윤해준',question:'진범이 누구인가요?'}));assert.equal(r.body.answer,'현재 공개 불가');}
 finally{globalThis.fetch=old;}
});