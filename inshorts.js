const inshorts = require("./Inshorts-API").init();
const categories = ['national','business','sports','world','politics','technology','startup','entertainment','miscellaneous'];
const Posts = require('./mongo');
const crypto = require("crypto");
const Tweet = require('./twitter');
const logger = require('./logger');

function newsHandler(result){
    result && result.headline.forEach(async (item,index) => {
            let digest = getHash(item);
            let content = result.headline[index];
            let url = getPathFromUrl(result.read_more[index]);
            if(url && url.toLowerCase().indexOf('inshorts.com') > -1){
                // Don't post any inshort URLs.
                // We may do logging here later.
                return;
            }
                await Tweet(content, url).then((response) => {
                    if (response == '200') {
                        Posts.find({ category: this.category, ids: { "$in": [digest] } }).then((response) => {
                            if (!response) {
                                Posts.findOneAndUpdate({ category: this.category }, { $push: { ids: digest } }, { upsert: true }).then((post) => {
                                });
                            }
                        });
                    } else {
                        logger.error("We got some error in Tweet " + response);
                    }
                })
            
            
    });
    logger.info('Ended...'+this.category);
}
function getHash(content){
    let hash = crypto.createHash("md5");
    hash.setEncoding("hex");
    hash.write(content);
    hash.end();
    return hash.read();
}
function getPathFromUrl(urlString) {
    if(urlString && urlString.toLowerCase().indexOf("youtube.com")>-1){
        let url = new URL(urlString);
        urlString = urlString.split(/[?#]/)[0];
        urlString += '?v='+url.searchParams.get("v");
        return urlString;
    }
    return urlString.split(/[?#]/)[0];
}
module.exports = () => {
    let promises = [];
    for(category of categories){
        this.category = category;
        logger.info('Running for category : ' + category);
        (function(category){
            promises.push(inshorts.getNews(category).then((response) => {newsHandler.call({category},response)}).catch((err) => { console.log(err); }))
        })(category);
    }
    Promise.all(promises).then(() => {
        return true;
    });
}