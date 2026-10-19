# The bets

62 bets in `data/slide-case-bets.csv`, placed in 21 rounds of `data/slide-case-rounds.csv`. Every bet settled against the single result of the round it was placed in.

Same inputs on every bet: client seed `000000000000000000033ab71b5fa7edcafe388e5f49719f1de8e1f8d0670460`, nonce `0`. The server seed is the round's.

## Checks

`node bets.js` runs three checks per bet:

```
sha256(server_seed) == hashed_server_seed     the revealed seed is the committed one
open_at <= placed_at <= end_at                the bet was placed inside its round's window
bet.result == result                          the stored result is the round's result
```

All 62 pass. Full output, with each round's hashed server seed, server seed and client seed, in [../results/bets.txt](../results/bets.txt).

## Sessions

The bets fall into three groups. Times are UTC, to the second; `open` is the round's `open_at`, `close` is its `end_at`, when betting closed and the server seed was revealed. `stakes` are USD, listed in the order the bets were placed. Rounds inside a session that have no bet are not listed here; `data/slide-case-rounds.csv` covers them.

### 15 May, 01:38–01:50

| round | open | close | result | stakes |
| --- | --- | --- | --- | --- |
| 1495 | 01:38:23 | 01:38:43 | 1.37x | 100000 |
| 1500 | 01:41:11 | 01:41:31 | 2.89x | 180000, 50000, 20000 |
| 1503 | 01:42:51 | 01:43:11 | 2.77x | 100000, 23333, 16599.85 |
| 1504 | 01:43:24 | 01:43:45 | 3.86x | 133333, 26666, 9907 |
| 1505 | 01:43:58 | 01:44:18 | 3.01x | 222222, 50000, 27778 |
| 1506 | 01:44:31 | 01:44:51 | 1.57x | 233333, 66667.24 |
| 1517 | 01:50:40 | 01:51:00 | 1.52x | 200000, 70000, 30000 |

### 15 May, 13:55

| round | open | close | result | stakes |
| --- | --- | --- | --- | --- |
| 2816 | 13:55:26 | 13:55:46 | 1.11x | 100000, 20000, 10080.15 |

### 16 May, 14:37–14:52

| round | open | close | result | stakes |
| --- | --- | --- | --- | --- |
| 5474 | 14:37:07 | 14:37:27 | 3.81x | 233333, 26108.4, 40000 |
| 5475 | 14:37:40 | 14:38:00 | 3.44x | 600000, 70000, 30000 |
| 5478 | 14:39:21 | 14:39:41 | 1.15x | 500000, 70000, 27992.93 |
| 5479 | 14:39:54 | 14:40:14 | 2.38x | 800000, 150000, 50000 |
| 5482 | 14:41:34 | 14:41:54 | 2.33x | 700000, 100000, 36000 |
| 5483 | 14:42:08 | 14:42:28 | 2.69x | 700000, 70000, 30526.08 |
| 5486 | 14:43:48 | 14:44:08 | 2.38x | 900000, 160000, 40000, 24494.29 |
| 5489 | 14:45:29 | 14:45:49 | 4.15x | 150000, 40000, 9910.1 |
| 5491 | 14:46:35 | 14:46:56 | 2.69x | 760000, 100000, 39595.43 |
| 5494 | 14:48:16 | 14:48:36 | 1.85x | 150000, 50000, 24898.86 |
| 5498 | 14:50:30 | 14:50:50 | 2.69x | 800000, 100000, 70000, 29550.47 |
| 5500 | 14:51:36 | 14:51:57 | 7.71x | 150000, 70000, 29887.62 |
| 5501 | 14:52:10 | 14:52:30 | 1.15x | 800000, 70000, 30108.94 |

[../results/replay.txt](../results/replay.txt) shows this session moved 5 minutes, 1, 5 and 20 hours earlier and later, settled against the results of those rounds.
