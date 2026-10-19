#!/usr/bin/env node
'use strict';
const { FILES, loadRounds, fmtTime, rel } = require('./lib/data');
const { RTP, NONCE } = require('./lib/slide-vip');

const argv = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = argv.indexOf(name);
  return i === -1 ? dflt : argv[i + 1];
};
const file = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--cashouts') || FILES.rounds;
const cashouts = opt('--cashouts', '1.01,1.5,2,3,3.5,4,5,6,8,10,15,20,35,50,100').split(',').map(Number);

const pct = (x) => `${(100 * x).toFixed(2)}%`;
const signed = (x) => `${x >= 0 ? '+' : ''}${x.toFixed(2)}`;

const rounds = loadRounds(file);
const n = rounds.length;
const first = rounds[0];
const last = rounds[n - 1];
const pairs = rounds.slice(1).map((r, i) => [rounds[i], r]);

const hashed = rounds.filter((r) => r.hashedServerSeed !== null);
const stored = rounds.filter((r) => r.result !== null);
const timed = rounds.filter((r) => r.openAt && r.endAt);
const ordered = pairs.filter(([p, r]) => p.endAt && r.endAt);

const bad = {
  hash: hashed.filter((r) => r.computedHash !== r.hashedServerSeed),
  result: stored.filter((r) => r.result !== r.computed),
  gap: pairs.filter(([p, r]) => r.id !== p.id + 1),
  order: ordered.filter(([p, r]) => r.endAt <= p.endAt),
  window: timed.filter((r) => !(r.openAt < r.endAt)),
};
console.log(`file         ${rel(file)}`);
console.log(`rounds       ${n}  ids ${first.id}..${last.id}`);
if (first.endAt && last.endAt) console.log(`period       ${fmtTime(first.endAt, false)} .. ${fmtTime(last.endAt, false)} UTC`);
console.log(`client_seed  ${[...new Set(rounds.map((r) => r.clientSeed))].join(', ')}`);
console.log(`nonce        ${NONCE}`);
console.log(`formula      float = hmac_sha256(server_seed, client_seed:${NONCE}:0)[0..4] / 2^32`);
console.log(`             result = max(1.00, floor(100 * ${RTP} / float) / 100)`);
console.log('');

const line = (label, failed, total) => {
  const ok = total - failed;
  console.log(`${label.padEnd(44)} ${String(ok).padStart(6)} / ${String(total).padEnd(6)} ${failed ? 'FAIL' : 'ok'}`);
};
line('sha256(server_seed) == hashed_server_seed', bad.hash.length, hashed.length);
line('result == formula(server_seed)', bad.result.length, stored.length);
line('id == prev.id + 1', bad.gap.length, pairs.length);
line('end_at > prev.end_at', bad.order.length, ordered.length);
line('open_at < end_at', bad.window.length, timed.length);
console.log('');

console.log(`${'cashout'.padStart(8)}  ${'rounds >= t'.padStart(11)}  ${'observed'.padStart(8)}  ${'expected'.padStart(8)}  ${'rtp'.padStart(8)}  ${'z'.padStart(6)}`);
for (const t of cashouts) {
  const count = rounds.filter((r) => r.computed >= t).length;
  const p = Math.min(1, RTP / t);
  const z = (count - n * p) / Math.sqrt(n * p * (1 - p));
  console.log(`${(t.toFixed(2) + 'x').padStart(8)}  ${String(count).padStart(11)}  ${pct(count / n).padStart(8)}  ${pct(p).padStart(8)}  ${pct((count * t) / n).padStart(8)}  ${signed(z).padStart(6)}`);
}
const list = (title, rows, fmt) => {
  if (!rows.length) return;
  console.log(`\n${title} (${rows.length}):`);
  rows.slice(0, 25).forEach((r) => console.log(`  ${fmt(r)}`));
  if (rows.length > 25) console.log(`  ... ${rows.length - 25} more`);
};
list('hash mismatches', bad.hash, (r) => `id ${r.id}  csv ${r.hashedServerSeed}  sha256 ${r.computedHash}`);
list('result mismatches', bad.result, (r) => `id ${r.id}  stored ${r.result}  formula ${r.computed.toFixed(2)}  float ${r.float}`);
list('id gaps', bad.gap, ([p, r]) => `${p.id} -> ${r.id}  (${r.id - p.id - 1} missing)`);
list('end_at not after previous', bad.order, ([p, r]) => `id ${r.id}  ${fmtTime(r.endAt)}  prev ${fmtTime(p.endAt)}`);
list('open_at not before end_at', bad.window, (r) => `id ${r.id}  open ${fmtTime(r.openAt)}  end ${fmtTime(r.endAt)}`);

const failed = Object.values(bad).some((x) => x.length);
console.log('');
console.log(
  failed
    ? `FAIL  ${rel(file)}: see mismatches above`
    : `PASS  ${rel(file)}: ${n} rounds reproduce from (server_seed, client_seed, nonce ${NONCE})${hashed.length ? ' and match hashed_server_seed' : ''}`,
);
process.exit(failed ? 1 : 0);
