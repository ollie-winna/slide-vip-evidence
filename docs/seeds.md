# The rounds the bets fall in

The 62 bets in `data/slide-case-bets.csv` sit in 21 rounds of `data/slide-case-rounds.csv`. This is those 21 rows, and how to reproduce any one of them.

## Parameters

Fixed for every round:

- client seed `000000000000000000033ab71b5fa7edcafe388e5f49719f1de8e1f8d0670460` (Bitcoin block 779588)
- nonce `0`, cursor `0`
- RTP `0.98`

```
hashed_server_seed = sha256(server_seed)
float  = hmac_sha256(server_seed, client_seed:0:0)[0..4] / 2^32
result = max(1.00, floor(100 * 0.98 / float) / 100)
```

## The 21 rounds

Times are UTC on 15 May (rounds 1495–2816) and 16 May (rounds 5474–5501), truncated to the second. `open` is `open_at`; `first bet` is the earliest `placed_at` among the bets in that round.

| round | hashed_server_seed | server_seed | open | first bet | result |
| --- | --- | --- | --- | --- | --- |
| 1495 | `f13b8971fd5c8d1a5b90d09e42f3a5aabb70fadeb73756c47752e6a82d28a43a` | `f4cbd710df00fedca1e64e64d3c787f6b90ce81ad4b7b372e9d019068bd9c7a7` | 01:38:23 | 01:38:33 | 1.37x |
| 1500 | `fcf28dfaf982aec121216aa6bbb42e3cf2fbc5f195314f48c11705aba36be396` | `47ab7f41ed5b2c50105bd866dc085e9e30b797cde668f115103a28fea544d1ec` | 01:41:11 | 01:41:11 | 2.89x |
| 1503 | `eb647d336cc14c0a4dfe3403a2dbbcdd1f0953ea65e4e02e0d174322ea2c6683` | `5111ac2a5d56c2923dc292e506f1ab3c6e18c9e00064de51f4a02a1c4eef3a80` | 01:42:51 | 01:43:01 | 2.77x |
| 1504 | `ceb1eb3778759c09902d34f6d1ebdd54fc1bea910b2862a6dc5b4c99b282eb3a` | `8881a74c001bb3f8d0a10da93076338dbbc81c3ecbf70a34c1db4d4a62926ead` | 01:43:24 | 01:43:33 | 3.86x |
| 1505 | `50d2c10f7b1627c52921917c100f9b7ddc73bf96ff227b3f94af327dc22785a6` | `e4ff3afc68be46ed6cc906abca97289c5decc905aa35277f77594a85aac063c5` | 01:43:58 | 01:44:04 | 3.01x |
| 1506 | `f027dd87c098e21de6a998f866d4c289c876d898977f3ec10c13ce8653e72762` | `7309a5ea27b22207d4817ba72198f52edf78a916ffefc0f419c07f59576ee7f3` | 01:44:31 | 01:44:42 | 1.57x |
| 1517 | `074ab053d91748a2ed8d477a463245a52724c146cda64491bf4be822cba13a4f` | `9cfad16e8a8761d0755faf0b2cb06d2f6d54f836873ae2b3351fa76fca4963d5` | 01:50:40 | 01:50:41 | 1.52x |
| 2816 | `e0c3da7ab52773d21cbc6d40317cb376ed6d5f15660a1386d2066e8af259c0af` | `2f1bf9bc24536f69d9ed56e6469f0ad51ecdc07d80eb83681150b9a1ffde7e55` | 13:55:26 | 13:55:32 | 1.11x |
| 5474 | `18df8d009447aa850f57861c94df444c60aa7c2634c795d1b46ad855b770b98e` | `474610cdcebb35e1549add1298bca7ec527a37769c678318fdfb5874a4e1fd98` | 14:37:07 | 14:37:09 | 3.81x |
| 5475 | `a5f79bf5e940cb1d737697472d00ab159c713e222dea1cac2b0a08214655682c` | `f1e1d0f1f2cec8d827b9e43f6cdb4eca3764cbf2223037461827cef2d6c78c79` | 14:37:40 | 14:37:48 | 3.44x |
| 5478 | `ab3c3702cf253283f51e945aa574e77b650a94f71b66b9d407328d67900faa75` | `1b2ae4200d0dd66d4a754ea842c06a0eb037a1c100c6046fc02a04158f1d55a8` | 14:39:21 | 14:39:32 | 1.15x |
| 5479 | `49c140a66439a0806b7135a58b8401570e9762565de13a616b5748fc69ef4f56` | `fd5c47777a3bdac3c1043c39502a925fa7b1012fb79c3682f138d90430988cc4` | 14:39:54 | 14:40:00 | 2.38x |
| 5482 | `f8f074391018b0967c0c504ccbec458f98b6909356dbf3d8c712e732f892695c` | `604162685c66487f148ab53a1ae3f05418146276520df08d7f608adae623ac95` | 14:41:34 | 14:41:42 | 2.33x |
| 5483 | `59e0a6ba01728eab9232a06de4516e3e9fa1cab48922c4914c16cbb629b2fce1` | `933b74433ef7a3136db1c720e2d3e0bfe5f5bee58a7cabfc49eeebbe8010119c` | 14:42:08 | 14:42:13 | 2.69x |
| 5486 | `b34c32eeaac518f095e0a5da96e4ee56ef3c4256b7f794f12c8bf29d61c58d5d` | `041332d7e3bbd458d26c9be2ec09f000c11bc54eef4498f77056c5d84807acdf` | 14:43:48 | 14:43:51 | 2.38x |
| 5489 | `5d2829df4d4599431699a151acbcd976424427a2fdec6b568536445370d3e640` | `00e7f7a1abeab10e50b1de1fce669ffccffef3df2d6b51457c810ace970ffd4b` | 14:45:29 | 14:45:31 | 4.15x |
| 5491 | `f861237dd4391cbf1dd5b0314adc42f3a2a75b089fad781ec6d6fd7624a8ee6f` | `09a1a1a4d280bef70834aa96a803a759afb61e81252026269ab9a909f62c5a21` | 14:46:35 | 14:46:47 | 2.69x |
| 5494 | `9e65bb2d7c842d1d3268b26d7bc75cf010c10ec6d0418f5ee6848751110e37eb` | `7c4713715e3c6890a99087947ff83574219859b812e71fa9800a03d14181a102` | 14:48:16 | 14:48:17 | 1.85x |
| 5498 | `2c59dbfd6eb9588adf9e9b22e95b1f124e0a661fbcc8ed1ccba4c8049ad3b883` | `d424df1a38ae88464a410953f5ef516709fec47a3aa758e6899495f9d1ee3599` | 14:50:30 | 14:50:35 | 2.69x |
| 5500 | `45961c2f8d6c9e107d0e30a4ff4809769a796f17e721243a8f87d93aaff00638` | `ec0fe84616906a8d829c2e0632065a95139d6803176a02530bcc61236195c68b` | 14:51:36 | 14:51:43 | 7.71x |
| 5501 | `7c0fdb6933fca520621e6347548d86eb81d539d69eb92657069f4b0ae1204e36` | `76e60c066ccc55be8b0879c0a9557ebc61cbbfde9a81d6ffede945e9721b77e8` | 14:52:10 | 14:52:14 | 1.15x |

## One round by hand

Round 5479.

```
$ printf '%s' fd5c47777a3bdac3c1043c39502a925fa7b1012fb79c3682f138d90430988cc4 | shasum -a 256
49c140a66439a0806b7135a58b8401570e9762565de13a616b5748fc69ef4f56

$ printf '%s' 000000000000000000033ab71b5fa7edcafe388e5f49719f1de8e1f8d0670460:0:0 \
    | openssl dgst -sha256 -hmac fd5c47777a3bdac3c1043c39502a925fa7b1012fb79c3682f138d90430988cc4
691daf611baafdcea1e143816a88080d7c06fefc6ae467edb906902b4fa769ed
```

The sha256 equals the `hashed_server_seed` column. From the hmac:

```
0x691daf61            = 1763553121
1763553121 / 2^32     = 0.41060920828022063        float
0.98 / float          = 2.3866975709205187
floor(100 * that)/100 = 2.38                        result, as stored
```

`node bets.js` prints the hashed server seed, server seed and client seed for all 21 rounds, so each can be reproduced this way; `node verify.js` runs the hash and result checks over all 13,125. Output in [../results/bets.txt](../results/bets.txt) and [../results/verify.txt](../results/verify.txt).
