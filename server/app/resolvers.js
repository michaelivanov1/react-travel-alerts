const dbRtns = require("./dbRoutines");
const setUpAlerts = require("./setUpAlerts");
const { ALERTCOLLECTION, ADVISORIESCOLLECTION } = require("./config");


// resolvers are collection of functions that generate the response for a graphql query
const resolvers = {
    setupalerts: async () => {
        return await setUpAlerts.loadISOCountries();
    },

    alerts: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, ALERTCOLLECTION, {}, {});
    },

    alertsforregion: async args => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, ALERTCOLLECTION, { region: args.region }, {});
    },

    alertsforsubregion: async args => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, ALERTCOLLECTION, { subregion: args.subregion }, {});
    },

    regions: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findUniqueValues(db, ALERTCOLLECTION, "region");
    },

    subregions: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findUniqueValues(db, ALERTCOLLECTION, "subregion");
    },

    advisories: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, ADVISORIESCOLLECTION, {}, {});
    },

    // add an advisory into the advisory collection
    addadvisory: async (args) => {
        let db = await dbRtns.getDBInstance();
        let data = { name: args.name, country: args.country, text: args.text, date: args.date };
        let results = await dbRtns.addOne(db, ADVISORIESCOLLECTION, data);
        return results.acknowledged ? data : null;
    },

    advisoriesfortraveler: async args => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, ADVISORIESCOLLECTION, { name: args.name }, {});
    },

    advisoriesforregion: async args => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, ALERTCOLLECTION, { region: args.region }, {});
    },

    advisoriesforsubregion: async args => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, ALERTCOLLECTION, { subregion: args.subregion }, {});
    },

};

module.exports = { resolvers };