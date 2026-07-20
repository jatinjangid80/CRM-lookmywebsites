const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });
  
  page.on('response', async response => {
    if (response.url().includes('insurance_policies')) {
      console.log('SUPABASE RESPONSE:', response.status(), await response.text());
    }
  });

  await page.goto('http://localhost:3000/crm/insurance', { waitUntil: 'networkidle2' });
  
  // Click New Policy
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const newPolicyBtn = btns.find(b => b.textContent.includes('New Policy'));
    if (newPolicyBtn) newPolicyBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Fill required fields
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.placeholder.includes('John Doe')) {
        input.value = 'Automated Test';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (input.placeholder.includes('9876543210')) {
        input.value = '1234567890';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Save
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const saveBtn = btns.find(b => b.textContent.includes('Save Policy'));
    if (saveBtn) saveBtn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
