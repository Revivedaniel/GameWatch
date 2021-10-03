const search = document.querySelector('#search');
const searchInput = search.querySelector("input");
const searchButton = search.querySelector("button");


searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    const slug = searchInput.value.replace(/\s+/g, '-').toLowerCase();
    window.location = `/game/${slug}`
})