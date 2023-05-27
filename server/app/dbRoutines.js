const MongoClient = require("mongodb").MongoClient;
const { DBURL, DB } = require('./config');

let db;

// get an instance of the database
const getDBInstance = async () => {
    if (db) {
        console.log("using established connection");
        return db;
    }
    try {
        console.log("establishing new connection to Atlas");
        const conn = await MongoClient.connect(DBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = conn.db(DB);
    } catch (err) {
        console.log(err);
    }
    return db;
};

const addOne = (db, coll, doc) => db.collection(coll).insertOne(doc);
const deleteAll = (db, coll) => db.collection(coll).deleteMany({});

const findOne = (db, coll, criteria) => db.collection(coll).findOne(criteria);
const findAll = (db, coll, criteria, projection) =>
    db
        .collection(coll)
        .find(criteria)
        .project(projection)
        .toArray();

const findUniqueValues = (db, coll, field) => db.collection(coll).distinct(field);


module.exports = { getDBInstance, addOne, deleteAll, findOne, findAll, findUniqueValues };