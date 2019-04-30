const os = require('os');
const { Etcd3 } = require('etcd3');
const client = new Etcd3();

const hostPrefix = 'available-hosts/';
var grantLease = async () => {
    const lease = client.lease(60); // set a TTL of 10 seconds
    let leaseId = await lease.leaseID;
    let hex = parseInt(leaseId).toString(16);
    //lease.on('lost', err => {
    //    console.log('We lost our lease as a result of this error:', err);
    //    console.log('Trying to re-grant it...');
    //}) 
    await lease.put(hostPrefix + os.hostname()).value('hello');
}

var getAvailableHosts = async () => {
    const keys = await client.get().keys().strings();
    return keys.map(key => key.slice(hostPrefix.length));
}

grantLease();
