import { searchQuery } from "../store/search.mjs";

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', (e) => {
    searchQuery.value = e.target.value
});
