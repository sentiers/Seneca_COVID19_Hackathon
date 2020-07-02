var fs = require("fs");

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        fs.readFile("./data/covidCase.json", "utf8", (err, data) => {
            if (!err) {
                covidCase = JSON.parse(data);
                resolve();
            } else {
                reject("unable to read file");
                return;
            }
        });
    });
}

module.exports.getData = function () {
    return new Promise(function (resolve, reject) {
        if (covidCase.length) {
            resolve(covidCase);
        } else {
            reject("file is empty");
        }
    });
}