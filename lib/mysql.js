var mysql = require("mysql");
var sysConf = require("../etc/system.js");

class Mysql {

    constructor () {
        this.pool = mysql.createPool({
            host:sysConf.MYSQL.HOST,
            user:sysConf.MYSQL.USERNAME,
            password:sysConf.MYSQL.PASSWORD,
            database:sysConf.MYSQL.DB
        });
    }

    insert (table, data) {

        let fields = [];
        let values = [];
        let formatArr = [];
        for (let k in data) {
            fields.push(k);
            values.push(data[k]);
            formatArr.push('?');
        }

        let field = fields.join(",");
        let format = formatArr.join(",");

        let sql = "INSERT INTO " + table + "(" + field + ") values(" + format + ");";
        console.log(sql);
        this.pool.getConnection((err, conn) => {
            if (err) {
                throw err;
                return false;
            }

            conn.query(sql, values, (err,results,fields) => {
                conn.release();
            });
        });
    }
}

module.exports = {Mysql};
