// Gauntlet: A wrapper and configuration tool to 
// handle multiple Google Analytics accounts
// Version 1.0.0
// Author: Joshua Beckman | @jbckmn
// Author URI: http://www.andjosh.com

(function(window,document){
  'use strict';
  var Gauntlet = function(options){
    var defaults = {
      linkId: false,
      displayFeatures: false,
      accounts: [],
      custom: {},
      loadBase: true
    };
    if (!options) {
      throw new Error('A options object is required for Gauntlet to initialize. It should look something like: ' + JSON.stringify(defaults));
    }
    this.opt = extend(options, defaults);
    this.throw();
  };
  Gauntlet.prototype = {
    throw: function() {
      if (this.opt.accounts.length < 1 || !this.opt.accounts[0].profile) {
        throw new Error('At least one analytics account is required for Gauntlet to initialize.');
      }
      if (this.opt.loadBase) {
        this.base();
      }
      this.assets();
      this.view();
    },
    base: function(){
      function isogram(i,s,o,g,r,a,m){
        i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);
      }
      isogram(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    },
    assets: function(){
      if(this.opt.displayFeatures){
        window.ga('require', 'displayfeatures');
      }
      if(this.opt.linkId){
        window.ga('require', 'linkid', 'linkid.js');
      }
    },
    view: function(){
      var name;
      window.ga('create', this.accounts[0].profile, this.accounts[0].domain);
      if (Object.keys(this.opt.custom).length > 0){
        window.ga('send', 'pageview', this.opt.custom);
      } else {
        window.ga('send', 'pageview');
      }
      for (var i = 1; i < this.accounts.length; i++) {
        name = this.accounts[i].name || i.toString();
        window.ga('create', this.accounts[i].profile, this.accounts[i].domain, {'name': name});
        if (Object.keys(this.opt.custom).length > 0){
          window.ga(name + '.send', 'pageview', this.opt.custom);
        } else {
          window.ga(name + '.send', 'pageview');
        }
      }
    }
  };
  // Fills in empty values in the first argument with values
  // found in subsequent arguments
  function extend (obj) {
    var i, def, n;
    for (i = 1; i < arguments.length; i++) {
      def = arguments[i];
      for (n in def) {
        if (obj[n] === undefined) { obj[n] = def[n]; }
      }
    }
    return obj;
  }
  window.Gauntlet = Gauntlet;
})(this, this.document);
