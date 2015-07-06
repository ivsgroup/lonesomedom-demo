var lonesomedom = require('./public/lonesomedom');
var console   = require('nwconsole');
var Class     = require('./public/lonesomedom/node_modules/uclass');
var nw        = !!global.window;
var fs        = require('fs');
var cp        = require('child_process');
var util      = require('util');

if(false) process.on("uncaughtException", function(err){
  console.log(err);
});


var Capture = new Class({
  initialize : function(){
    var self = this;
    if(nw) {
      self.gui = global.window.nwDispatcher.requireNwGui();
      self.gui.App.clearCache();
      if (false) self.gui.Window.get().showDevTools() 
    }

  },
  run: function(url, next){
    var self = this;
    var options = {
      //show:false
    };

    var iframe = self.gui.Window.open(url, options);

    iframe.once('loaded', function(){
      var doc = iframe.window.document;
      next(iframe,  iframe.window, doc);
    });


  },

  done : function(){
    this.gui.App.quit();
  },
});


var foo = new Capture();
foo.run("http://127.0.0.1:8000/demo.htm", function(iframe, window, document){
  var anchor = document.getElementById("container");
  lonesomedom(anchor, function(err, portableDom){
    fs.writeFileSync("standalone.htm", portableDom.outerHTML);
    foo.done();
  });
  
});


