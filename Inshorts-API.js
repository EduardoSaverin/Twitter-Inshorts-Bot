var request = require("request");
var cheerio = require('cheerio');
var init = function() {
    return {
        getNews: getNews()
    }
}
var getNews = function() {
    return function(name) {
            return new Promise(async (resolve,reject) => {
                await request.get({
                    url: 'https://www.inshorts.com/en/read/' + name,
                    method: 'GET',
                    headers: {}
                }, function(err, response, body) {
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
                        var articleBody = [];
                        var image = [];
                        var headline = [];
                        var read_more = [];
                        var length = $("[itemprop='articleBody']").length;
                        var a = length;
                        $("[itemprop='articleBody']").each(function(i, elem) {
                            articleBody[i] = $(this).text();
                            a--;
                            if (a == 0)
                                sendResponse();
                            }
                        );
                        var b = length;
                        $("[class='news-card-image']").each(function(i, elem) {
                            var bg = $(this).css("background-image")
                            image[i] = bg.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '')
                            b--;
                            if (b == 0)
                                sendResponse();
                            }
                        );
                        var c = length;
                        $("[itemprop='headline']").each(function(i, elem) {
                            headline[i] = $(this).text();
                            c--;
                            if (c == 0)
                                sendResponse();
                            }
                        );
                        var d = length;
                        $("[class='source']").each(function(i, elem) {
                            read_more[i] = $(this).attr('href');
                            d--;
                            if (d == 0)
                                sendResponse();
                            }
                        );
    
                        function sendResponse() {
                            var id;
                            if (a == 0 && b == 0 && c == 0 && d == 0) {
                                $("[type='text/javascript']").each(function(i, elem) {
                                    id = $(this).text().split('"')[1];
                                });
                                resolve({
                                    body: articleBody,
                                    image: image,
                                    headline: headline,
                                    read_more: read_more,
                                    id: id,
                                    category: name
                                });
                            }
                        }
                    } else {
                        reject(response);
                    }
                });
            });   
    }
}
exports.init = init;
