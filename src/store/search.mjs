import { signal } from 'https://unpkg.com/usignal';

export const searchQuery = signal('');

export const searchError = signal('');
export const annotationCards = signal([]);

export async function fetchAnnotations(query = '') {
    if (!query.trim()) {
        const searchParams = new URLSearchParams({
            q: '*',
            sort_by: 'date:desc',
            per_page: 10,
            page: 1
        });
        const response = await fetch(`/api/search?${searchParams.toString()}`);
        return await response.json();
    }
    const searchParams = new URLSearchParams({
        q: query,
        query_by: 'text_exact,text_prefix,text_suffix,embedding',
        per_page: 10,
        page: 1,
        exclude_fields: "embedding",
        prefix: false // no idea what this does
    });
    const response = await fetch(`/api/search?${searchParams.toString()}`);
    return await response.json();
}

export async function fetchAnnotationDetails(id) {
   const response = await fetch(`/annotations/${id}.json`);
   if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
   }
   return await response.json();
}
