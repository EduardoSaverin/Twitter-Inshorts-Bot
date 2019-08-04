const mongo = require('mongoose');
const CardSchema = new mongo.Schema({
    category: { type: String, required: true },
    headline: { type: String, required: true },
    body: { type: String },
    image: { type: String },
    read_more: { type: String }
});
module.exports = mongo.model('news', CardSchema);