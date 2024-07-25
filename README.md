<div align="center">
  <img width="150" height="150" title="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>Fetch Content</h1>
  <p>A plugin for fetching and working with remote and local content</p>

  [![Version][npm-version-shield]][npm]
  [![Build][github-ci-shield]][github-ci]
  [![License][license-shield]][license]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## About

This plugin allows you to fetch remote or local content and display it in your HTML.

Input:

```hbs
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
npm i posthtml posthtml-fetch
```

## Usage

```js
const posthtml = require('posthtml')
const posthtmlFetch = require('posthtml-fetch')

posthtml()
  .use(posthtmlFetch())
  .process('<fetch url="https://example.test">{{ response }}</fetch>')
  .then(result => console.log(result.html))

  // => interpolated response body
```

The response body will be available under the `response` local variable.

## Response types

The plugin supports `json` and `text` responses. 

Only the response body is returned.

## Expressions

The plugin uses [`posthtml-expressions`](https://github.com/posthtml/posthtml-expressions), so you can use any of its tags to work with the `response`.

For example, you can iterate over items in a JSON response:

```hbs
<fetch url="https://jsonplaceholder.typicode.com/users">
  <each loop="user in response">
    {{ user.name }}
  </each>
</fetch>
```

## Options

You may configure the plugin with the following options.

### `tags`

Type: `String[]`\
Default: `['fetch', 'remote']`

Array of supported tag names. 

Only tags from this array will be processed by the plugin.

Example:

```js
const posthtml = require('posthtml')
const posthtmlFetch = require('posthtml-fetch')

posthtml()
  .use(posthtmlFetch({
    tags: ['get']
  }))
  .process('<get url="https://example.test">{{ response }}</get>')
  .then(result => console.log(result.html))
```

### `attribute`

Type: `String`\
Default: `'url'`

String representing attribute name containing the URL to fetch.

Example:

```js
const posthtml = require('posthtml')
const posthtmlFetch = require('posthtml-fetch')

posthtml()
  .use(posthtmlFetch({
    attribute: 'from'
  }))
  .process('<fetch from="https://example.test">{{ response }}</fetch>')
  .then(result => {
    console.log(result.html) // interpolated response body
  })
```

### `ofetch`

The plugin uses [`ofetch`](https://unjs.io/packages/ofetch) to fetch data. You can pass options directly to it, inside the `ofetch` object.

Example:

```js
const posthtml = require('posthtml')
const posthtmlFetch = require('posthtml-fetch')

posthtml()
  .use(posthtmlFetch({
    ofetch: {
      // pass options to ofetch...
    }
  }))
  .process('<fetch url="https://example.test">{{ response }}</fetch>')
  .then(result => {
    console.log(result.html) // interpolated response body
  })
```

### `preserveTag`

Type: `Boolean`\
Default: `false`

When set to `true`, this option will preserve the `tag` around the response body.

Example:

```js
const posthtml = require('posthtml')
const posthtmlFetch = require('posthtml-fetch')

posthtml()
  .use(posthtmlFetch({
    preserveTag: true
  }))
  .process('<fetch url="https://example.test">{{ response }}</fetch>')
  .then(result => {
    console.log(result.html)
    // => <fetch url="https://example.test">interpolated response body</fetch>
  })
```

### `expressions`

Type: `Object`\
Default: `{}`

You can pass options to `posthtml-expressions`.

Example:

```js
const posthtml = require('posthtml')
const posthtmlFetch = require('posthtml-fetch')

posthtml()
  .use(posthtmlFetch({
    expressions: {
      delimiters: ['[[', ']]'],
    }
  }))
  .process('<fetch url="https://example.test">[[ response ]]</fetch>')
  .then(result => {
    console.log(result.html) // interpolated response body
  })
```

## Plugins

### `after/before`

List of plugins that will be called after/before receiving and processing `locals`

Example:

```js
const posthtml = require('posthtml')
const posthtmlFetch = require('posthtml-fetch')

posthtml()
  .use(posthtmlFetch({
    plugins: {
      before: [
        tree => {
          // Your plugin implementation
        },
        tree => {
          // Your plugin implementation
        }
      ],
      after: [
        tree => {
          // Your plugin implementation
        },
        tree => {
          // Your plugin implementation
        }
      ]
    }
  }))
  .process('<fetch url="https://example.test">{{ response }}</fetch>')
  .then(result => {
    console.log(result.html) // interpolated response body
  })
```

[npm]: https://www.npmjs.com/package/posthtml-fetch
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-fetch.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-fetch
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-fetch.svg
[github-ci]: https://github.com/posthtml/posthtml-fetch/actions
[github-ci-shield]: https://github.com/posthtml/posthtml-fetch/actions/workflows/nodejs.yml/badge.svg
[license]: ./license
[license-shield]: https://img.shields.io/npm/l/posthtml-fetch.svg
