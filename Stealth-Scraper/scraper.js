const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgent = require('user-agents');
const fs = require('fs');

puppeteer.use(StealthPlugin());

(async () => {
  const userAgent = new UserAgent();

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null
  });

  const page = await browser.newPage();
  await page.setUserAgent(userAgent.toString());

  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9',
  });

  await page.goto('https://books.toscrape.com', {
    waitUntil: 'networkidle2',
  });

  const books = await page.evaluate(() => {
    const items = document.querySelectorAll('.product_pod');
    return Array.from(items).map(book => {
      const title = book.querySelector('h3 a').getAttribute('title');
      const price = book.querySelector('.price_color')?.innerText;
      const image = book.querySelector('img')?.getAttribute('src');
      return { title, price, image: image && `https://books.toscrape.com/${image}` };
    });
  });

  console.log(books);
  fs.writeFileSync('books.json', JSON.stringify(books, null, 2));

  await browser.close();
})();
