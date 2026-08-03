import ride_venders from './json/ride_vendors.json'
import fs from 'fs'


// parsed json data from ride_vendors.json

const fetchCatalog = async(id: string | number)=> {
   const res = await fetch(`https://api.ridefood.app/vendors/${id}/catalogue-page`)

   console.log('id ', id)

   if(!res.ok){
    console.log('ffdfd')
    return 
   }

   const data = await res.json()

    const restaurent = {
        name: data.vendor.name,
        description: '',
        address: data.vendor.street,
        city: data.vendor.city,
        country: data.vendor.country,
        category: data.vendor.categories,
        image: {
            url: 'https://static.playfood.com/' + data.vendor.imagePath,
            path: ' '
        },
        rating: data.vendor.rating,
        menu: data.catalog[0].products.map((product: any) => {
            return {
                name: product.name,
                description: product.description,
                price: {
                    amount: product.originalPrice,
                    currency: 'ETB'
                }
            }
        }),
    }
    return restaurent
}

const getEach = async () => {
    let res = []
     for (const item of ride_venders){
        res.push(await fetchCatalog(item.id))
     }
    
     fs.writeFileSync('scripts/json/clean/ride.json', JSON.stringify(res))
} 

getEach()