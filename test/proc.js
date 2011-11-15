setInterval(function(){
  console.log('I am a process');
},500);
setTimeout(function(){
  process.exit();
}, 5000);
