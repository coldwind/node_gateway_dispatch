class SysBuffer {
    constructor () {
        this.BIT_OFFSET = {
            GAMEID:{OFFSET:0,LEN:2},
            SID:{OFFSET:2, LEN:4},
            TYPE:{OFFSET:6, LEN:1},
            COUNT:{OFFSET:7, LEN:4},
            UID:{OFFSET:11, LEN:4},
            TIME:{OFFSET:15, LEN:4},
            TLEN:{OFFSET:19, LEN:1},
            TITLE:{OFFSET:20},
        };
    }

    pack (data) {
        if (!data.gameid) {
            return false;
        }

        // 设置包头
        let buffer = Buffer.alloc(64);
        let totalLen = 20;
        buffer.writeUIntBE(data.gameid, this.BIT_OFFSET.GAMEID.OFFSET, this.BIT_OFFSET.GAMEID.LEN);
        buffer.writeUIntBE(data.sid, this.BIT_OFFSET.SID.OFFSET, this.BIT_OFFSET.SID.LEN);
        buffer.writeUIntBE(data.type, this.BIT_OFFSET.TYPE.OFFSET, this.BIT_OFFSET.TYPE.LEN);
        buffer.writeUIntBE(data.count, this.BIT_OFFSET.COUNT.OFFSET, this.BIT_OFFSET.COUNT.LEN);
        buffer.writeUIntBE(data.uid, this.BIT_OFFSET.UID.OFFSET, this.BIT_OFFSET.UID.LEN);
        buffer.writeUIntBE(data.time,this.BIT_OFFSET.TIME.OFFSET, this.BIT_OFFSET.TIME.LEN);

        if (data.title) {
            let tlen = Buffer.from(data.title).length;
            console.log("tlen:", tlen);
            buffer.writeUIntBE(tlen, this.BIT_OFFSET.TLEN.OFFSET, this.BIT_OFFSET.TLEN.LEN);
            buffer.write(data.title, this.BIT_OFFSET.TITLE.OFFSET);
            totalLen += tlen;
        }

        // +1 增加包头空间 包头为整个包的长度
        let targetBuf = Buffer.alloc(totalLen);
        buffer.copy(targetBuf, 0, 0, totalLen);

        return targetBuf;
    }

    unpack (buffer) {
        console.log("unpack:", buffer);
        let data = {};
        data.gameid = buffer.readUIntBE(this.BIT_OFFSET.GAMEID.OFFSET, this.BIT_OFFSET.GAMEID.LEN);
        data.sid = buffer.readUIntBE(this.BIT_OFFSET.SID.OFFSET, this.BIT_OFFSET.SID.LEN);
        data.type = buffer.readUIntBE(this.BIT_OFFSET.TYPE.OFFSET, this.BIT_OFFSET.TYPE.LEN);
        data.count = buffer.readUIntBE(this.BIT_OFFSET.COUNT.OFFSET, this.BIT_OFFSET.COUNT.LEN);
        data.uid = buffer.readUIntBE(this.BIT_OFFSET.UID.OFFSET, this.BIT_OFFSET.UID.LEN);
        data.time = buffer.readUIntBE(this.BIT_OFFSET.TIME.OFFSET, this.BIT_OFFSET.TIME.LEN);

        if (buffer.length > this.BIT_OFFSET.TLEN.OFFSET) {
            data.tlen = buffer.readUIntBE(this.BIT_OFFSET.TLEN.OFFSET, this.BIT_OFFSET.TLEN.LEN);
            let title = Buffer.alloc(data.tlen);
            buffer.copy(title, 0, this.BIT_OFFSET.TITLE.OFFSET, this.BIT_OFFSET.TITLE.OFFSET + data.tlen);
            data.title = title.toString("utf8");
        }

        return data;
    }
}

module.exports = {SysBuffer};
