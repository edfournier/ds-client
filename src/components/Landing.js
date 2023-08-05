import { useEffect, useState } from "react";
import { getWithAuth } from "../utils/services";
import { Database } from "../utils/Database";
import { getVendorName } from "../utils/vendors";
import { useAuth } from "../auth/AuthProvider";
import { Search } from "./Search";
import { Inventory } from "./Inventory";
import { Logout } from "./Logout";


async function getVendorInventories(user, itemDefinitions) {
    // Xûr, Banshee-44, Ada-1.
    const vendorHashes = ["2190858386", "672118013", "350061650"];
    return Promise.all(vendorHashes.map(async (vendorHash) => {
        const inventory = { 
            label: getVendorName(vendorHash), 
            items: [] 
        };
        const json = await getWithAuth(`/${user.membershipType}/Profile/${user.membershipId}/Character/${user.characterId}/Vendors/${vendorHash}/?components=402`);
        if (!json.Response) {
            return inventory;
        }
        const sales = Object.values(json.Response.sales.data);
        inventory.items = sales
            .map(sale => itemDefinitions[sale.itemHash])
            .filter(item => item !== undefined);
        return inventory;
    }));
}

async function getTrackedItems(user, itemDefinitions) {
    return { label: "Tracked", items: [] };
}

export function Landing() {
    const auth = useAuth();
    const [itemDefinitions, setItemDefinitions] = useState(null);
    const [inventories, setInventories] = useState(null);

    useEffect(() => {
        async function load() {
            const db = await new Database().build();
            const itemDefinitions = await db.getItems();
            const inventories = await Promise.all([
                getVendorInventories(auth.user, itemDefinitions), 
                getTrackedItems(auth.user, itemDefinitions),
            ]);

            setItemDefinitions(itemDefinitions);
            setInventories(inventories.flat());
        }
        load();
    }, [auth]);

    if (!inventories) {
        return <p>Loading...</p>
    }

    return (
        <div className="home-view">
            <div>
                <Logout />
            </div>
            <div className="inventories">
                {inventories.map(inventory => <Inventory key={inventory.label} inventory={inventory} />)}
            </div>
            <Search itemDefinitions={itemDefinitions}/>
        </div>
    );
}