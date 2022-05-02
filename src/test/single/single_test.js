Feature('Add to Cart');

Scenario('Single Test', async ({ I }) => {
    I.amOnPage("https://bstackdemo.com")
    let expectedProductName = await I.grabTextFrom('//*[@id="1"]/p')
    I.click('//*[@id="1"]/div[4]')
    let productName = await I.grabTextFrom('//*[@id="__next"]/div/div/div[2]/div[2]/div[2]/div/div[3]/p[1]')
    
    if (productName === expectedProductName) {
        I.usePlaywrightTo('Mark Scenario', async ({ page }) => {
            // use browser, page, context objects inside this function
            await page.evaluate(_=>{},`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Product Matched"}}`)
        });
    }
    else {
        I.usePlaywrightTo('Mark Scenario', async ({ page }) => {
            // use browser, page, context objects inside this function
            await page.evaluate(_=>{},`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Product Did Matched"}}`)
        });
    } 
    
});
