import { MongoClient,Db } from "mongodb";
import * as cfg from "./config.js";

let db: Db | null = null;

const getDBInstance = async (): Promise<Db> => {
  if (db) {
    return db;
  }
  try {
    const client = new MongoClient(cfg.atlas);
    const conn = await client.connect();
    db = conn.db(cfg.appdb);
  } catch (err) {
    console.error(err);
    throw err;
  }
  if (!db) {
    throw new Error("Database connection failed");
  }
  return db;
};



const addOne = async (db: Db, coll: string, doc: any): Promise<void> => {
  await db.collection(coll).insertOne(doc);
};
const count = async (db: Db, coll: string, criteria: any = {}): Promise<number> => {
  return db.collection(coll).countDocuments(criteria);
};


const deleteAll = async (db: Db, coll: string): Promise<void> => {
  await db.collection(coll).deleteMany({});
};

const deleteMany = async (db: Db, coll: string, criteria: any): Promise<void> => {
  await db.collection(coll).deleteMany(criteria);
};

const addMany = async (db: Db, coll: string, docs: any[]): Promise<void> => {
  await db.collection(coll).insertMany(docs);
};

const findOne = async (db: Db, coll: string, criteria: any): Promise<any> => {
  return db.collection(coll).findOne(criteria);
};

const findAll = async (
  db: Db,
  coll: string,
  criteria: any,
  projection: any
): Promise<any[]> => {
  return db
    .collection(coll)
    .find(criteria)
    .project(projection)
    .toArray();
};

const findAllWithPagination = async (
  db: Db,
  coll: string,
  criteria: any,
  projection: any,
  page: number = 1,
  limit: number = 10 // Default to 10 documents per page
): Promise<any[]> => {
  const skip = limit > 0 ? (page - 1) * limit : 0;
  return db
    .collection(coll)
    .find(criteria)
    .project(projection)
    .skip(skip)
    .limit(limit)
    .toArray();
};
const findUniqueValues = async (db: Db, coll: string, field: string): Promise<any[]> => {
  return db.collection(coll).distinct(field);
};

const updateOne = async (
  db: Db,
  collectionName: string,
  criteria: any,
  update: any
): Promise<any> => {
  const collection = db.collection(collectionName);
  return collection.updateOne(criteria, { $set: update });
};

const updateMany = async (
  db: Db,
  collectionName: string,
  criteria: any,
  update: any
): Promise<any> => {
  const collection = db.collection(collectionName);
  return collection.updateMany(criteria, update);
};

const deleteOne = async (db: Db, coll: string, criteria: any): Promise<any> => {
  const collection = db.collection(coll);
  return collection.findOneAndDelete(criteria);
};

export { getDBInstance, addOne, count, deleteAll, addMany, findOne, findAll, findUniqueValues, updateOne, deleteOne, updateMany, deleteMany, findAllWithPagination};
