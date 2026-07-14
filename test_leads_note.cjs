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
    
    console.log("Clicking Add Note...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const noteBtn = btns.find(b => b.textContent.includes('+ Add Note'));
      if(noteBtn) noteBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    console.log("Done waiting.");
  } catch(e) {
    console.error("Test error:", e);
  }

  await browser.close();
})();
