import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
// Install @electric-sql/pglite locally, or pass its module path for an isolated test environment.
const { PGlite } = await import(process.env.PGLITE_MODULE || "@electric-sql/pglite");
test("database enforces private access, quotas, leases, budget pause and bounded alerts", async () => {
 const db = new PGlite();
 try {
  await db.exec("create role anon; create role authenticated; create role service_role;");
  const sql = await readFile(new URL("../supabase/chat.sql", import.meta.url), "utf8");
  await db.exec(sql); await db.exec(sql);
  for (const role of ["anon","authenticated"]) {
   await db.exec("set role " + role);
   for (const table of ["chat_limits","chat_turns","chat_outbox","chat_control"]) await assert.rejects(() => db.exec("select * from public." + table));
   await assert.rejects(() => db.query("select public.chat_reserve($1,null,'message')",["a".repeat(64)]));
   await db.exec("reset role");
  }
  const reserve = async (ip="a".repeat(64),user=null,action="message") => (await db.query("select public.chat_reserve($1,$2,$3) as r",[ip,user,action])).rows[0].r;
  const release = async (ip,r,answer="respuesta") => db.query("select public.chat_finish($1,$2,$3,$4,$5,$6)",[ip,r.subject,r.lease,"consulta",answer,25]);
  const age = async () => db.exec("update public.chat_limits set last_call=now()-interval '11 seconds',busy_until=null");
  let r = await reserve(); assert.equal(r.code,"ok"); assert.equal(r.remaining,3);
  assert.equal((await reserve()).code,"cooldown");
  await release("a".repeat(64),r); await age();
  for(let n=0;n<3;n++) {r=await reserve();assert.equal(r.code,"ok");assert.deepEqual(r.history,[]);await release("a".repeat(64),r);await age();}
  assert.equal((await reserve()).code,"login_required");
  const user="11111111-1111-4111-8111-111111111111";
  r=await reserve("a".repeat(64),user);assert.equal(r.code,"ok");assert.deepEqual(r.history,[]);
  await release("a".repeat(64),r);await age();
  r=await reserve("b".repeat(64),user);assert.equal(r.history.length,1);
  await release("b".repeat(64),r);await age();
  // A different account behind the same IP never sees another user's history.
  r=await reserve("b".repeat(64),"22222222-2222-4222-8222-222222222222");assert.deepEqual(r.history,[]);
  await release("b".repeat(64),r);await age();
  await db.exec("update public.chat_limits set calls=20 where subject='user:" + user + "'");
  assert.equal((await reserve("c".repeat(64),user)).code,"daily_limit");
  // Queue abuse only after repeated rejected requests and block both IP/account.
  for(let n=0;n<8;n++) await reserve("c".repeat(64),user);
  assert.equal((await reserve("c".repeat(64),user)).code,"blocked");
  assert.equal((await db.query("select count(*)::int as n from public.chat_outbox where kind='abuse'")).rows[0].n,1);
  await db.exec("update public.chat_control set daily_budget=reserved where id=1");
  assert.equal((await reserve("d".repeat(64))).code,"paused");
  assert.equal((await db.query("select paused from public.chat_control")).rows[0].paused,true);
  // Agent requests still work during an IA pause.
  r=await reserve("e".repeat(64),null,"handoff");assert.equal(r.code,"ok");
  await db.query("select public.chat_handoff($1,$2,$3,$4,$5,$6)",["e".repeat(64),r.subject,r.lease,"Cliente","test@example.com","web"]);
  await age();
  r=await reserve("f".repeat(64),null,"local");assert.equal(r.code,"ok");
  const before=(await db.query("select reserved from public.chat_control")).rows[0].reserved;
  await release("f".repeat(64),r);
  assert.equal((await db.query("select reserved from public.chat_control")).rows[0].reserved,before);
  const claimed=(await db.query("select * from public.chat_claim_alerts()")).rows;
  assert.ok(claimed.length>=3);
  assert.equal((await db.query("select * from public.chat_claim_alerts()")).rows.length,0);
  await db.query("select public.chat_ack_alert($1,$2,true,'')",[claimed[0].id,claimed[0].lease]);
  assert.ok((await db.query("select sent_at from public.chat_outbox where id=$1",[claimed[0].id])).rows[0].sent_at);
  // Concurrent calls serialize: only one can acquire a lease for an IP.
  await db.exec("update public.chat_control set paused=false,daily_budget=200000");
  const parallel = await Promise.all([reserve("9".repeat(64)),reserve("9".repeat(64)),reserve("9".repeat(64))]);
  assert.equal(parallel.filter(x=>x.code==="ok").length,1);
 } finally { await db.close(); }
});
