const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', error => {
    console.error('Page Error:', error.message);
  });
  
  try {
    console.log("Navigating to http://localhost:3000/crm/leads ...");
    await page.goto('http://localhost:3000/crm/leads', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    
    // Find the first row in the tbody and click it
    console.log("Clicking first lead row...");
    await page.evaluate(() => {
      const rows = document.querySelectorAll('tbody tr');
      if(rows.length > 0) {
        rows[0].click();
      } else {
        console.log("No rows found.");
      }
    });
    await new Promise(r => setTimeout(r, 1000));
    console.log("Done waiting.");
  } catch(e) {
    console.error("Test error:", e);
  }

  await browser.close();
})();
