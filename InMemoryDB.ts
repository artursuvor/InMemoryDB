class InMemoryDB {
    private db: Record<string, Record<string, string>>;

    constructor() {
        this.db = {};

    }

    // GET <key> <column>: Returns the value stored in the record identified by <key> and <column>. 
    // Returns an empty string "" if the <key> or <column> has not been set.
    GET(key: string, column: string): string {
        if (this.db[key] && this.db[key][column]) {
            return this.db[key][column];
        }
        return "";
    }

    // SET_OR_INC <key> <column> <value>: If the <key> and <column> exist, increments the current value by <value>. 
    // If they do not exist, sets the <value>.
    SET_OR_INC(key: string, column: string, value: number): number | string {
        if (!this.db[key]) {
            this.db[key] = {};
        }
        if (!this.db[key][column]) {
            this.db[key][column] = String(value); // Convert number to string
        } else {
            this.db[key][column] = String(Number(this.db[key][column]) + value); // Increment numeric value
        }
        return this.db[key][column];
    }
    
    // DELETE <key> <column>: Deletes the record identified by <key> and <column>.
    DELETE(key: string, column: string): boolean {
        if (this.db[key] && this.db[key][column]) {
            delete this.db[key][column];
            return true;
        }
        return false;
    }

    // TOP_N_KEYS <count>: Returns the top <count> keys with the highest number of columns set.
    // If multiple keys have the same number of columns, they should be ordered lexicographically.
    
    TOP_N_KEYS(count: number): string[] {
        // Create an array of keys with their total column count
        const keysWithCounts: { key: string, count: number }[] = [];
    
        // Iterate over each key in this.db
        for (const key in this.db) {
            if (Object.prototype.hasOwnProperty.call(this.db, key)) {
                const columns = this.db[key];
                const totalCount = Object.keys(columns).length;
                keysWithCounts.push({ key, count: totalCount });
            }
        }
    
        // Sort keys by count descending, then by lexicographical order
        keysWithCounts.sort((a, b) => {
            if (b.count !== a.count) {
                return b.count - a.count; // Sort by count descending
            } else {
                return a.key.localeCompare(b.key); // Sort lexicographically for ties
            }
        });
    
        // Get top count keys
        const result: string[] = keysWithCounts.slice(0, count).map(item => `${item.key}(${item.count})`);
    
        return result;
    }
}

export default InMemoryDB;