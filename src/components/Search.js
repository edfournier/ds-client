import { useState } from "react";

// 2. MAKE SUBMIT BUTTON SEND QUERY (CORRESPONDING HASH) TO SERVER. 
// 3. MAKE INVENTORY DISPLAY DISPLAY TRACKED ITEMS TOO IN LAND.

export function Search({ itemDefinitions }) {
    const [query, setQuery] = useState("");

    const items = Object.values(itemDefinitions);
    const compQuery = query.toLowerCase();
    const filtered = items.filter(
        item => item.displayProperties.name.toLowerCase().includes(compQuery)
    );

    function handleAddItem(e) {
        e.preventDefault();

        // Check query is the name of some item (may not have auto-filled). 
        const item = filtered.find(item => item.displayProperties.name.toLowerCase() === compQuery);
        if (!item) {
            alert(`"${query}" is an invalid search!`);
        }
        else {
            // Send query to server here here.
            console.log("User query:", query);
            console.log("Item hash to send:", item.hash);
            setQuery("");
        }
    }

    return (
        <form className="search-form">
            <input 
                className="search-box"
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)} 
                placeholder="Search an item..."
             />
            <button onClick={handleAddItem}>Add</button>
            <div className="search-container tile">
                {filtered.length < 15 ? filtered.map(item => <SearchResult key={item.hash} item={item} setQuery={setQuery}/>) : [] }
            </div>
        </form>
    );
}

function SearchResult({ item, setQuery }) {
    function handleClick() {
        setQuery(item.displayProperties.name);
        console.log(item);
    }

    return (
        <div className="search-result tile" onClick={handleClick}>
            <img className="small-item-icon" alt={item.displayProperties.name} src={`https://bungie.net${item.displayProperties.icon}`} />
            {item.displayProperties.name}
        </div>
    );
}