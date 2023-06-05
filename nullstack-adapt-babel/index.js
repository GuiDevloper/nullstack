// @ts-check
const path = require('path')
const { readdirSync } = require('fs')
const getOptions = require('./getOptions')

function runtime(options) {
  return {
    test: /(\.(nts|tsx|njs|jsx)|client\.(js|ts))$/,
    loader: path.posix.join(
      options.configFolder,
      'loaders',
      'inject-runtime.js'
    )
  }
}

function getLoader(loader) {
  return path.join(__dirname, './loaders', loader)
}

function oldLoader(options) {
  if (options.target === 'server') {
    return [
      {
        test: /\.(njs|nts|jsx|tsx)$/,
        loader: getLoader('register-static-from-server.js')
      }
    ]
  }

  return [
    {
      test: /\.(njs|nts|jsx|tsx)$/,
      loader: getLoader('remove-import-from-client.js')
    },
    {
      test: /\.(njs|nts|jsx|tsx)$/,
      loader: getLoader('remove-static-from-client.js')
    }
  ]
}

function ignoreLoader() {
  return {
    test: /\.s?[ac]ss$/,
    use: [{ loader: getLoader('ignore-import.js') }]
  }
}

function replaceNullstack(options) {
  return {
    test: /nullstack.js$/,
    loader: getLoader('string-replace.js'),
    options: {
      multiple: [
        {
          search: /{{NULLSTACK_ENVIRONMENT_NAME}}/gi,
          replace: options.target
        }
      ]
    }
  }
}

function environment(_options) {
  const crypto = require('crypto')
  const key = crypto.randomBytes(20).toString('hex')
  return { KEY: `"${key}"` }
}

function replaceEnvironment(options) {
  return {
    test: /environment.js$/,
    loader: getLoader('string-replace.js'),
    options: {
      multiple: [
        {
          search: `import { KEY } from 'nullstack/environment'`,
          replace: `const KEY = ${environment(options).KEY}`
        }
      ]
    }
  }
}

function icons(options) {
  const icons = {}
  const publicFiles = readdirSync(
    path.posix.join(options.projectFolder, 'public')
  )
  const iconFileRegex = /icon-(\d+)x\1\.[a-zA-Z]+/
  for (const file of publicFiles) {
    if (iconFileRegex.test(file)) {
      const size = file.split('x')[1].split('.')[0]
      icons[size] = `/${file}`
    }
  }
  return { ICONS: JSON.stringify(icons) }
}

function replaceProject(options) {
  return {
    test: /project.js$/,
    loader: getLoader('string-replace.js'),
    options: {
      multiple: [
        {
          search: `import { ICONS } from 'nullstack/project'`,
          replace: `const ICONS = ${icons(options).ICONS}`
        }
      ]
    }
  }
}

function scss(options) {
  if (options.target !== 'client') return ignoreLoader()

  return {
    test: /\.s[ac]ss$/,
    use: [
      {
        loader: require.resolve('sass-loader'),
        options: { sassOptions: { fibers: false } }
      }
    ]
  }
}

function css(options) {
  if (options.target !== 'client') return ignoreLoader()

  const { loader } = require('mini-css-extract-plugin')
  return {
    test: /\.s?[ac]ss$/,
    use: [
      loader,
      {
        loader: require.resolve('css-loader'),
        options: { url: false }
      }
    ]
  }
}

function babel(_options, other) {
  return {
    test: other.test,
    resolve: {
      extensions: ['.njs', '.js', '.nts', '.ts', '.jsx', '.tsx']
    },
    use: {
      loader: require.resolve('babel-loader'),
      options: other.options
    }
  }
}

function js(options) {
  return babel(options, {
    test: /\.js$/,
    options: {
      presets: [['@babel/preset-env', { targets: { node: '10' } }]],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-class-properties'
      ]
    }
  })
}

function ts(options) {
  return babel(options, {
    test: /\.ts$/,
    options: {
      presets: [
        ['@babel/preset-env', { targets: { node: '10' } }],
        '@babel/preset-react'
      ],
      plugins: ['@babel/plugin-transform-typescript']
    }
  })
}

function njs(options) {
  return babel(options, {
    test: /\.(njs|jsx)$/,
    options: {
      presets: [
        ['@babel/preset-env', { targets: { node: '10' } }],
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-class-properties',
        [
          '@babel/plugin-transform-react-jsx',
          {
            pragma: '$runtime.element',
            pragmaFrag: '$runtime.fragment',
            throwIfNamespace: false
          }
        ]
      ]
    }
  })
}

function nts(options) {
  return babel(options, {
    test: /\.(nts|tsx)$/,
    options: {
      presets: [
        ['@babel/preset-env', { targets: { node: '10' } }],
        '@babel/preset-react'
      ],
      plugins: [
        [
          '@babel/plugin-transform-typescript',
          {
            isTSX: true,
            allExtensions: true,
            tsxPragma: '$runtime.element',
            tsxPragmaFrag: '$runtime.fragment'
          }
        ],
        [
          '@babel/plugin-transform-react-jsx',
          {
            pragma: '$runtime.element',
            pragmaFrag: '$runtime.fragment',
            throwIfNamespace: false
          }
        ]
      ]
    }
  })
}

function injectHmr(options) {
  if (options.target !== 'client' || options.environment !== 'development') {
    return
  }

  return {
    test: /client\.(js|ts)$/,
    loader: getLoader('inject-hmr.js')
  }
}

function newConfig(options) {
  return [
    runtime(options),
    css(options),
    scss(options),
    js(options),
    ts(options),
    njs(options),
    nts(options),
    replaceNullstack(options),
    replaceEnvironment(options),
    replaceProject(options),
    injectHmr(options),
    ...oldLoader(options),
    {
      test: /\.(njs|nts|jsx|tsx)$/,
      loader: getLoader('register-inner-components.js')
    },
    {
      test: /\.(njs|nts|jsx|tsx)$/,
      loader: getLoader('add-source-to-node.js')
    },
    {
      test: /\.(njs|nts|jsx|tsx)$/,
      loader: getLoader('transform-node-ref.js')
    }
  ]
}

/**
 *
 * @param {Array<(...[]) => {module: {rules: Array<{}>}}>} configs
 */
module.exports = function useBabel(configs) {
  const targets = ['server', 'client']
  return configs.map((config, configId) => {
    return function (_env, argv) {
      const oldConfig = config(_env, argv)
      const oldRules = oldConfig.module.rules
      const options = getOptions(targets[configId], argv)
      let traceLoader
      if (options.trace) {
        traceLoader = oldRules[0]
      }
      return {
        ...oldConfig,
        module: {
          rules: [
            traceLoader,
            ...newConfig(options),
            ...oldRules.slice(oldRules.length - 3, oldRules.length - 1)
          ].filter(Boolean)
        }
      }
    }
  })
}
