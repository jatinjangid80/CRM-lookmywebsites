const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push(`LOG [${msg.type()}]: ${msg.text()}`));
  page.on('pageerror', error => logs.push(`PAGE ERROR: ${error.message}`));
  
  // Go to home first to set local storage
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Set auth state
  await page.evaluate(() => {
    localStorage.setItem('crm_auth', JSON.stringify({
      user: { id: "test", name: "Admin", role: "admin" },
      session: "mock_session"
    }));
  });
  
  // Now go to bookings page
  await page.goto('http://localhost:3000/crm/bookings', { waitUntil: 'networkidle2' });
  
  // Wait for the select element to be visible
  await page.waitForSelector('select');
  
  // Log before clicking
  console.log("Found select, changing to Travel Insurance...");
  
  // Change the select value
  await page.select('select', 'Travel Insurance');
  
  // Wait for a few seconds to see if it crashes
  await new Promise(r => setTimeout(r, 2000));
  
  // Try to extract the error message from the TanStack Router ErrorComponent
  const errorText = await page.evaluate(() => {
    const details = document.querySelector('details');
    return details ? details.innerText : document.body.innerText;
  });
  
  console.log("=== CONSOLE LOGS ===");
  console.log(logs.join('\n'));
  console.log("=== PAGE TEXT ===");
  console.log(errorText.substring(0, 1000));
  
  await browser.close();
})();
