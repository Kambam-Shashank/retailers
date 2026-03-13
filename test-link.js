const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER_ERROR:', err.toString()));

    await page.goto('http://localhost:8081/view/sathwik');
    await new Promise(r => setTimeout(r, 6000));

    const text = await page.evaluate(() => document.body.innerText);
    require('fs').writeFileSync('pup_out.txt', text);

    await browser.close();
    console.log('DONE');
})();
