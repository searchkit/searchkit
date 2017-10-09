export function ExistsQuery(field) {
    return {
        exists: { field }            
    }
}