import { get } from "./services";

export class ManifestDatabase {
    constructor() {
        this.db = null;
    }

    async build() {
        return new Promise((resolve, reject) => {
            const handleReject = (event) => reject(event);
            const dbRequest = indexedDB.open("destiny-scout", 1);

            dbRequest.onupgradeneeded = (event) => {
                event.target.result.createObjectStore("manifest");
                sessionStorage.removeItem("item-definition-path"); 
            }
    
            dbRequest.onsuccess = async () => {
                this.db = dbRequest.result;
                const localPath = sessionStorage.getItem("item-definition-path");
                const manifest = await get("/Manifest/");
                const newPath = manifest.Response.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition;
        
                // No db, or the current db is outdated. Fetch itemDefinitions to fill db.
                if (!localPath || localPath !== newPath) {
                    sessionStorage.setItem("item-definition-path", newPath); 
                    const itemDefinition = await fetch(`https://www.bungie.net${newPath}`).then(response => response.json());
                    const transaction = this.db.transaction("manifest", "readwrite");
                    const store = transaction.objectStore("manifest");
                    const putRequest = store.put(itemDefinition, "item-definition");
                    putRequest.onsuccess = () => resolve(this);
                    putRequest.onerror = handleReject;
                }
                else resolve(this);
            }

            dbRequest.onerror = handleReject;
        });
    }

    async getItems() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction("manifest", "readonly");
            const store = transaction.objectStore("manifest");
            const getRequest = store.get("item-definition");

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = (event) => reject(event);
        });
    }
}


