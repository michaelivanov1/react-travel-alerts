const utilities = require("./utilities");
const { GOCALERTS, ISOCOUNTRIES, ALERTCOLLECTION } = require("./config");
const dbRoutines = require("./dbRoutines");

let resultArray = [];
let results = "";

loadISOCountries = async () => {
    try {
        let isoJson = [];
        let alertJson = [];
        let isoCountrys = [];
        let allAlertsData = [];

        // create instance of db
        dbInstance = await dbRoutines.getDBInstance();

        // delete any existing documents from an alerts collection
        await dbRoutines.deleteAll(dbInstance, ALERTCOLLECTION);

        // obtain iso countries data and place into an array
        isoJson = await utilities.getJSONFromWWWPromise(ISOCOUNTRIES);

        // loop through the array using .map and promise.allsettled 
        // and create a new array full of country codes from isocountries
        resultArray = await Promise.allSettled(
            isoJson.map((country) => {
                isoCountrys.push(country);
            })
        );

        console.log(`Deleted ${resultArray.length} existing documents from the alerts collection`);

        // obtain the goc alerts data
        alertJson = await utilities.getJSONFromWWWPromise(GOCALERTS);

        // with each country, look up corresponding JSON in alertJson
        isoCountrys.forEach((country) => {
            // country without alerts
            if (alertJson.data[country["alpha-2"]] == null) {
                let alertObject = {
                    country: country["alpha-2"],
                    name: country.name,
                    text: "No Travel Alerts",
                    date: "",
                    region: country["region"],
                    subregion: country["sub-region"]
                }
                allAlertsData.push(alertObject);
                // country with alerts
            } else {
                let alertObject = {
                    country: country["alpha-2"],
                    name: country.name,
                    text: alertJson.data[country["alpha-2"]]["eng"]["advisory-text"],
                    date: alertJson.data[country["alpha-2"]]["eng"]["friendly-date"],
                    region: country["region"],
                    subregion: country["sub-region"]
                }
                allAlertsData.push(alertObject);
            }
        });

        resultArray = await Promise.allSettled(
            allAlertsData.map((data) => {
                dbRoutines.addOne(dbInstance, ALERTCOLLECTION, data);
            })
        );

        console.log(`Retrieved Alert JSON from remote web site.`);
        console.log(`Retrieved Country JSON from remote web site.`);
        console.log(`Added approximately ${resultArray.length} new documents to the alerts collection`);

        results = `Deleted ${resultArray.length} existing documents from the alerts collection.\
        Retrieved Alert JSON from remote web site. Retrieved Country JSON from remote web site. Added approximately ${resultArray.length} new documents back to the alerts collection`;

    } catch (err) {
        console.log('error: ' + err);
    } finally {
        return { results: results }
    }
}

loadISOCountries();
module.exports = { loadISOCountries };