const { Queue } = require("bullmq");


const queue =  new Queue("etl-queue", {
    connection : {port : 6379, host:"127.0.0.1"}
});

module.exports =  queue;