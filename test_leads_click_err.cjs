const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => {
    console.log('CONSOLE:', msg.text());
  });
  page.on('pageerror', error => {
    console.error('PAGE ERROR:', error.message);
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.setItem("crm_auth_v1", JSON.stringify({
        token: "fake-token",
        role: "admin",
        name: "Admin User",
        email: "admin@lookmyholiday.com"
      }));
    });
    
    await page.goto('http://localhost:3000/crm/leads', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    
    await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tbody tr'));
      if(rows.length > 0) rows[0].click();
    });
    
    await new Promise(r => setTimeout(r, 1000));
  } catch(e) {}

  await browser.close();
})();
