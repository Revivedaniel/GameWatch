[...document.querySelectorAll(".game")].map((game) => {
    game.addEventListener('click', (event) => {
        window.location = game.dataset.ref;
    });
});