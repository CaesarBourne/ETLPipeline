const { Worker } = require("bullmq");


const worker  =  new Worker("etl-pipeline",
     (job) =>{
    const batch  = job.data;
    for (const job of batch) {
        
    }
}, {
    connection : {host : "127.0.0.1", port : 6379},
    concurrency : 5
})