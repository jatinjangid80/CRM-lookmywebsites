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
    
    // Find the add lead button and click it
    console.log("Clicking Add Lead...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Add Lead'));
      if(btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("Clicking Air Ticket...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Air Ticket'));
      if(btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    console.log("Done waiting.");
  } catch(e) {
    console.error("Test error:", e);
  }

  await browser.close();
})();
