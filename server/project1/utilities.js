const got = require("got");

// function to return raw json data 
const getJSONFromWWWPromise = async (url) => {
    try {
        let response = await got(url, { responseType: "json" })
        let data = response.body;
        return data;
    } catch(err) {
        console.log('something went wrong: ' + err);
    } 
}

module.exports = { getJSONFromWWWPromise };