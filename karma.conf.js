// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-sonarqube-execution-reporter')
    ],
    browsers: ['headless'],
    customLaunchers: {
      chrome: {
        base: 'Chrome',
        flags: ['--disable-extensions']
      },
      headless: {
        base: 'ChromeHeadless',
        flags: ['--disable-web-security', '--disable-extensions', '--no-sandbox']
      }
    },
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: 'coverage',
      subdir: '.',
      reporters: [
        { type: 'html', dir: 'coverage/' },
        { type: 'text-summary' }
      ],
    },
    sonarQubeExecutionReporter: {
      sonarQubeVersion: 'LATEST',
      testPaths: ['./src/app'],
      testFilePattern: '.spec.ts',
      outputDir: '../coverage',
      outputFile: 'ut_report.xml'
    },
    reporters: ['progress', 'kjhtml', 'sonarqubeUnit'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    restartOnFileChange: true
  });
};
