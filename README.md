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
     id: /some/url/with/:paramA/:paramB
  },
  force: true, // force homepage on initialization, optional
  home: 'id' // homepage, optional
});
```

Public API:
```
router.set(href,opts); // where 'opts' can be {silent:true,location:true}
router.back() 
router.add(route,id)  // add new route
```

* silent=true: don't fire change event
* location=false: don't update location bar

Event output (emitted):
```javascript
router.on('change',function({ location, params, id }); // where params is {paramA: value} if location is /ex/:paramA

Engine.on('route:xxx',function({ ...})); // where 'xxx' is an route.id
```

When route is not registred, router will fire an event with:

```json
{
  id: 'not_found',
  params: {}
}
```

## Changelog

### 0.1.1 - (1/11/2014)

* Fixed minor bug: Router didn't emit event if you did: `/a -> /b({location:false}) -> /a`
* Changed unknown route id to `not_found` rather than 0.

## Contribute

Feel free to contribute to this project in any way. The easiest way to support this project is by giving it a star.

## Contact
-   @markmarijnissen
-   http://www.madebymark.nl
-   info@madebymark.nl

© 2014 - Mark Marijnissen