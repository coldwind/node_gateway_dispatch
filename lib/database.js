var fs = require("fs");
var cliConf = require("../etc/client.js");
var sysGlobal = require("../etc/global.js");

class Database {

    constructor () {
        this.wfd = {};
        this.typeMap = cliConf.TYPE_TO_DIR_MAP;
    }

    saveToFile (data) {
        let self = this;
        let prefix;

        if (!data.hasOwnProperty("type") && this.typeMap[data.type]) {
            return false;
        }

        let prefixDir = cliConf.LISTEN_TIME_CFG[this.typeMap[data.type].code].dir;

        let dateObj = new Date();
        let year = dateObj.getFullYear().toString();
        let month = (dateObj.getMonth() + 1).toString();
        let day = dateObj.getDate().toString();
        let Hour = dateObj.getHours().toString();
        let filename = "./data/" + prefixDir + "/" + year + "_" + month + "_" + day + ".data";
        let logStr = JSON.stringify(data) + "\n";

        let key = prefixDir + year + month + day;
        if (!self.wfd[key]) {
            fs.open(filename, "a", function (err,fd) {
                if (err) {
                    console.log(err);
                    return false;
                }

                self.wfd[key] = fd;
                fs.write(self.wfd[key], logStr, function() {});
            });
        } else {
            fs.write(self.wfd[key], logStr, function() {});
        }
    }

    getRecordFromFile() {
    }

    saveToMysql(data) {

        if (!data.hasOwnProperty("type")) {
            return false;
        }

        let table = null;

        switch (data.type) {
            case 1:
            case 2:
            case 3:
                this.addToReg(data);
                break;
        }
    }

    addToReg (data) {

        let dateObj = new Date();
        let year = dateObj.getFullYear().toString();
        let month = (dateObj.getMonth() + 1).toString();
        let day = dateObj.getDate().toString();

        // let table += year + "_" + month + "_" + day;
        let table = "reg_log_" + year;
        let param = {
            gameid: data.gameid,
            sid: data.sid,
            type: data.type,
            uid: data.uid,
            time: data.time,
            count: data.count,
        };
        sysGlobal.MysqlHandle.insert(table, param);
    }
}

module.exports = {Database};
