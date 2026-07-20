const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.toString()));

  await page.goto('http://localhost:3000/crm/bookings', { waitUntil: 'networkidle0' });
  
  // Click "Add Booking" or whatever opens the modal
  const addBtn = await page.$('button::-p-text(New Booking)');
  if (addBtn) await addBtn.click();
  else {
    const addBtn2 = await page.$('button::-p-text(Add Booking)');
    if (addBtn2) await addBtn2.click();
  }
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Travel Insurance
  const travelBtn = await page.$('button::-p-text(Travel Insurance)');
  if (travelBtn) {
    console.log("Found Travel Insurance button, clicking...");
    await travelBtn.click();
    await new Promise(r => setTimeout(r, 1000));
  } else {
    console.log("Could not find Travel Insurance button");
  }

  await browser.close();
})();
