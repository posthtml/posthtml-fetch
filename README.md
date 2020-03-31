<div align="center">
  <img width="150" height="150" title="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>Fetch Remote Content</h1>
  <p>A plugin for fetching and working with remote content</p>

  [![Version][npm-version-shield]][npm]
  [![License][license-shield]][license]
  [![Build][travis-ci-shield]][travis-ci]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## About

This plugin allows you to fetch remote content and display it in your HTML.

Input:

```html
<fetch url="https://jsonplaceholder.typicode.com/users/1">
  {{ response.name }}'s username is {{ response.username }}
</fetch>
```

Output:

```html
Leanne Graham's username is Bret
```

## Install

```
$ npm i posthtml posthtml-fetch
```

## Usage

```js
const posthtml = require('posthtml')
const pf = require('posthtml-fetch')

posthtml()
  .use(pf())
  .process('<fetch url="https://example.test">{{ response }}</fetch>')
  .then(result => console.log(result.html))

  // response body
```

The response body will be available under the `response` local variable.

## Response types

The plugin supports `json` and `text` responses. 

Only the response body is returned.

## Expressions

The plugin uses [`posthtml-expressions`](https://github.com/posthtml/posthtml-expressions), so you can use any of its tags to work with the `response`.

For example, you can iterate over items in a JSON response:

```html
<fetch url="https://jsonplaceholder.typicode.com/users">
  <each loop="user in response">
    {{ user.name }}
  </each>
</fetch>
```

## Options

You can configure the plugin with the following options.

### `tags`

Default: `['fetch', 'remote']`

Array of supported tag names. 

Only tags from this array will be processed by the plugin.

Example:

```js
const posthtml = require('posthtml')
const pf = require('posthtml-fetch')

posthtml()
  .use(pf({
    tags: ['get']
  }))
  .process('<get url="https://example.test">{{ response }}</get>')
  .then(result => console.log(result.html))
```

### `attribute`

Default: `'url'`

String representing attribute name containing the URL to fetch.

Example:

```js
const posthtml = require('posthtml')
const pf = require('posthtml-fetch')

posthtml()
  .use(pf({
    attribute: 'from'
  }))
  .process('<fetch from="https://example.test">{{ response }}</fetch>')
  .then(result => console.log(result.html))
```

### `got`

The plugin uses [`got`](https://github.com/sindresorhus/got) to fetch data. You can pass options directly to it, inside the `got` object.

Example:

```js
const posthtml = require('posthtml')
const pf = require('posthtml-fetch')

posthtml()
  .use(pf({
    got: {
      // pass options to got...
    }
  }))
  .process('<fetch url="https://example.test">{{ response }}</fetch>')
  .then(result => console.log(result.html))
```



[npm]: https://www.npmjs.com/package/posthtml-fetch
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-fetch.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-fetch
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-fetch.svg
[travis-ci]: https://travis-ci.org/posthtml/posthtml-fetch/
[travis-ci-shield]: https://img.shields.io/travis/posthtml/posthtml-fetch/master.svg
[license]: ./LICENSE
[license-shield]: https://img.shields.io/npm/l/posthtml-fetch.svg
