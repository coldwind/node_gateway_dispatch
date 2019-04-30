var net = require("net");
var http = require("http");
var querystring = require("querystring");
var Utils = require("./lib/utils.js").Utils;
var sysConf = require("./etc/system.js");
var tcpClientCount = 0;
var UTILS = new Utils();

UTILS.sysLog("server start");

var tcpServer = net.createServer({}, function (client) {
    tcpClientCount++;

    client.on("end", function () {
        console.log();
        tcpClientCount--;
    });

    client.on("data", function (data) {
        console.log("on data:", data);
    });
});

// 启动TCP端口
tcpServer.listen(sysConf.PORT.TCP, function() {});
UTILS.sysLog("listen tcp port:" + sysConf.PORT.TCP);
