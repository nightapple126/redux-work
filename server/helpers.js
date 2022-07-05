var ping = require("net-ping");
var webshot = require("webshot");
var fs = require('fs')
//var uuidV4 = require("uuid/v4");
//var path = require("path")

var constants = require("../shared/constants")

exports.pingUrl = function (url) {
    var session = ping.createSession();

    session.pingHost(target, function (error, target) {
        if (error) {
            console.log(target + ": " + error.toString());
            return true;
        }
        else {
            console.log(target + ": Alive");
            return false;
        }
    });
}

// var x = 0;
// returns base64 string representation of the image
exports.getUrlSnapshost = function (url) {
    var options = {
        screenSize: { width: 1920, height: 1080 },
        quality: 60,
        renderDelay: 3000
    };

    // let id = x;
    // x = x + 1;
    // let id = uuidV4();
    // let filepath = path.join("./" + constants.kDataFolder, id + ".jpeg")
    // let filedir = "./" + constants.kDataFolder;

    // if (!fs.existsSync(filedir)) {
    //     fs.mkdirSync(filedir);
    // }
    return new Promise(function (resolve, reject) {
        let imageData = Buffer.from([]);
        // make screenshot
        let stream = webshot(url, options);
        stream.on("data", function (data) {
            // buffer the data
            imageData = Buffer.concat([imageData,data]);
        })
            .on("end", function () {
                // convert to base64
                let base64 = Buffer.from(imageData).toString("base64");
                // let filepath = filedir + "/" + id + ".jpg";
                // fs.writeFile(filepath, imageData, function (err) {
                //     if (err) {
                //         console.log("Could not save file:" + filepath + ". Reason: " + err);
                //     }
                // })
                resolve(base64);
            })
            .on("error", function (err) {
                reject(err);
            });
    });
}