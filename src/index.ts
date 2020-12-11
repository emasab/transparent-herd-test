import transparentHerd from 'transparent-herd';
import { MongoClient } from 'mongodb';
import mongoUnit from 'mongo-unit';
let client: any;
let collection: any;
const numCalls: number = 30000;
const maxBatchSize: number = 10000;
const numMeasures: number = 100;

type SingleCallReturn = (...args: any[]) => Promise<any>;

const runBatched = async () => {
  const batched = async (args: object[][]): Promise<Promise<any>[]> => {
    // the object to insert is the first arg of each list of arguments
    const documents = args.map((arg) => arg[0]);
    try {
      const result = await collection.insertMany(documents);
      return documents.map(() => Promise.resolve(result));
    } catch (e) {
      return documents.map(() => Promise.reject(e));
    }
  };

  const single: SingleCallReturn = transparentHerd.single(batched, { maxBatchSize });

  const allPromises = [];
  for (let i = 0; i < numCalls; i++) {
    allPromises.push(single({ a: i }));
  }
  return await Promise.all(allPromises);
};

const runSingular = async () => {
  const allPromises = [];
  for (let i = 0; i < numCalls; i++) {
    allPromises.push(collection.insertOne({ a: i }));
  }
  return await Promise.all(allPromises);
};

const recreateCollection = async () => {
  if (collection) await collection.drop();
  collection = await client.db('test').collection('documents');
};

const main = async () => {
  await mongoUnit.start();
  client = new MongoClient(mongoUnit.getUrl(), { useUnifiedTopology: true });
  await client.connect();
  await recreateCollection();

  let before;
  let diff;
  const batchDurations = [];
  const singularDurations = [];
  const arrMean = (arr: number[]) => arr.reduce((a: number, b: number) => a + b, 0) / arr.length;
  const arrVariance = (arr: number[], mean: number) =>
    arr.reduce((a: number, b: number) => a + Math.pow(b - mean, 2), 0) / (arr.length - 1);

  for (let i = 0; i < numMeasures; i++) {
    before = new Date().getTime();
    await runBatched();
    diff = new Date().getTime() - before;
    batchDurations.push(diff);
    await recreateCollection();
    before = new Date().getTime();
    await runSingular();
    diff = new Date().getTime() - before;
    singularDurations.push(diff);
    await recreateCollection();
  }

  const batchedMean = arrMean(batchDurations);
  const singularMean = arrMean(singularDurations);

  const batchedVariance = arrVariance(batchDurations, batchedMean);
  const singularVariance = arrVariance(singularDurations, singularMean);

  const batchedStandardDeviation = Math.sqrt(batchedVariance);
  const singularStandardDeviation = Math.sqrt(singularVariance);

  console.log(`TOTAL RUNS: ${numMeasures}`);
  console.log(`batched duration mean: ${batchedMean.toFixed(2)}`);
  console.log(`batched duration variance: ${batchedVariance.toFixed(2)}`);
  console.log(`batched duration standard deviation: ${batchedStandardDeviation.toFixed(2)}`);
  console.log(`singular duration mean: ${singularMean.toFixed(2)}`);
  console.log(`singular duration variance: ${singularVariance.toFixed(2)}`);
  console.log(`singular duration standard deviation: ${singularStandardDeviation.toFixed(2)}`);

  client.close();
  await mongoUnit.stop();
};
main();
