const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try {
    console.log("Navigating to http://localhost:3000/crm/accounts ...");
    await page.goto('http://localhost:3000/crm/accounts', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    
    // Switch to Payment Follow-ups tab
    console.log("Switching to Payment Follow-ups tab...");
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
      const tab = tabs.find(t => t.textContent.includes('Payment Follow-ups'));
      if(tab) tab.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Click Add Follow-up button
    console.log("Clicking Add Follow-up...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('Add Follow-up'));
      if(btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Click the Select dropdown
    console.log("Opening Select dropdown...");
    await page.evaluate(() => {
      const select = document.querySelector('button[role="combobox"]');
      if(select) select.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    
    console.log("Taking screenshot...");
    await page.screenshot({ path: 'puppeteer_accounts_select.png' });

    console.log("Done.");
  } catch(e) {
    console.error("Test error:", e);
  } finally {
    await browser.close();
  }
})();
