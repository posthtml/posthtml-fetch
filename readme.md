<div align="center">
  <img width="150" height="150" title="PostHTML" src="https://posthtml.github.io/posthtml/logo.svg">
  <h1>Fetch Remote and Local Content</h1>
  <p>A plugin for fetching and working with remote and local content</p>

  [![Version][npm-version-shield]][npm]
  [![License][license-shield]][license]
  [![Build][github-ci-shield]][github-ci]
  [![Downloads][npm-stats-shield]][npm-stats]
</div>

## About

This plugin allows you to fetch remote or local content and display it in your HTML.

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
import posthtml from 'posthtml'
import pf from 'posthtml-fetch'

posthtml()
  .use(pf())
  .process('<fetch url="https://example.test">{{ response }}</fetch>')
  .then(result => console.log(result.html))
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
import posthtml from 'posthtml'
import pf from 'posthtml-fetch'

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
import posthtml from 'posthtml'
import pf from 'posthtml-fetch'

posthtml()
  .use(pf({
    attribute: 'from'
  }))
  .process('<fetch from="https://example.test">{{ response }}</fetch>')
  .then(result => console.log(result.html))
  // => ...interpolated response from https://example.test
```

### `got`

The plugin uses [`got`](https://github.com/sindresorhus/got) to fetch data. You can pass options directly to it, inside the `got` object.

Example:

```js
import posthtml from 'posthtml'
import pf from 'posthtml-fetch'

posthtml()
  .use(pf({
    got: {
      // pass options to got...
    }
  }))
  .process('<fetch url="https://example.test">{{ response }}</fetch>')
  .then(result => console.log(result.html))
```

### `preserveTag`

Allows you to leave an item. Default value `false`.

Example:

```js
import posthtml from 'posthtml'
import pf from 'posthtml-fetch'

posthtml()
  .use(pf({
    preserveTag: true
  }))
  .process('<fetch url="https://example.test">{{ response }}</fetch>')
  .then(result => console.log(result.html))
```

Result:

```html
<fetch url="https://example.test">...interpolated response from https://example.test</fetch>
```

## Plugins

### `after/before`

List of plugins that will be called after/before receiving and processing `locals`

Example:

```js
import posthtml from 'posthtml'
import pf from 'posthtml-fetch'

posthtml()
  .use(pf({
    plugins: {
      after(tree) {
        // Your plugin implementation
      },
      before: [
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
  .then(result => console.log(result.html))
```

[npm]: https://www.npmjs.com/package/posthtml-fetch
[npm-version-shield]: https://img.shields.io/npm/v/posthtml-fetch.svg
[npm-stats]: http://npm-stat.com/charts.html?package=posthtml-fetch
[npm-stats-shield]: https://img.shields.io/npm/dt/posthtml-fetch.svg
[github-ci]: https://github.com/posthtml/posthtml-fetch/actions
[github-ci-shield]: https://img.shields.io/github/workflow/status/posthtml/posthtml-fetch/Node.js%20CI
[license]: ./license
[license-shield]: https://img.shields.io/npm/l/posthtml-fetch.svg
