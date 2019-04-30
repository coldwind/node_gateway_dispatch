var sysGlobal = require("../etc/global.js");

class Network {
    constructor () {
    }

    sendToLogServer(node, buffer) {
        // 加包头
        let sendBuffer = Buffer.alloc(buffer.length + 1);
        sendBuffer.writeUIntBE(buffer.length, 0, 1);
        buffer.copy(sendBuffer, 1, 0, buffer.length);

        // 选择发送的节点
        if (!node) {
            let nodeKeys = Object.keys(sysGlobal.LOG_SERVER_LIST);
            let rand = sysGlobal.Utils.randInt (0, nodeKeys.length);
            node = nodeKeys[rand];
        }
        console.log("send:", sendBuffer);

        if (sysGlobal.LOG_SERVER_LIST[node] && sysGlobal.LOG_SERVER_LIST[node].server) {
            sysGlobal.LOG_SERVER_LIST[node].server.write(sendBuffer);
        }
    }

    getFromGateway (buffer) {
        // 写入缓冲区
        let ac = sysGlobal.TcpDataCache.appendCursor;
        buffer.copy(sysGlobal.TcpDataCache.buffer, ac);
        //sysGlobal.TcpDataCache.buffer.write(buffer, ac, buffer.length);
        sysGlobal.TcpDataCache.appendCursor += buffer.length;

        let dataCollect = [];
        console.log("cache area:", buffer, sysGlobal.TcpDataCache.readCursor, sysGlobal.TcpDataCache.appendCursor);

        while (true) {
            let len = sysGlobal.TcpDataCache.buffer.readUIntBE(sysGlobal.TcpDataCache.readCursor, 1);
            console.log("cache len:", len, sysGlobal.TcpDataCache.appendCursor);
            if (sysGlobal.TcpDataCache.readCursor + len + 1 < sysGlobal.TcpDataCache.appendCursor) {
                console.log("cache area1:");
                // 未到达缓存区数据尾部
                let spliceData = Buffer.alloc(len);
                sysGlobal.TcpDataCache.buffer.copy(spliceData, 0, sysGlobal.TcpDataCache.readCursor + 1, len + 1);
                dataCollect.push(sysGlobal.Buffer.unpack(spliceData));

                sysGlobal.TcpDataCache.readCursor = sysGlobal.TcpDataCache.readCursor + len + 1;
            } else if (sysGlobal.TcpDataCache.readCursor + len + 1 == sysGlobal.TcpDataCache.appendCursor) {
                console.log("cache area2:");
                // 达到缓存区数据尾部
                let spliceData = Buffer.alloc(len);
                sysGlobal.TcpDataCache.buffer.copy(spliceData, 0, sysGlobal.TcpDataCache.readCursor + 1, len + 1);
                dataCollect.push(sysGlobal.Buffer.unpack(spliceData));

                sysGlobal.TcpDataCache.buffer.fill(0);
                sysGlobal.TcpDataCache.readCursor = 0;
                sysGlobal.TcpDataCache.appendCursor = 0;
            } else {
                console.log("cache area3:");
                break;
            }
        }

        return dataCollect;
    }
}

module.exports = {Network};
