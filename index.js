define(function(require, exports, module) {
  var Module          = require('famous-mediator/Module');
  var Engine          = require('famous/core/Engine');

  /**
   * Simple hash-based router, with URL parameters!
   *
   * options: {
   *    routes: {
   *       id: /some/url/with/:paramA/:paramB
   *    }
   * }
   *
   * public api:
   *
   * - set(href,opts); where 'opts' can be {silent:true,location:true}
   * - back()
   * - add(route,id)  (add new route)
   * 
   * event output (emitted):
   *
   * - change ({ location, params, id }); where params is {paramA: value} if location is /ex/:paramA
   *
   * event input (triggers):
   *
   * - home
   * 
   */
  function Router(options) {
      Module.apply(this, arguments);

      this.location = window.location.hash.substr(1);
      this.locationId = 0;
      this.params = {};
      this.stack = [];
      this._routes = [];

      if(options.routes) {
        for(var id in options.routes){
          this.add(options.routes[id],id);
        }
      }

      if(typeof options.handler == 'function') {
        this.on('change',options.handler);
      }

      window.addEventListener('hashchange',function(){
        _handleChange.call(this,window.location.hash.substr(1));
      }.bind(this),false);

      this._eventInput.on('location',function(location){
        _handleChange.call(this,location || window.location.hash.substr(1));
      }.bind(this));

      Engine.emit('created',this);

      if(options.home || location.hash) {
        // postpone setting home to next computer cycle
        // this should allow for initialization to complete
        // (i.e. the home page actually exists)
        setTimeout(function(){
          var hash = location.hash.substr(1);
          var home = options.home;
          var dest = options.force? home || hash: hash || home;
          this.set(dest);
        }.bind(this),0);
      }
      this.on('home',this.set.bind(this,options.home));
  }

  Router.prototype = Object.create(Module.prototype);
  Router.prototype.constructor = Router;
  Router.prototype.name = 'Router';

  Router.DEFAULT_OPTIONS = {
    id: 'Router'
  };

  Router.prototype.add = function(route,id) {
    var params = route.match(/:[a-zA-Z0-9]+/g) || [];
    var keys = params.map(function(x){
      return x.substr(1);
    });
    for (var i = params.length - 1; i >= 0; i--) {
      route = route.replace(params[i],'([^\/]+)');
    }
    route = '^' + route.replace(/\//g,'\\/') + '$';
    this._routes.push({
      regex: new RegExp(route),
      params: keys,
      id: id || this._routes.length + 1
    });
    return route;
  };

  Router.prototype.back = function() {
    this.stack.pop(); // discard current hash
    var previous = this.stack.pop();
    if(!!previous)  this.set(previous);
    return !!previous;
  };

  /**
   * Navigate to a URL (hash)
   * @param {string} location hash (without #)
   */
  Router.prototype.set = function(location,opts) {
    if(this.location != location) {
      if(opts && opts.silent) this.silent = true;
      if(opts && opts.location === false) {
        _handleChange.call(this,location);
      } else {
        window.location.hash = location;
      }
    } else if(!opts || !opts.silent) {
      _handleChange.call(this,location);
    }
  };

  function _handleChange(location) {
    var found = false, i = this._routes.length - 1, matches;
    
    this.location = location;
    this.stack.push(this.location);

    this.params = {};
    this.locationId = 0;
    
    while(i >= 0 && !found) {
      matches = this.location.match(this._routes[i].regex);
      if(matches !== null) {
        found = true;
        matches = matches.splice(1);
        this.locationId = this._routes[i].id;
        var params = this._routes[i].params;
        for(var j = params.length - 1; j >= 0; j--) {
          this.params[params[j]] = matches[j];
        }
      }
      i--;
    }
    if(!this.silent){
      var data = {
        location: this.location,
        params: this.params,
        id: this.locationId
      };
      this._eventOutput.emit('change',data);
      Engine.emit('route:'+data.id,data);
    }
    this.silent = false;
  }

  module.exports = Router;
})