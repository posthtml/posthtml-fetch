'use strict'

const got = require('got')
const posthtml = require('posthtml')
const matcher = require("posthtml-match-helper")
const expressions = require("posthtml-expressions")

module.exports = (options = {}) => tree => {
  options.tags = options.tags || ['fetch', 'remote']
  options.attribute = options.attribute || 'url'
  options.got = options.got || {}

  return new Promise((resolve, reject) => {
    const all = []

    tree.match(matcher(options.tags.join()), node => {
      if (node.attrs && node.attrs[options.attribute]) {
        options.got.url = options.got.url || node.attrs[options.attribute]

        all.push(new Promise((resolve, reject) => {
          got(options.got)
            .then(({body}) => {
              const plugins = []
              let content = body;
              node.tag = false

              try {
                plugins.push(expressions({locals: {response: JSON.parse(body)}}))
                content = tree.render(node.content)
              } catch {}

              return posthtml(plugins).process(content)
            })
            .then(result => {
                node.content = result.html
                resolve(node)
            })
            .catch(error => {
              reject(error)
            })
          })
        )
      }

      return node
    })

    Promise.all(all).then(resolve.bind(null, tree)).catch(error => reject(error))
  })
}
