#!/usr/bin/env node
'use strict';
const { FILES, loadRounds, loadBets, fmtTime, rel } = require('./lib/data');
const { RTP, NONCE } = require('./lib/slide-vip');

const [roundsFile = FILES.rounds, betsFile = FILES.bets] = process.argv.slice(2);
const rounds = new Map(loadRounds(roundsFile).map((r) => [r.id, r]));
const bets = loadBets(betsFile);

const byRound = new Map();
for (const b of bets) {
  if (!byRound.has(b.roundId)) byRound.set(b.roundId, []);
  byRound.get(b.roundId).push(b);
}

const failures = [];
const usd = (x) => x.toFixed(2);
const label = (b) => `${fmtTime(b.placedAt)}  stake ${usd(b.stake)}`;

console.log(`rounds   ${rel(roundsFile)}  (${rounds.size} rounds)`);
console.log(`bets     ${rel(betsFile)}  (${bets.length} bets in ${byRound.size} rounds)`);
console.log(`client   ${[...rounds.values()][0].clientSeed}`);
console.log(`formula  float = hmac_sha256(server_seed, client_seed:${NONCE}:0)[0..4] / 2^32;  result = max(1.00, floor(100 * ${RTP} / float) / 100)`);
console.log(`checks   sha256(server_seed) == hashed_server_seed;  open_at <= placed_at <= end_at;  bet.result == result`);

for (const [id, list] of [...byRound].sort((a, b) => a[0] - b[0])) {
  const r = rounds.get(id);
  console.log('');
  if (!r) {
    console.log(`round ${id}  not in ${rel(roundsFile)}`);
    list.forEach((b) => failures.push(`${label(b)}  round ${id} missing`));
    continue;
  }
  const hashOk = r.hashedServerSeed === null || r.computedHash === r.hashedServerSeed;
  console.log(`round ${id}  open ${fmtTime(r.openAt)}  end ${fmtTime(r.endAt)}  result ${r.computed.toFixed(2)}`);
  console.log(`  hashed_server_seed  ${r.hashedServerSeed || '-'}`);
  console.log(`  server_seed         ${r.serverSeed}`);
  console.log(`  client_seed         ${r.clientSeed}`);
  for (const b of list) {
    const inWindow = r.openAt && r.endAt && b.placedAt >= r.openAt && b.placedAt <= r.endAt;
    const resultOk = b.result === null || b.result === r.computed;
    const problems = [!hashOk && 'hash', !inWindow && 'window', !resultOk && 'result'].filter(Boolean);
    if (problems.length) failures.push(`${label(b)}  round ${id}  ${problems.join(', ')}`);
    console.log(
      `  ${fmtTime(b.placedAt)}  stake ${usd(b.stake).padStart(10)}` +
        `  result ${b.result === null ? '-' : b.result.toFixed(2)}  ${problems.length ? `FAIL ${problems.join(', ')}` : 'ok'}`,
    );
  }
}

console.log('');
if (failures.length) {
  console.log(`\nfailures (${failures.length}):`);
  failures.forEach((f) => console.log(`  ${f}`));
  console.log(`\nFAIL  ${failures.length} / ${bets.length} bets`);
  process.exit(1);
}
console.log(`PASS  ${bets.length} / ${bets.length} bets placed inside their round window and settled on the result derived from the revealed server_seed`);
