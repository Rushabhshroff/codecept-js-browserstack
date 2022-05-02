require('dotenv').config()
const browserstack = require("browserstack-local");

const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY
const cp = require('child_process');
const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

const CommonCaps = {
    'name': 'Codecept test using Playwright',
    'build': 'CodeceptJS on BrowserStack',
    'browserstack.username': BROWSERSTACK_USERNAME,
    'browserstack.accessKey': BROWSERSTACK_ACCESS_KEY,
    'browserstack.local':'true',
    'client.playwrightVersion': clientPlaywrightVersion
}

const CatalinaChrome = Object.assign({}, CommonCaps, {
    'browser': 'chrome', // allowed browsers are `chrome`, `edge`, `playwright-chromium`, `playwright-firefox` and `playwright-webkit`
    'os': 'osx',
    'os_version': 'catalina',
})

const WindowsFirefox = Object.assign({}, CommonCaps, {
    'browser': 'playwright-firefox', // allowed browsers are `chrome`, `edge`, `playwright-chromium`, `playwright-firefox` and `playwright-webkit`
    'os': 'windows',
    'os_version': '10',
})

exports.config = {
    tests: './*_test.js',
    output: './output',
    helpers: {
        Playwright: {
            show: true,
            browser: 'chromium',
            chromium: {
                browserWSEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(CatalinaChrome))}`
            }
        }
    },

    multiple: {
        bstack: {
            browsers: [
                {
                    browser: 'chromium',
                    chromium: {
                        browserWSEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(CatalinaChrome))}`
                    }
                },
                {
                    browser: 'chromium',
                    chromium: {
                        browserWSEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(WindowsFirefox))}`
                    }
                }
            ],
        },
    },
    bootstrapAll: async function () {
        return new Promise((res, rej) => {
            console.log("Connecting Local");
            exports.bs_local = new browserstack.Local();
            exports.bs_local.start({ 'key': BROWSERSTACK_ACCESS_KEY }, function (error) {
                if (error) rej(error);
                console.log('Connected. Now testing...');
                res()
            });
        })
    },

    teardownAll: async function () {
        return new Promise((res) => {
            exports.bs_local.stop(() => {
                console.log("Disconnected Local");
                res()
            });
        })
    },
    include: {
        I: './steps_file.js'
    },
    mocha: {},
    name: 'CodeceptJS-BrowserStack',
    plugins: {
        pauseOnFail: {},
        retryFailedStep: {
            enabled: true
        },
        tryTo: {
            enabled: true
        },
        screenshotOnFail: {
            enabled: true
        }
    }
}
