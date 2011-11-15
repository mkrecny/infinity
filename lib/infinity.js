/*
 * Infinity : multi-daemon maintainer and restarter
 */

var sys = require('sys');
var spawn = require('child_process').spawn;

module.exports = {

  kids : [],
  restart_delay: 100,

  restart : function(){
    console.log('restarting');
    self.killKids(); 
    self.initKids(num_cores);
  },

  killKids : function(){
  console.log('killing', kids.length, 'kids');
    self.kids.forEach(function(kid){
      kid.kill(); //guessing this is sync
    });
  },

  initKid : function(cmd, args){
    var self = this;
    var kid = spawn(cmd, args);
    var pid = kid.pid;

    kid.stdout.setEncoding('utf8');
    kid.stderr.setEncoding('utf8');

    kid.stdout.on('data', function(data){
      sys.puts('pid:'+pid+' : '+data);
    });

    kid.stderr.on('data', function(data){
      sys.puts('**ERROR**'+pid+' : '+data);
    });

    kid.on('exit', function(code){
      sys.puts('kid '+pid+' died, with code '+code);
      setTimeout(function(){
        self.initKid(cmd, args);
      }, self.restart_delay);
    });

    self.kids.push(kid);
  },

  initKids : function(args){
    var num = args.shift();
    var cmd = args.shift();
    for (var i=0; i<num; i++){
      this.initKid(cmd, args);
    }
  }

};
