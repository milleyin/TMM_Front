Tmm User App
=============
## Requirements

* gulp `^3.9.0`
* webpack `^1.10.1`
* cordova `^5.0.0`
* framework7 `^1.2.0`

## Dependencies

Tmm User App use `gulp` and `webpack` to build a production versions,

First you need to have `gulp` and `webpack` which you should install globally.

Tmm User App also use `bower` to manage third-party packages, global install it as same as `gulp` and `webpack`.

```
$ npm install -g gulp
$ npm install -g webpack
$ npm install -g bower
```

Then install all dependencies, in repo's root:

```
$ npm install 
$ bower install
```

## Web App Preview

Tmm User App use webpack dev server to develop, Just run it in repo's root:

```
$ gulp build-dev
```

WebApp will be available on `http://localhost:3000/`

## Web App Release

```
$ gulp build
```