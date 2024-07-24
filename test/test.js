import path from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test, expect } from 'vitest'
import posthtml from 'posthtml'
import plugin from '../lib/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const fixture = file => readFileSync(path.join(__dirname, 'fixtures', `${file}.html`), 'utf8').trim()
const expected = file => readFileSync(path.join(__dirname, 'expected', `${file}.html`), 'utf8').trim()

const error = (name, options, cb) => posthtml([plugin(options)]).process(fixture(name)).catch(cb)
const clean = html => html.replace(/[^\S\r\n]+$/gm, '').trim()

const process = (name, options, log = false) => {
  return posthtml([plugin(options)])
    .process(fixture(name))
    .then(result => log ? console.log(result.html) : clean(result.html))
    .then(html => expect(html).toEqual(expected(name)))
}

test('It renders the string if response is a string', () => {
  process('string')
})

test('It works with object responses', () => {
  process('object')
})

test('It works with custom tags', () => {
  process('tag', {tags: ['pull-in']})
})

test('It skips node if attribute is missing', () => {
  process('no-attribute')
})

test('It skips node if src attribute is empty', () => {
  process('no-attribute-value')
})

test('It works with expressions (loop)', () => {
  process('loop')
})

test('It works with options plugins after', () => {
  process('plugins-after', {
    plugins: {
      after: [
        tree => {
          return tree.walk(node => {
            if (typeof node === 'object') {
              node.content = node.content.map(content => content.toUpperCase())
            }

            return node;
          })
        },
        tree => {
          return tree.walk(node => {
            if (typeof node === 'object') {
              node.content = node.content.map(content => content.split('').reverse().join(''))
            }

            return node;
          })
        }
      ]
    },
  })
})

test('It works with options plugins before', () => {
  process('plugins-before', {
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

test('It not fails if attribute contains an invalid URL', () => {
  process('invalid-src')
})

test('It works with local file', () => {
  process('local-src')
})

test('It uses options passed to ofetch', () => {
  process('ofetch-options', { ofetch: { parseResponse: JSON.parse }})
})

test('It works with custom attribute', () => {
  process('attribute', {attribute: 'from'})
})

test('It works with multiple call of fetch', () => {
  process('multiple-src')
})

test('It works with options passed to posthtml-expressions', () => {
  process('expressions-options', {expressions: {delimiters: ['[[', ']]']}})
})
