import { useEffect, useState } from "react";
import { get } from "../utils/services";
import { getVendorName } from "../utils/vendors";
import { getUser } from "../utils/user";
import { ManifestDatabase } from "../utils/ManifestDatabase";

// TODO: IMPLEMENT LOGOUT. ALL LOCAL STORAGE / IDB AND SENDS USER TO LOG IN SCREEN. 

export async function getInventories() {
    console.log("Getting user...");
    const user = await getUser();
    console.log(user);
    console.log("Getting database...");
    const db = await new ManifestDatabase().build();
    console.log("Getting items...");
    const itemDefinitions = await db.getItems();
    console.log("Displaying data...");

    // Xûr, Banshee-44, Ada-1.
    const vendorHashes = ["2190858386", "672118013", "350061650"];
    return Promise.all(vendorHashes.map(async (vendorHash) => {
        const inventory = { vendorHash: vendorHash, items: [] };
        const json = await get(`/${user.membershipType}/Profile/${user.membershipId}/Character/${user.characterId}/Vendors/${vendorHash}/?components=402`);
        if (json.Response === undefined) {
            return inventory;
        }
        const sales = Object.values(json.Response.sales.data);
        const items = await Promise.all(sales.map(sale => itemDefinitions[sale.itemHash]));
        inventory.items = items;
        return inventory;
    }));
}

const Landing = () => {
    const [inventories, setInventories] = useState(null);

    useEffect(() => {
        getInventories().then(inventories=> {
            setInventories(inventories);
            console.log(inventories);
        });
    }, []);

    if (!inventories) {
        return <p>Loading...</p>
    }

    return inventories.map(inventory => <InventoryDisplay inventory={inventory} />);
}

const InventoryDisplay = ({ inventory }) => {
    return (
        <div className="inventory-container tile">
            <p>{getVendorName(inventory.vendorHash)}</p>
            {inventory.items.map(item => <img key={item.displayProperties.name} alt={item.displayProperties.name} src={`https://bungie.net${item.displayProperties.icon}`} />)}
        </div>
    );
} 

export default Landing;