/*
 * Fetch wrapper for making authorized request to the Bungie.net API. 
 */
export async function getWithAuth(path) {
    const token = sessionStorage.getItem("token");
    const response = await fetch("https://www.bungie.net/Platform/Destiny2" + path, {
        headers: {
            "X-API-KEY": process.env.REACT_APP_API_KEY,
            "Authorization": `Bearer ${token}`
        }
    });
    return response.json();
}