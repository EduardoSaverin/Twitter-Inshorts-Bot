const mongoose = require('mongoose');
const mongoUrl = "mongodb://root:12345@localhost:27017/posts";
const logger = require('./logger');
// Connect to MongoDB URL
mongoose.Promise = global.Promise;
// For Android
// mongoose.connect(mongoUrl, {useNewUrlParser: true })
mongoose.connect(mongoUrl, { auth: { authdb: "admin" }, useNewUrlParser: true }).then(() => {
    console.log('Connected to Mongo');
}).catch(function (err) {
    if (err) {
        logger.error(err);
        process.exit(0);
    }
});
const Schema = new mongoose.Schema({
    category: String,
    ids: [String]
});
module.exports = mongoose.model('Posts', Schema);

// Add user : db.createUser({ user:"root", pwd: "12345", roles: [{role: "userAdminAnyDatabase", db: "admin"}] })
// mongo --port 27017 -u "root" -p "12345" --authenticationDatabase "admin"