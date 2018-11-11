const Constants = require('./constants');
const logger = require('./logger');
const twitter = require('twitter');
function tweet(content,url) {
    let client = new twitter({
        consumer_key: Constants.consumer_key,
        consumer_secret: Constants.consumer_secret,
        access_token_key: Constants.access_token_key,
        access_token_secret: Constants.access_token_secret
    });
    return new Promise((resolve,reject) => {
        client.post('statuses/update', { status: content + '\n' + url }, (error, tweet, response) => {
            if (response && response.statusCode != '200'){
                logger.error(response);
            }
            resolve((response && response.statusCode));
        });
    });
}
/*tweet("Hello","https://twitter.com/").then(
    (response) => console.log(response)
)*/
module.exports = tweet;