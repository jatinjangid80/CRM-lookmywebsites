const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  page.on('pageerror', error => {
    console.error('Page Error:', error.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Console Error:', msg.text());
    }
  });

  try {
    console.log("Setting auth token...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
      localStorage.setItem("crm_auth_v1", JSON.stringify({
        token: "fake-token",
        role: "admin",
        name: "Admin User",
        email: "admin@lookmyholiday.com"
      }));
    });
    
    console.log("Navigating to http://localhost:3000/crm/leads ...");
    await page.goto('http://localhost:3000/crm/leads', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'puppeteer_leads_auth.png' });
    console.log("Screenshot saved.");
  } catch(e) {
    console.error("Test error:", e);
  }

  await browser.close();
})();
