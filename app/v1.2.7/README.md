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

```
$ npm install -g gulp
$ npm install -g webpack
```

Then install all dependencies, in repo's root:

```
$ npm install 
```

## Web App Preview

Tmm User App use webpack dev server to develop, Just run it in repo's root:

```
$ gulp build-dev
```

OR change the host or port

```
$ gulp build-dev --host [your ip] --port [your port]
```
WebApp will be available on `http://localhost:3000/`

## Web App Release

```
$ gulp build
```