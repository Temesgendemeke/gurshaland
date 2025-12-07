import { Restaurant } from "@/utils/types/restaurant"
import allRestaurants from "./json/AllRestaurantsApi.json"
import {JSDOM} from 'jsdom'
import { FetchRestaurantType, GetRestaurentType, RestaurantFormType } from "@/schema/restaurent"
import fs from 'fs'
import { slugify } from "@/utils/slugify"

const url = 'https://deliveraddis.com/restaurants'



const getLocation = async (coordinates: number[]) => {
    const [latitude, longitude] = coordinates

    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
            headers: {
                'User-Agent': 'GurshaLandScraper/1.0 (contact@example.com)'
            },
            signal: AbortSignal.timeout(10000) // 10s timeout
        })

        if(!res.ok){
            throw new Error('Failed to fetch location')
        }
        const data = await res.json()
        return data.address.county + ', ' + 'Adis Ababa' + ', ' + 'Ethiopia'
    } catch (e) {
        console.error(`Failed to get location for ${latitude}, ${longitude}:`, e)
        console.warn(`[Location] Failed for ${latitude}, ${longitude} (sketchy connection?)`)
        return `Lat: ${latitude}, Lon: ${longitude}`
    }
}

const scrapRestaurantDetail = async (path: string, retries = 5) => {
    // console.log(`Scraping: ${path}`)
    try {
        const res = await fetch(`https://deliveraddis.com${path}`, {
            signal: AbortSignal.timeout(10000)
        })
        
        if (res.status === 429 && retries > 0) {
            const waitTime = 10000 + Math.random() * 5000;
            console.warn(`[429] Rate limited on ${path}. Retrying in ${Math.round(waitTime/1000)}s...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return scrapRestaurantDetail(path, retries - 1);
        }

        if(!res.ok){
            const errorText = await res.text()
            console.error(`Error fetching ${path}: ${res.status}`)
            throw new Error(`Failed to fetch restaurant details: ${res.status}`)
        }
        const html = await res.text()
        const dom = new JSDOM(html)
        const name = dom.window.document.querySelector('.restaurant-details')
        const menus = dom.window.document.querySelectorAll('.menu-item')
        const menuList = []
        for (const item of menus){
            menuList.push({
                name: item.querySelector('h4').textContent.trim(),
                price: {
                    amount: item.querySelector('span.price').textContent.trim(),
                    currency: 'ETB'
                },
                description: item.querySelector('.twelve p').textContent.trim()
            })
        }
        return menuList
    } catch (e) {
        if (retries > 0) {
             console.warn(`[Fetch] Error on ${path}. Retrying... (${retries} left)`);
             await new Promise(resolve => setTimeout(resolve, 3000));
             return scrapRestaurantDetail(path, retries - 1);
        }
        throw e;
    }
}


const fetchRestaurants = async () => {
    // const res = await fetch('https://deliveraddis.com/restaurants/AllRestaurantsApi')

    //  if(!res){
    //     throw new Error('Failed to fetch restaurant details')
    // }

    // const restaurants = await res.json()
    const cleanRestaurants: any[] = []
    
    // Handle saving on exit
    const save = () => {
        console.log(`\nSaving ${cleanRestaurants.length} restaurants...`)
        fs.writeFileSync('scripts/json/clean/addisDelivery.json', JSON.stringify(cleanRestaurants, null, 2))
        console.log('Saved.')
    }
    
    process.on('SIGINT', () => {
        save();
        process.exit();
    });

    for (const [index, r] of allRestaurants.entries()){
        try {
            console.log(`[${index + 1}/${allRestaurants.length}] Processing ${r.name}...`)
            const menu = await scrapRestaurantDetail(r.url)
            
            // Random delay 2-6 seconds
            const delay1 = 2000 + Math.random() * 4000;
            await new Promise(resolve => setTimeout(resolve, delay1));
            
            const ll = await getLocation(r.coordinates)
            
            // Random delay 2-6 seconds
            const delay2 = 2000 + Math.random() * 4000;
            await new Promise(resolve => setTimeout(resolve, delay2));

            cleanRestaurants.push({
                name: r.name,
                slug: slugify(r.name),
                description: r.description || "No description provided",
                rating: r.rating,
                cuisines: r.cuisines,
                address: ll,
                city: 'Adis Ababa',
                country: 'Ethiopia',
                image: {
                    url: r.profile_image || "",
                    path: ''
                },
                menu,
                phone: "+251911000000",
                email: "info@example.com",
                author_id: "d290f1ee-6c54-4b01-90e6-d701748f0851"
            })
            
            // Save every 5 items
            if (cleanRestaurants.length % 5 === 0) {
                fs.writeFileSync('scripts/json/clean/addisDelivery.json', JSON.stringify(cleanRestaurants, null, 2))
            }
            
        } catch (error) {
            console.error(`Skipping restaurant ${r.name} due to error:`, error)
        }
    }


    save();


    return cleanRestaurants
}

fetchRestaurants().then(data => console.log("Done!"))
