var net = require("net");
var http = require("http");
var querystring = require("querystring");
var Utils = require("./lib/utils.js").Utils;
var sysConf = require("./etc/system.js");
var sysGlobal = require("./etc/global.js");
var etcd = require("./lib/etcd.js");
var buffer = require("./lib/buffer.js").SysBuffer;
var network = require("./lib/network.js").Network;
var Event = require("./lib/event.js").Event;

var tcpClientCount = 0;

sysGlobal.Utils = new Utils();
sysGlobal.Event = new Event();
sysGlobal.Buffer = new buffer();
sysGlobal.Network = new network();

sysGlobal.Utils.sysLog("server start");

var serviceFind = async () => {
    let etcdHandle = new etcd.Etcd();

    let key = "/servers/";

    let servers = await etcdHandle.getAll(key);
    for (let k in servers) {
        let serverInfo = JSON.parse(servers[k]);
        sysGlobal.LOG_SERVER_LIST[k] = {};
        sysGlobal.LOG_SERVER_LIST[k].host = serverInfo.host;
        sysGlobal.LOG_SERVER_LIST[k].port = serverInfo.port;
        sysGlobal.LOG_SERVER_LIST[k].type = serverInfo.type;
        sysGlobal.LOG_SERVER_LIST[k].server = null;

        // 连接server
        sysGlobal.LOG_SERVER_LIST[k].server = net.Socket();
        sysGlobal.LOG_SERVER_LIST[k].server.connect({host:serverInfo.host,port:serverInfo.port}, () => {});
    }

    // watch
    etcdHandle.watchServerNode(key);
};

try {
    // 发现服务
    serviceFind();

    // 注册事件
    sysGlobal.Event.logServerAddEvent();
    sysGlobal.Event.logServerDelEvent();

    // 启动TCP端口
    var tcpServer = net.createServer({}, function (client) {
        tcpClientCount++;

        client.on("end", function () {
            tcpClientCount--;
        });

        client.on("data", function (data) {
            console.log("on data:", data);
        });
    });

    //tcpServer.listen(sysConf.PORT.TCP, function() {});
    sysGlobal.Utils.sysLog("listen tcp port:" + sysConf.PORT.TCP);

    // 启动HTTP端口
    var httpServer = http.createServer(function (req, res) {
        let postData = "";
        req.on("data", (data) => {
            sysGlobal.Utils.debug("http on data:", data);
            postData += data;
        });

        req.on("end", () => {
            sysGlobal.Utils.debug("http on end:", postData);
            let jsonData = querystring.parse(postData);
            console.log(jsonData);

            res.setHeader('Content-Type','text/html');
            res.setHeader('Charset','utf-8');
            res.writeHead(200);

            res.end("{code:0}");

            // 发送数据到后端
            let packData = sysGlobal.Buffer.pack(jsonData);
            sysGlobal.Network.sendToLogServer(0, packData);
        });
    });

    httpServer.listen(sysConf.PORT.HTTP);
    sysGlobal.Utils.sysLog("listen http port:" + sysConf.PORT.HTTP);
} catch (e) {
    console.log("start error:", e);
}
