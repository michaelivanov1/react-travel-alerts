// assign processes to variables so there is less typing when used in other files
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    port: process.env.PORT,
    GOCALERTS: process.env.GOCALERTS,
    ISOCOUNTRIES: process.env.ISOCOUNTRIES,
    DBURL: process.env.DBURL,
    DB: process.env.DB,
    ALERTCOLLECTION: process.env.ALERTCOLLECTION,
    ADVISORIESCOLLECTION: process.env.ADVISORIESCOLLECTION,
    graphql: process.env.GRAPHQLURL
};
