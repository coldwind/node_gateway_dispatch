var sysGlobal = require("./etc/global.js");
var Mysql = require("./lib/mysql.js").Mysql;
var Utils = require("./lib/utils.js").Utils;
var cliConf = require("./etc/client.js");

sysGlobal.Utils = new Utils();

var monitor = () => {
    sysGlobal.MysqlHandle = new Mysql();

    // 启动注册监听

    console.log(cliConf.LISTEN_TIME_CFG);
    // 启动文件监听
    for (let k in cliConf.LISTEN_TIME_CFG) {
        let listenTime = cliConf.LISTEN_TIME_CFG[k].time;
        setInterval(function () {
            let cfg = cliConf.LISTEN_TIME_CFG[k];
            console.log(cfg);

            // 读取文件
        }, listenTime);
    }
};

monitor();
