# transparent-herd-test

this project contains a performance test of [transparent-herd](https://github.com/emasab/transparent-herd) in an example scenario of inserts against MongoDB.

The comparison is between singular inserts and bulk inserts with insertMany where the interface is kept with singular calls through _transparent-herd_ .

The test setup was of a single group of 30k inserts, an was repeated 100 times in both cases, the maxConcurrent parameter of _transparent-herd_ was 10. The mean time was more than an order of magnitude faster, 204.40 ms vs 3121.41 ms.

```
TOTAL RUNS: 100
batched duration mean: 204.40
batched duration variance: 1189.76
batched duration standard deviation: 34.49
singular duration mean: 3121.41
singular duration variance: 13670.75
singular duration standard deviation: 116.92
```