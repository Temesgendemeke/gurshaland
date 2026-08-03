import { getResponse } from "./actions/ai/chat";


const test = async () => {
    const response = await getResponse("hello");
    console.log(response);
}

test();
