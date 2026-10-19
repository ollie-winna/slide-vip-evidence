# slide-vip

Rounds, seeds, hashes and bets from a Slide VIP session (14–19 May 2026), and the scripts that check them.

## What's in this repo

| path | what it is |
| --- | --- |
| `data/slide-case-rounds.csv` | every round in the period, 13,125 rows: committed hash, revealed server seed, client seed, times, result |
| `data/slide-case-bets.csv` | the 62 bets of the session, with the round each was placed in |
| `lib/provably-fair.js` | the HMAC-SHA256 float generator, `hashSeed`, `generateServerSeed` |
| `lib/slide-vip.js` | the result formula |
| `verify.js` | checks every round: hash, result, id order, timing, RTP by cashout |
| `bets.js` | checks every bet against its round: window, result |
| `docs/seeds.md` | the 21 rounds the bets fall in, with a worked example |
| `docs/bets.md` | the bets grouped by round and session |
| `results/` | the output of the two scripts, and `replay.txt`: the 16 May session moved 5 minutes, 1, 5 and 20 hours earlier and later, settled against the real results |

## Data

| file | columns |
| --- | --- |
| `data/slide-case-rounds.csv` | `id, result, client_seed, end_at, server_seed, hashed_server_seed, open_at` |
| `data/slide-case-bets.csv` | `placed_at, round_id, stake_usd, payout_usd, result` |

## Algorithm

`lib/provably-fair.js` and `lib/slide-vip.js` are the game's own code. For every round:

```
hashed_server_seed = sha256(server_seed)                          shown before the round
float  = hmac_sha256(server_seed, client_seed:0:0)[0..4] / 2^32
result = max(1.00, floor(100 * 0.98 / float) / 100)               server_seed revealed at end_at
```

## Scripts

```
node verify.js [rounds.csv]            every round: hash, result, id order, timing, RTP by cashout
node bets.js   [rounds.csv] [bets.csv] every bet: round window, result, with the round's seeds
```

Exit code 0 means every check passed. Node 18+, no dependencies.

The output of each script is saved in `results/` (`verify.txt`, `bets.txt`). `npm run results` regenerates them. `results/replay.txt` is a table, not a script output.

## By hand

```
printf '%s' "$SERVER_SEED" | shasum -a 256
printf '%s' "$CLIENT_SEED:0:0" | openssl dgst -sha256 -hmac "$SERVER_SEED"
```

The first 8 hex digits of the hmac, as an unsigned integer, divided by 2^32 is `float`.
