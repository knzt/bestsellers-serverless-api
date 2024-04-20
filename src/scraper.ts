import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();
  await page.goto('https://www.amazon.com.br/bestsellers', {
    waitUntil: 'networkidle0',
  });

  const topSellers = await page.evaluate(() => {
    const products = [];

    const infos = Array.from(
      document.querySelectorAll('.zg-carousel-general-faceout'),
    ).slice(0, 3);
    for (const info of infos) {
      const price = info?.querySelector('.a-color-price span')?.textContent;
      const title = info?.querySelector('.a-link-normal span div')?.textContent;
      const url = info?.querySelector('a')?.href;
      const rate = info?.querySelector('.a-icon-alt')?.textContent;

      const product = { title: title, price: price, rate: rate, url: url };
      products.push(product);
    }

    return products;
  });

  console.log(topSellers);

  await browser.close();
})();
