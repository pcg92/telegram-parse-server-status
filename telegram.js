var jobName_telegram = "sendStatus";
var kue = require('kue-scheduler');
var Queue = kue.createQueue();

function checkStatus(job, done){

Parse.Cloud.httpRequest({
  method: 'POST',
  url: 'https://api.telegram.org/botYOUR_API_BOT/sendMessage?chat_id=YOUR_CHAT_ID',
  params: {
    text : 'Server is running.'
  },
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
}).then(function(httpResponse) {
    done();
}, function(httpResponse) {
    done(new Error(httpResponse.status));
});
}

function initCheckStatus(){
  Queue.clear(function(error, response) {
      var job = Queue
                  .createJob(jobName_telegram)
                  .priority('normal')
                  .removeOnComplete(true);
      Queue.every('3 hours', job);
      Queue.process(jobName_telegram, checkStatus);
  });
}

exports.initCheckStatus = initCheckStatus;
