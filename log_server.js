var net = require("net");
var http = require("http");
var Utils = require("./lib/utils.js").Utils;
var cliConf = require("./etc/client.js");
var sysBuffer = require("./lib/buffer.js").SysBuffer;
var etcd = require("./lib/etcd.js");
var network = require("./lib/network.js").Network;
var sysGlobal = require("./etc/global.js");
var Database = require("./lib/database.js").Database;
var Mysql = require("./lib/mysql.js").Mysql;

sysGlobal.Utils = new Utils();
sysGlobal.Buffer = new sysBuffer();
sysGlobal.LeaseInfo = {};
sysGlobal.Database = new Database();
sysGlobal.Network = new network();
sysGlobal.TcpDataCache = {readCursor:0, appendCursor:0, buffer:Buffer.alloc(1024)};
sysGlobal.MysqlHandle = new Mysql();

var tcpServer = net.createServer({}, function (client) {

    client.on("end", function () {
        sysGlobal.Utils.debug("client end");
        client.end();
    });

    client.on("data", function (data) {
        let bufferData = sysGlobal.Network.getFromGateway(data);

        // 写入本地文件
        for (let item of bufferData ) {
            // TODO 写入文件 由监控程序读出再写入DB
            //sysGlobal.Database.saveToFile(item);

            // 开发期间直接写入DB
            sysGlobal.Database.saveToMysql(item);
        }
    });
});

// 注册服务发现
var register = async () => {
    let etcdHandle = new etcd.Etcd();
    let serverInfo = JSON.stringify({host:cliConf.LOG_SERVER_HOST, port:cliConf.LOG_SERVER_PORT, type:cliConf.LOG_SERVER_TYPE});
    etcdHandle.register(cliConf.NODE_NAME, serverInfo);
};

// 启动TCP端口
tcpServer.listen(cliConf.LOG_SERVER_PORT, function() {});
sysGlobal.Utils.sysLog("log server listen tcp port:" + cliConf.LOG_SERVER_PORT);

register();

