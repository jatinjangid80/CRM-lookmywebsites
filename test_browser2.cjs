const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push(`LOG [${msg.type()}]: ${msg.text()}`));
  page.on('pageerror', error => logs.push(`PAGE ERROR: ${error.message}`));
  
  await page.goto('http://localhost:3000/crm/bookings', { waitUntil: 'networkidle2' });
  
  await new Promise(r => setTimeout(r, 5000)); // wait 5 seconds
  
  // Try to extract the error message from the TanStack Router ErrorComponent
  const errorText = await page.evaluate(() => {
    // Tanstack router error component might have an Expand button or detailed error
    const details = document.querySelector('details');
    return details ? details.innerText : document.body.innerText;
  });
  
  console.log("=== CONSOLE LOGS ===");
  console.log(logs.join('\n'));
  console.log("=== PAGE TEXT ===");
  console.log(errorText.substring(0, 1000));
  
  await browser.close();
})();
