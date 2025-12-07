import puppeteer from 'puppeteer';
// import { slugify } from '@/utils/slugify';

export async function scrapRestaurant(url: string) {
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(url);

        const title = await page.title();
        console.log(`Page Title: ${title}`);

        // const body = await page.content();
        // console.log(`Page Body: ${body}`);


        // 1. Extract all links and names first (so we don't lose them when navigating)
        const restaurantLinks = await page.$$eval('a:has(h3)', (elements) => 
            elements.map(el => ({
                name: el.querySelector('h3')?.textContent?.trim(),
                href: (el as HTMLAnchorElement).href
            }))
        );

        console.log(`Found ${restaurantLinks.length} restaurants. Starting details scraping...`);

        const restaurants = [];

        // 2. Visit each link sequentially
        for (const link of [restaurantLinks[1]]) {
            if (!link.href) continue;
            
            try {
                console.log(`Visiting: ${link.name}`);
                await page.goto(link.href, { waitUntil: 'domcontentloaded' });
                const pageTitle = await page.title();
                
                console.log(`  Title: ${pageTitle}`);
                // console.log('body ', await page.content());
                console.log('link ', link)
                restaurants.push({ 
                    name: link.name, 
                    slug: '',
                    title: pageTitle 
                });
            } catch (err) {
                console.error(`Failed to scrape ${link.name}:`, err);
            }
        }


        console.log(restaurants)

        await browser.close();
        return { title };
    } catch (error) {
        console.error("Scraping failed:", error);
        return null;
    }
}