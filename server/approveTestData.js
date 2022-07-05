var http = require("http");
var rp = require("request-promise");

var constants = require("../shared/apiEndpoints")

let approvedData = [
    "www.google.co.uk",
    "www.linkedin.com",
    "www.google.fr",
    "www.google.ru",
    "www.list.tmall.com",
    "www.google.com.br",
    "www.yandex.ru",
    "www.google.com.hk",
    "www.yahoo.co.jp",
    "www.netflix.com",
    "www.google.it",
    "www.t.co",
    "www.ntd.tv",
    "www.imgur.com",
    "www.google.es",
    "www.ebay.com",
    "www.onclkds.com",
    "www.hao123.com",
    "www.bing.com",
    "www.pornhub.com",
    "www.msn.com",
    "www.microsoft.com",
    "www.wordpress.com",
    "www.google.ca",
    "www.twitch.tv",
    "www.aliexpress.com"
]

approvedData.forEach(function (design) {
    var options = {
        method: 'POST',
        uri: "http://localhost:3001" + constants.kApiApproveDesign,
        body: {
            designUrl: design,
        },
        json: true // Automatically stringifies the body to JSON
    };
    console.log("approving: " + design);
    rp.post(options)
        .then(response => console.log(response))
        .catch(response => console.log(response));
})
