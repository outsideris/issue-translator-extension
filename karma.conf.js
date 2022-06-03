module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    plugins: [
      'karma-chrome-launcher',
      'karma-webpack',
      'karma-mocha'
    ],
    files: [
      'src/translate.js',
      'test/**/*.spec.js',
    ],
    exclude: [
      'options.js',
      'background.js'
    ],
    preprocessors: {
      'src/**/*.js': ['webpack'],
      'test/**/*.js': ['webpack'],
    },
    webpack: {
      "mode": "development",
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity
  })
}
