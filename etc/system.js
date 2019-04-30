// 当前是否开发环境
const ENV = {
    DEBUG:true,
};

// gateway对外端口
const PORT = {
    TCP:19850,
    HTTP:19851,
    UDP:19852,
};

const MYSQL = {
    HOST:"127.0.0.1",
    PORT:3306,
    USERNAME:"root",
    PASSWORD:"",
    DB:"",
};

module.exports = {ENV, PORT, MYSQL};
