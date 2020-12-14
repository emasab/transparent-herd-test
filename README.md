# transparent-herd-test

this project contains a performance test of [transparent-herd](https://github.com/emasab/transparent-herd) in an example scenario of inserts against MongoDB.

The comparison is between singular inserts and bulk inserts with insertMany where the interface is kept with singular calls through _transparent-herd_ .

The test setup was of a single group of 30k inserts, an was repeated 100 times in both cases, the maxBatchSize of _transparent-herd_ was 10k. The mean time was more than an order of magnitude faster, 277.05 s vs 3546.28 s.

```
TOTAL RUNS: 100
batched duration mean: 277.05
batched duration variance: 1397.68
batched duration standard deviation: 37.39
singular duration mean: 3546.28
singular duration variance: 55994.35
singular duration standard deviation: 236.63
```