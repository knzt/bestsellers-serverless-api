import puppeteer from 'puppeteer';
import { Product } from '@/entities/product';

const scrapeTopSellers = async () => {
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

      const infos = Array.from(
        document.querySelectorAll('.zg-carousel-general-faceout'),
      ).slice(0, 3);

      for (const info of infos) {
        const priceString = info?.querySelector(
          '.a-color-price span',
        )?.textContent;
        const rateString = info?.querySelector('.a-icon-alt')?.textContent;

        const title = info?.querySelector(
          '.a-link-normal span div',
        )?.textContent;
        const url = info?.querySelector('a')?.href;

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
        };
        products.push(product);
      }

      return products;
    });

    return topSellers;
  } catch (error) {
    console.error('Scraping error:', error);
    return [];
  } finally {
    await browser.close();
  }
};

export default scrapeTopSellers;
