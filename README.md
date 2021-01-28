# transparent-herd-test

this project contains a performance test of [transparent-herd](https://github.com/emasab/transparent-herd) in an example scenario of inserts against MongoDB.

The comparison is between singular inserts and bulk inserts with insertMany where the interface is kept with singular calls through _transparent-herd_ .

The test setup was of a single group of 30k inserts, an was repeated 100 times in both cases, the maxConcurrent parameter of _transparent-herd_ was 10. The mean time was more than an order of magnitude faster, 245.50 s vs 3752.11 s.

```
TOTAL RUNS: 100
batched duration mean: 245.50
batched duration variance: 4437.95
batched duration standard deviation: 66.62
singular duration mean: 3752.11
singular duration variance: 328345.01
singular duration standard deviation: 573.01
```