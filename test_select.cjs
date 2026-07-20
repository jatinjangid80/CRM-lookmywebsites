const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push(`LOG [${msg.type()}]: ${msg.text()}`));
  page.on('pageerror', err => logs.push(`PAGE ERROR: ${err.message}`));
  
  await page.setContent(`
    <html><body><div id="root"></div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@radix-ui/react-select@1.2.2/dist/index.js"></script>
    <script>
      const e = React.createElement;
      const Select = RadixSelect.Root;
      function App() {
        return e(Select, { value: null }, e('div', null, 'Test'));
      }
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(e(App));
    </script>
    </body></html>
  `);
  
  await new Promise(r => setTimeout(r, 1000));
  console.log(logs.join('\n'));
  await browser.close();
})();
