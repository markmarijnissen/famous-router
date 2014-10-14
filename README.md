famous-router
===============

A simple hash-based router for Famo.us

## Getting started

Install using bower or npm

```bash
  bower install famous-router
  npm install famous-router
```

## Usage

Options
```javascript
Router = require('famous-router');
var router = new Router({
  routes: {
     id: '/some/url/with/:paramA/:paramB'
  },
  force: true, // force homepage on initialization, optional
  home: 'id' // homepage, optional
});
```

Public API:
```javascript
router.set(href,opts); // where 'opts' can be {silent:true,location:false}
router.back() 
router.add(route,id)  // add new route
```

* silent: if true, don't emit events (default false)
* location: if false, don't update hash (default true)

Event output (emitted):
```javascript
router.on('change',function({ location, params, id }); // where params is {paramA: value} if location is /ex/:paramA

Engine.on('route:xxx',function({ ...})); // where 'xxx' is an route.id
```

Event input (triggers):
```javascript
router.trigger('home') // goto homepage
```

## Contribute

Feel free to contribute to this project in any way. The easiest way to support this project is by giving it a star.

## Contact
-   @markmarijnissen
-   http://www.madebymark.nl
-   info@madebymark.nl

© 2014 - Mark Marijnissen