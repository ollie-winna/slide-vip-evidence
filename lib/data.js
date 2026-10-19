'use strict';
const fs = require('fs');
const path = require('path');
const { compute, NONCE } = require('./slide-vip');
const { hashSeed, hmacDigest } = require('./provably-fair');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILES = {
  rounds: path.join(DATA_DIR, 'slide-case-rounds.csv'),
  bets: path.join(DATA_DIR, 'slide-case-bets.csv'),
};

const readCsv = (file) => {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter((l) => l.trim() !== '');
  const header = lines.shift().split(',').map((h) => h.trim());
  return lines.map((l) => {
    const cells = l.split(',');
    return Object.fromEntries(header.map((h, i) => [h, (cells[i] || '').trim()]));
  });
};

const parseTime = (s) => {
  if (!s) return null;
  let t = s.replace(' ', 'T');
  if (/[+-]\d\d$/.test(t)) t += ':00';
  else if (!/(Z|[+-]\d\d:\d\d)$/.test(t)) t += 'Z';
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
};

const num = (s) => (s === undefined || s === '' ? null : Number(s));

const fmtTime = (d, ms = true) => (d ? d.toISOString().replace('T', ' ').slice(0, ms ? 23 : 19) : '');

const rel = (file) => {
  const r = path.relative(process.cwd(), file);
  return r.startsWith('..') ? file : r;
};

const loadRounds = (file = FILES.rounds) =>
  readCsv(file)
    .map((r) => {
      const seed = { serverSeed: r.server_seed.toLowerCase(), clientSeed: r.client_seed.toLowerCase(), nonce: NONCE };
      const c = compute(seed);
      return {
        id: Number(r.id),
        serverSeed: seed.serverSeed,
        clientSeed: seed.clientSeed,
        hashedServerSeed: r.hashed_server_seed ? r.hashed_server_seed.toLowerCase() : null,
        computedHash: hashSeed(seed.serverSeed),
        digest: hmacDigest(seed),
        openAt: parseTime(r.open_at),
        endAt: parseTime(r.end_at),
        result: num(r.result),
        float: c.float,
        floatPoint: c.floatPoint,
        computed: c.result,
      };
    })
    .sort((a, b) => a.id - b.id);

const loadBets = (file = FILES.bets) =>
  readCsv(file)
    .map((b) => ({
      placedAt: parseTime(b.placed_at),
      roundId: num(b.round_id),
      stake: Number(b.stake_usd),
      payout: Number(b.payout_usd),
      result: num(b.result),
    }))
    .sort((a, b) => a.placedAt - b.placedAt);

module.exports = { FILES, readCsv, parseTime, fmtTime, rel, loadRounds, loadBets };
