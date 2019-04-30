// log server对外端口
const LOG_SERVER_HOST = "127.0.0.1";
const LOG_SERVER_PORT = 12321;
const LOG_SERVER_TYPE = 'normal';
const NODE_NAME = "node1";

const TYPE_TO_DIR_MAP = {
    "1":{code:"reg"},
    "2":{code:"reg"},
    "3":{code:"reg"},
    "4":{code:"login"},
};

const LISTEN_TIME_CFG = {
    reg:{time:3000, dir:"reg/"},
    login:{time:4000, dir:"login/"},
};

module.exports = {LOG_SERVER_HOST, LOG_SERVER_PORT, NODE_NAME, LISTEN_TIME_CFG, TYPE_TO_DIR_MAP};
