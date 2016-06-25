Tmm User App
=============
## Requirements

* gulp `^3.9.0`
* ionic `^1.2.0`

## Dependencies

Tmm User App use `gulp` to build a production versions,

First you need to have `gulp` which you should install globally.

```
$ npm install -g gulp
```

Then install all dependencies, in repo's root:

```
$ npm install
```

## Web App Preview

Tmm User App use webpack dev server to develop, Just run it in repo's root:

```
$ gulp server-dev
```

OR change the host or port

```
$ gulp server-dev --host [your ip] --port [your port]
```
WebApp will be available on `http://localhost:8080/`

## Web App Release

```
$ gulp build
```