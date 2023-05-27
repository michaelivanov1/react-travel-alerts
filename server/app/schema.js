const { buildSchema } = require("graphql");
// a file for the queries that we can execute 

const schema = buildSchema(`

type Query {
 setupalerts: Results,
 alerts: [ Alert ],
 alertsforregion(region: String) : [ Alert ],
 alertsforsubregion(subregion: String) : [ Alert ],
 advisoriesfortraveler(name: String) : [ Advisory ], 
 advisoriesforregion(region: String) : [ Alert ],
 advisoriesforsubregion(subregion: String) : [ Alert ],
 advisories: [ Advisory ],
 regions: [ String ],
 subregions: [ String ],
}

type Results {
 results: String
}

type Alert {
    country: String
    name: String
    text: String
    date: String
    region: String
    subregion: String
}

type Advisory {
    name: String
    country: String
    text: String
    date: String
}

type Mutation {
    addadvisory(name: String, country: String, text: String, date: String): Advisory
}
 
`);
module.exports = { schema };