const search = document.querySelector('#search');
const searchInput = search.querySelector("input");
const searchButton = search.querySelector("button");

//Adding eventlistener to searchButton to change the searchInput value into slug form and set the window.location to the slug
searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    const slug = searchInput.value.replace(/\s+/g, '-').toLowerCase();
    window.location = `/game/${slug}`
})