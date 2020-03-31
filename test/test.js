const test = require('ava')
const plugin = require('../lib')
const posthtml = require('posthtml')

const {join} = require('path')
const {readFileSync} = require('fs')

const fixture = file => readFileSync(join(__dirname, 'fixtures', `${file}.html`), 'utf8')
const expected = file => readFileSync(join(__dirname, 'expected', `${file}.html`), 'utf8')

const error = (name, cb) => posthtml([plugin()]).process(fixture(name)).catch(cb)
const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const process = (t, name, options, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => t.is(html, expected(name).trim()))
}

test('It renders the string if response is a string', t => {
  return process(t, 'string')
})

test('It works with object responses', t => {
  return process(t, 'object')
})

test('It works with custom tags', t => {
  return process(t, 'tag', {tags: ['pull-in']})
})

test('It skips node if attribute is missing', t => {
  return process(t, 'no-attribute')
})

test('It skips node if src attribute is empty', t => {
  return process(t, 'no-attribute-value')
})

test('It works with expressions (loop)', t => {
  return process(t, 'loop')
})

test('It fails if attribute contains an invalid URL', t => {
  return error('invalid-src', err => {
    t.is(err.message, 'Invalid URL: invalid')
  })
})

test('It uses options passed to got', t => {
  return process(t, 'got-options', {got: {url: 'http://www.mocky.io/v2/5e837ecb3000008906cf3e9c'}})
})

test('It works with custom attribute', t => {
  return process(t, 'attribute', {attribute: 'from'})
})
