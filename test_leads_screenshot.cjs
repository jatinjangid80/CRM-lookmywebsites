const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  page.on('pageerror', error => {
    console.error('Page Error:', error.message);
  });
  
  try {
    console.log("Navigating to http://localhost:3000/crm/leads ...");
    await page.goto('http://localhost:3000/crm/leads', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'puppeteer_leads.png' });
    console.log("Screenshot saved.");
  } catch(e) {
    console.error("Test error:", e);
  }

  await browser.close();
})();
