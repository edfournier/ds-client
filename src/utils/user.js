import { get } from "./services";

/*
 * Stores in session storage a stringified object containing the user's Destiny membership ID, type, and character ID. 
 */
export async function cacheUser() {
    const AUTH_CODE = window.location.search.substring(6);
    const response = await fetch("https://www.bungie.net/Platform/App/OAuth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `client_id=${process.env.REACT_APP_CLIENT_ID}&code=${AUTH_CODE}&grant_type=authorization_code`
    });
    const json = await response.json();
    sessionStorage.setItem("token", json.access_token);

    // Get Destiny profiles linked to Bungie ID. 
    const profiles = await get(`/254/Profile/${json.membership_id}/LinkedProfiles/`);
    const { membershipId, membershipType } = profiles.Response.profiles[0];

    // Get character ID.
    const profile = await get(`/${membershipType}/Profile/${membershipId}/?components=200`);
    const characterId = Object.keys(profile.Response.characters.data)[0]; 

    sessionStorage.setItem("user", JSON.stringify({ membershipId, membershipType, characterId }));
}

/*
 * Returns the currently cached user as an object. If no user is cached, fetches and caches user data. 
 */ 
export async function getUser() {
    if (!sessionStorage.hasOwnProperty("user")) await cacheUser();
    window.history.replaceState(null, "", window.location.pathname + "#/landing");
    return JSON.parse(sessionStorage.getItem("user"));
}