import puppeteer from 'puppeteer';
import { Product } from './entities/product';

const scrapeTopSales = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  try {
    const page = await browser.newPage();
    await page.goto('https://www.amazon.com.br/bestsellers', {
      waitUntil: 'networkidle0',
    });

    const topSellers = await page.evaluate(() => {
      const products: Product[] = [];

      const cards = Array.from(
        document.querySelectorAll('.zg-carousel-general-faceout'),
      ).slice(0, 3);

      if (!cards.length) {
        throw new Error('cards not found');
      }

      for (const card of cards) {
        const priceString = card.querySelector(
          '.a-color-price span',
        )?.textContent;
        const rateString = card.querySelector('.a-icon-alt')?.textContent;

        const title = card.querySelector(
          '.a-link-normal span div',
        )?.textContent;
        const url = card.querySelector('a')?.href;

        const price = priceString
          ? parseFloat(
              priceString.replace('R$', '').replace('.', '').replace(',', '.'),
            )
          : null;
        const rate = rateString
          ? parseFloat(rateString.split(' ')[0].replace(',', '.'))
          : null;

        const product: Product = {
          title: title || 'indisponível',
          price: price,
          rate: rate,
          url: url || 'indisponível',
          date: new Date().toISOString(),
        };
        products.push(product);
      }

      return JSON.stringify(products, null, 2);
    });

    return topSellers;
  } catch (error) {
    console.error('Scraping error:', error);
    return;
  } finally {
    await browser.close();
  }
};

scrapeTopSales().then(topSellers => {
  console.log(topSellers);
});
