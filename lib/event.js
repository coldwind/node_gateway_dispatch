var net = require("net");
var EventEmitter = require("events");
var global = require("../etc/global.js");

class Event extends EventEmitter {
    constructor () {
        super();
        this.LOG_SERVER_ADD = "log_server_add";
        this.LOG_SERVER_DEL = "log_server_del";
    }

    logServerAddEvent () {
        this.on(this.LOG_SERVER_ADD, (serverInfo) => {
            global.Utils.debug("log server add:", serverInfo.node);
            if (global.LOG_SERVER_LIST[serverInfo.node] && global.LOG_SERVER_LIST[serverInfo.node].server) {
                global.LOG_SERVER_LIST[serverInfo.node].server.end();
            }

            global.LOG_SERVER_LIST[serverInfo.node] = {};
            global.LOG_SERVER_LIST[serverInfo.node].host = serverInfo.host;
            global.LOG_SERVER_LIST[serverInfo.node].port = parseInt(serverInfo.port);
            global.LOG_SERVER_LIST[serverInfo.node].server = net.Socket();
            global.LOG_SERVER_LIST[serverInfo.node].server.connect({host:serverInfo.host,port:serverInfo.port}, () => {});
        });
    }

    logServerDelEvent () {
        this.on(this.LOG_SERVER_DEL, (node) => {
            global.Utils.debug("log server del:", node);
            if (global.LOG_SERVER_LIST[node]) {
                delete global.LOG_SERVER_LIST[node];
            }
        });
    }
}

module.exports = {Event};
