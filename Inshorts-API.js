var request = require("request");
var cheerio = require('cheerio');
const logger = require('./logger');
var init = function () {
    return {
        getNews: getNews()
    }
}
var getNews = function () {
    return function (name) {
        return new Promise(async (resolve, reject) => {
            await request.get({
                url: 'https://inshorts.com/en/read/' + name,
                method: 'GET',
                headers: {}
            }, function (err, response, body) {
                if (err) {
                    console.log("err");
                    reject(err);
                } else if (!response) {
                    reject("No response recieved (check internet connection)");
                } else if (response.statusCode == 400) {
                    reject("Error: Bad request");
                } else if (response.statusCode == 401) {
                    reject("Error: Unauthorized. Authentication info not sent or invalid");
                } else if (response.statusCode == 403) {
                    reject("Authenticated user is not allowed access");
                } else if (response.statusCode == 404) {
                    reject("Error: Not found");
                } else if (response.statusCode == 410) {
                    reject("Error: URL expired");
                } else if (response.statusCode == 500) {
                    reject("Error: Internal server error");
                } else if (response.statusCode == 503) {
                    reject("Error: Service unavailable");
                } else if (response.statusCode == 599) {
                    reject("Error: Connection timed out");
                } else if (response.statusCode == 422) {
                    reject("Error: Domain name error");
                } else if (response.statusCode == 200) {
                    var $ = cheerio.load(body);
                    let elements = $("div.news-card");
                    let result = {};
                    elements.each(function (i, element) {
                        let newsObj = {
                            body: '',
                            image: '',
                            headline: '',
                            read_more: '',
                            category: name
                        };
                        // Body
                        $(element).find("[itemprop='articleBody']").each(function (i, elem) {
                            newsObj['body'] = $(this).text();
                        });
                        // Image URL
                        $(element).find(".news-card-image").each(function (i, elem) {
                            var bg = $(this).css("background-image")
                            newsObj['image'] = bg.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '')
                        });
                        // Headline
                        $(element).find("[itemprop='headline']").each(function (i, elem) {
                            newsObj['headline'] = $(this).text();
                        });
                        // Read More
                        $(element).find('a.source').each(function (i, elem) {
                            newsObj['read_more'] = $(this).attr('href');
                        });
                        // Posted On
                        $(element).find('[itemprop="datePublished"]').each(function (i, elem) {
                            newsObj['posted_on'] = $(this).attr('content');
                        });
                        result[i] = newsObj;
                    });
                    resolve(result);
                } else {
                    reject(response);
                }
            });
        });
    }
}
exports.init = init;
