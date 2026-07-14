const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', error => {
    console.error('Page Error:', error.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Console Error:', msg.text());
    }
  });

  try {
    console.log("Navigating to http://localhost:3000/crm/leads ...");
    await page.goto('http://localhost:3000/crm/leads', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    console.log("Done waiting.");
  } catch(e) {
    console.error("Navigation error:", e);
  }

  await browser.close();
})();
