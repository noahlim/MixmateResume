import { MongoClient } from "mongodb";
import * as cfg from "./config.js";
let db;
const getDBInstance = async () => {
  if (db) {
    return db;
  }
  try {
    const client = new MongoClient(cfg.atlas, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const conn = await client.connect();
    db = conn.db(cfg.appdb);
  } catch (err) {
    console.log(err);
  }
  return db;
};

const addOne = (db, coll, doc) => db.collection(coll).insertOne(doc);
const count = (db, coll) => db.collection(coll).countDocuments();
const deleteAll = (db, coll) => db.collection(coll).deleteMany({});
const deleteMany = (db, coll, criteria) => db.collection(coll).deleteMany(criteria);
const addMany = (db, coll, docs) => db.collection(coll).insertMany(docs);
const findOne = (db, coll, criteria) => db.collection(coll).findOne(criteria);
const findAll = (db, coll, criteria, projection) =>
db
.collection(coll)
.find(criteria)
.project(projection)
.toArray();
const findUniqueValues = (db, coll, field) => db.collection(coll).distinct(field);
const updateOne = async (db, collectionName, criteria, update) => {
  try {
      const collection = db.collection(collectionName);
      const result = await collection.updateOne(criteria, { $set: update });
      return result;
  } catch (err) {
      console.error(err);
      throw err;
  }
};
const updateMany = async (db, collectionName, criteria, update) => {
  try {
    const collection = db.collection(collectionName);
    const result = await collection.updateMany(criteria, update);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const deleteOne = async (db, coll, criteria) => {
  try {
    const collection = db.collection(coll);
    const result = await collection.findOneAndDelete(criteria);
    return result.value;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export { getDBInstance, addOne, count, deleteAll, addMany, findOne, findAll, findUniqueValues, updateOne, deleteOne, updateMany, deleteMany };
