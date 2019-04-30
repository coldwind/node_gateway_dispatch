var sysGlobal = require("../etc/global.js");

const { Etcd3 } = require("etcd3");

class Etcd {
    constructor () {
        this.Instance = new Etcd3({hosts:["127.0.0.1:2379", "127.0.0.1:2379"]});
        //this.Instance = new Etcd3();
    }

    async set (key, value) {
        await this.Instance.put(key).value(value);
    }

    async get (key) {
        return await (() => {
            return new Promise((resolve, reject) => {
                this.Instance.get(key).string().then((value) => {
                    resolve(value);
                });
            });
        })();
    }

    async getAll (key) {
        return await (() => {
            return new Promise((resolve, reject) => {
                this.Instance.getAll().prefix(key).strings().then((value) => {
                    resolve(value);
                });
            });
        })();
    }

    // 监听log server节点
    async watchServerNode (key) {
        let watcher = await this.Instance.watch().prefix(key).create();

        watcher.on("data", (res) => {
            for (let eventObj of res.events) {
                switch (eventObj.type) {
                    case "Put":
                        if (eventObj.kv.key && eventObj.kv.value) {
                            let serverInfo = JSON.parse(eventObj.kv.value.toString());
                            serverInfo.node = eventObj.kv.key.toString();
                            sysGlobal.Event.emit(sysGlobal.Event.LOG_SERVER_ADD, serverInfo);
                        }
                        break;
                    case "Delete":
                        if (eventObj.kv.key) {
                            sysGlobal.Event.emit(sysGlobal.Event.LOG_SERVER_DEL, eventObj.kv.key.toString());
                        }
                        break;
                }
            }
        });
    }

    async register (nodeKey, serverInfoStr) {
        nodeKey = "/servers/" + nodeKey;
        sysGlobal.LeaseInfo.lease = this.Instance.lease(10);
        let putRes = await sysGlobal.LeaseInfo.lease.put(nodeKey).value(serverInfoStr);
    }

    /*async robin () {
        setInterval(() => {
            if (sysGlobal.LeaseInfo.time && sysGlobal.LeaseInfo.time + 2 <= sysGlobal.Utils.unixTime()) {
                sysGlobal.LeaseInfo.lease.keepaliveOnce().then((res) => {
                    console.log("res:", res);
                });
                sysGlobal.LeaseInfo.lease.time = sysGlobal.Utils.unixTime();
            }
        }, 2000);
    }*/
}

module.exports = {Etcd};
