Feature('BrowserStack Local Testing');

Scenario('Local Test', async ({ I }) => {
    I.amOnPage("http://bs-local.com:45691/check")
    let text = await I.grabTextFrom('body')
    if (text === "Up and running") {
        I.usePlaywrightTo('Mark Scenario', async ({ page }) => {
            // use browser, page, context objects inside this function
            await page.evaluate(_=>{},`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Local Instance is runnning"}}`)
        });
    }
    else {
        I.usePlaywrightTo('Mark Scenario', async ({ page }) => {
            // use browser, page, context objects inside this function
            await page.evaluate(_=>{},`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Local Instance is not runnning"}}`)
        });
    }
});
