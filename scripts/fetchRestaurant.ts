import 'dotenv/config';



const getRestaurentFromPlaces = async ()=> {
    try {
        const url = `https://serpapi.com/search.json?engine=google_maps&q=ethiopian_restaurant&api_key=${process.env.SERP_API_KEY}&ll=@40.7455096,-74.0083012,14z&type=search`

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }

        })

        const data = await res.json()
        console.log(data.serpapi_pagination.next)
    } catch (error) {
        console.log(error)
    }
}

getRestaurentFromPlaces()



