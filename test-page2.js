import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  
  await page.evaluate(() => {
    localStorage.setItem('crm_auth_v1', JSON.stringify({
      role: 'user', // NOT admin
      name: 'Test User',
      empId: 'LMH-02',
      avatar: '',
      email: 'test@lookmyholidays.in',
      phone: '1234567890'
    }));
  });

  await page.goto('http://localhost:3000/crm/employees');
  
  await page.waitForTimeout(3000); 
  
  await page.screenshot({ path: 'test_screenshot_user.png' });
  
  await browser.close();
})();
