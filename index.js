const Inshorts = require('./inshorts');
function start(){
    Inshorts();
    launchRocket();
}
function launchRocket(){
    setInterval(function(){
        process.nextTick(function(){
            start();
        });
    },1000*60*10); // Keep running after every 10 minutes.
}
Inshorts();
launchRocket();