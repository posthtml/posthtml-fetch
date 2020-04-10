'use strict'

const got = require('got')
const posthtml = require('posthtml')
const matcher = require("posthtml-match-helper")
const expressions = require("posthtml-expressions")

module.exports = (options = {}) => tree => {
  options.tags = options.tags || ['fetch', 'remote']
  options.attribute = options.attribute || 'url'
  options.got = options.got || {}
  options.preserveTag = options.preserveTag || false

  return new Promise((resolve, reject) => {
    const all = []

    tree.match(matcher(options.tags.join()), node => {
      if (node.attrs && node.attrs[options.attribute]) {
        options.got.url = options.got.url || node.attrs[options.attribute]

        all.push(new Promise((resolve, reject) => {
          if (options.preserveTag === false) {
            node.tag = false
          }

          Promise.resolve((() => {
            let plugins = []
            let content = tree.render(node);

            if (options.plugins && options.plugins.before) {
              plugins = plugins.concat(options.plugins.before);
            }

            return posthtml(plugins).process(content)
          })())
            .then(response => {
              const [item] = response.tree;
              Object.assign(node, item);
            })
            .then(got.bind(null, options.got))
            .then(({body}) => {
              let plugins = []
              let content = body;

              try {
                plugins.push(expressions({locals: {response: JSON.parse(body)}}))
                content = tree.render(node.content)
              } catch {}

              return posthtml(plugins).process(content)
            })
            .then(response => {
              node.content = response.html
            })
            .then(() => {
              let plugins = []
              let content = tree.render(node);

              if (options.plugins && options.plugins.after) {
                plugins = plugins.concat(options.plugins.after);
              }

              return posthtml(plugins).process(content)
            })
            .then(response => {
              const [item] = response.tree;
              Object.assign(node, item);
            })
            .then(() => {
              resolve(node)
            })
            .catch(reject)
          })
        )
      }

      return node
    })

    Promise.all(all).then(resolve.bind(null, tree)).catch(error => reject(error))
  })
}
