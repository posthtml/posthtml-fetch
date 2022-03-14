const path = require('path')
const {readFileSync} = require('fs')
const test = require('ava')
const posthtml = require('posthtml')
const plugin = require('../lib')

const fixture = file => readFileSync(path.join(__dirname, 'fixtures', `${file}.html`), 'utf8')
const expected = file => readFileSync(path.join(__dirname, 'expected', `${file}.html`), 'utf8')

// const error = (name, cb) => posthtml([plugin()]).process(fixture(name)).catch(cb)
const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const process = (t, name, options, log = false) => posthtml([plugin(options)])
  .process(fixture(name))
  .then(result => log ? console.log(result.html) : clean(result.html))
  .then(html => t.is(html, expected(name).trim()))

test('It renders the string if response is a string', async t => {
  await process(t, 'string')
})

test('It works with object responses', async t => {
  await process(t, 'object')
})

test('It works with custom tags', async t => {
  await process(t, 'tag', {tags: ['pull-in']})
})

test('It skips node if attribute is missing', async t => {
  await process(t, 'no-attribute')
})

test('It skips node if src attribute is empty', async t => {
  await process(t, 'no-attribute-value')
})

test('It works with expressions (loop)', async t => {
  await process(t, 'loop')
})

test('It works with options plugins after', async t => {
  await process(t, 'plugins-after', {
    preserveTag: true,
    plugins: {
      after(tree) {
        return tree.walk(node => {
          if (typeof node === 'object') {
            node.attrs.after = '';
          }

          return node;
        })
      },
    },
  })
})

test('It works with options plugins before', async t => {
  await process(t, 'plugins-before', {
    preserveTag: true,
    plugins: {
      before(tree) {
        tree.walk(node => {
          if (typeof node === 'object') {
            node.attrs.before = '';
          }

          return node;
        })

        return tree;
      },
    },
  })
})

test('It not fails if attribute contains an invalid URL', async t => {
  await process(t, 'invalid-src')
})

test('It works with local file', async t => {
  await process(t, 'local-src')
})

test('It uses options passed to got', async t => {
  await process(t, 'got-options', {got: {url: 'http://www.mocky.io/v2/5e837ecb3000008906cf3e9c'}})
})

test('It works with custom attribute', async t => {
  await process(t, 'attribute', {attribute: 'from'})
})

test('It works with multiple call of fetch', async t => {
  await process(t, 'multiple-src')
})
