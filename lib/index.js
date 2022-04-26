const got = require('got')
const path = require('path')
const isUrl = require('is-url')
const posthtml = require('posthtml')
const merge = require('lodash.merge')
const matcher = require('posthtml-match-helper')
const expressions = require('posthtml-expressions')

module.exports = (options = {}) => tree => {
  options.got = options.got || {}
  options.attribute = options.attribute || 'url'
  options.expressions = options.expressions || {}
  options.preserveTag = options.preserveTag || false
  options.tags = options.tags || ['fetch', 'remote']

  return new Promise((resolve, reject) => {
    const all = []

    tree.match(matcher(options.tags.join(',')), node => {
      const responseAssign = response => {
        let [item] = response.tree;

        if (typeof item === 'string') {
          item = {content: [item]};
        }

        Object.assign(node, item);
      }

      if (node.attrs && node.attrs[options.attribute]) {
        let url = options.got.url || node.attrs[options.attribute]

        all.push(new Promise((resolve, reject) => {
          Promise.resolve((() => {
            let plugins = []
            const content = tree.render(node);

            if (options.plugins && options.plugins.before) {
              plugins = plugins.concat(options.plugins.before);
            }

            return posthtml(plugins).process(content)
          })())
            .then(responseAssign)
            .then(() => {
              if (isUrl(url)) {
                return got({...options.got, url: url})
              } else {
                const response = {
                  body: undefined
                }

                try {
                  response.body = JSON.stringify(require(path.resolve(url)))
                } catch {}

                return response
              }
            })
            .then(({body}) => {
              const plugins = []
              let content = body;

              try {
                plugins.push(
                  expressions(
                    merge(
                      options.expressions,
                      {
                        locals: {response: JSON.parse(body)}
                      }
                  ))
                )

                content = tree.render(node.content)
              } catch {}

              if (body === undefined) {
                content = tree.render(node.content)
              }

              return posthtml(plugins).process(content)
            })
            .then(response => {
              node.content = response.html
            })
            .then(() => {
              let plugins = []
              const content = tree.render(node);

              if (options.plugins && options.plugins.after) {
                plugins = plugins.concat(options.plugins.after);
              }

              return posthtml(plugins).process(content)
            })
            .then(responseAssign)
            .then(() => {
              if (options.preserveTag === false) {
                node.tag = false
              }
            })
            .then(resolve.bind(null, node))
            .catch(reject)
        }),
        )
      }

      return node
    })

    Promise.all(all).then(resolve.bind(null, tree)).catch(error => reject(error))
  })
}
