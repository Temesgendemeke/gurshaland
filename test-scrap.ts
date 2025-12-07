import { scrapRestaurant } from './actions/restaurant/scrap';

async function test() {
    const url = 'https://map.et/ethiopia/restaurants';
    console.log(`Testing scraping for ${url}...`);
    const result = await scrapRestaurant(url);
    console.log('Result:', result);
}

test();
