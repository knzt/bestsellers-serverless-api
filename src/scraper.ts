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
        const price = info?.querySelector('.a-color-price span')?.textContent;
        const title = info?.querySelector(
          '.a-link-normal span div',
        )?.textContent;
        const url = info?.querySelector('a')?.href;
        const rate = info?.querySelector('.a-icon-alt')?.textContent;

        const product: Product = {
          title: title || 'indisponível',
          price: price || 'indisponível',
          rate: rate || 'indisponível',
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
