var sysConf = require('../etc/system.js');
var fs = require("fs");

class Utils {
    constructor () {
        this.fd = {};
    }

    // 输出调试信息
    // ES6语法 需要ES6支持
    debug (...argvs) {
        if (sysConf.ENV.DEBUG) {
            let output = this.logFormat(argvs);
            console.log(output);
        }
    }

    // 记录运行时用户日志信息到文本文件
    log (...argvs) {
        let logStr = this.logFormat(argvs);
        this.logWrite(logStr, "user");
    }

    // 记录运行时系统日志信息到文本文件
    sysLog (...argvs) {
        let logStr = this.logFormat(argvs);
        this.logWrite(logStr, "runtime");
    }

    // 错误日志记录
    errLog (...argvs) {
        let logStr = this.logFormat(argvs);
        this.logWrite(logStr, "err");
    }

    logFormat (argvs) {
        let output = [];

        let dateObj = new Date();
        let year = dateObj.getFullYear().toString();
        let month = (dateObj.getMonth() + 1).toString();
        let day = dateObj.getDate().toString();
        let hour = dateObj.getHours().toString();
        let min = dateObj.getMinutes().toString();
        let sec = dateObj.getSeconds().toString();
        output.push("[" + year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + "]");
        for (let argv of argvs) {
            output.push(argv);
        }

        return output.join(" ");
    }

    logWrite (logStr, type) {
        let self = this;
        let prefix;
        let filename;

        logStr += "\n";

        let dateObj = new Date();
        let year = dateObj.getFullYear().toString();
        let month = (dateObj.getMonth() + 1).toString();
        let day = dateObj.getDate().toString();

        switch (type) {
            // 用户级日志
            case "user":
                filename = "./log/user/log_" + year + "_" + month + "_" + day + ".log";
                break;
            // 错误日志
            case "err":
                filename = "./log/sys/error_" + year + "_" + month + "_" + day + ".err";
                break;
            // 运行时日志
            case "runtime":
                filename = "./log/sys/runtime_" + year + "_" + month + "_" + day + ".log";
                break;
        }

        let key = year + month + day;
        if (!self.fd[key]) {
            fs.open(filename, "a", function (err,fd) {
                if (err) {
                    console.log(err);
                    return false;
                }

                self.fd[key] = fd;
                fs.write(self.fd[key], logStr, function() {});
            });
        } else {
            fs.write(self.fd[key], logStr, function() {});
        }
    }

    // 获取unix时间戳
    unixTime () {
        let unixTime = parseInt(Date.now() / 1000);

        return unixTime;
    }

    // 生成随机数
    randInt (m, n) {
        let rand = m + Math.floor(Math.random() * (n - m));

        return rand;
    }
}

module.exports = {Utils};
