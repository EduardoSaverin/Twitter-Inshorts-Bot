const inshorts = require("./Inshorts-API").init();
const categories = ['national', 'business', 'sports', 'world', 'politics', 'science', 'technology', 'startup', 'entertainment', 'automobile', 'miscellaneous', 'hatke'];
const Posts = require('./mongo');
const crypto = require("crypto");
const Tweet = require('./twitter');
const logger = require('./logger');
const News = require('./CardsSchema');
function newsHandler(result) {
    result && Object.keys(result).forEach(async (item, index) => {
        logger.info('Running for category : ' + this.category);
        let { headline, body, read_more, category, image, posted_on } = result[item];

        let digest = getHash(item);
        let url = getPathFromUrl(read_more);
        if (url && url.toLowerCase().indexOf('inshorts.com') > -1) {
            // Don't post any inshort URLs.
            // We may do logging here later.
            return;
        }
        await Posts.find({ category: this.category, ids: { "$in": [digest] } }).then((response) => {
            if (response && response.length == 0) {
                Posts.findOneAndUpdate({ category: this.category }, { $push: { ids: digest } }, { upsert: true }).then(async (post) => {
                    new News({ 'headline': headline, 'body': body, 'category': category, 'read_more': url, 'image': image, posted_on }).save().then(response => {
                        return;
                    }).catch(error => {
                        logger.error('Error in Saving News', error);
                        return;
                    })
                    // await Tweet({ headline, url }).then((response) => {
                    // });
                });
            }
        });
        logger.info('Ended...' + this.category);
    });
}
function getHash(content) {
    let hash = crypto.createHash("md5");
    hash.setEncoding("hex");
    hash.write(content);
    hash.end();
    return hash.read();
}
function getPathFromUrl(urlString) {
    if (!urlString) return "";
    if (urlString && urlString.toLowerCase().indexOf("youtube.com") > -1) {
        let url = new URL(urlString);
        urlString = urlString.split(/[?#]/)[0];
        urlString += '?v=' + url.searchParams.get("v");
        return urlString;
    }
    return urlString.split(/[?#]/)[0];
}
module.exports = () => {
    let promises = [];
    for (category of categories) {
        this.category = category;
        (function (category) {
            promises.push(inshorts.getNews(category).then((response) => { console.log('Got Response'); newsHandler.call({ category }, response) }).catch((err) => { logger.error(err); }))
        })(category);
    }
    Promise.all(promises).then(() => {
        return true;
    });
}