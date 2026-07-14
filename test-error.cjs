const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  
  const authPayload = {
    role: "admin",
    name: "Manvendra Singhal",
    empId: "LMH-01",
    email: "bookings@lookmyholidays.in",
    phone: "9413095483",
  };
  
  await page.evaluate((auth) => {
    localStorage.setItem('crm_auth_v1', JSON.stringify(auth));
  }, authPayload);

  await page.goto('http://localhost:3000/crm/leads', { waitUntil: 'networkidle2' });
  
  // click "Add Lead"
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const addBtn = btns.find(b => b.innerText.includes('Add Lead'));
    if (addBtn) addBtn.click();
  });

  await new Promise(r => setTimeout(r, 1000));
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('BODY AFTER CLICK:', bodyText.substring(0, 300));
  
  // also let's try to click a service
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const servBtn = btns.find(b => b.innerText.includes('Holiday Packages') || b.innerText.includes('International Package'));
    if (servBtn) servBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  const bodyText2 = await page.evaluate(() => document.body.innerText);
  console.log('BODY AFTER SERVICE SELECT:', bodyText2.substring(0, 300));

  await browser.close();
})();
