//Selecting the aside element
const review = document.querySelector('#newReview');
//Selecting the stars input
const select = review.querySelector('select');
//Selecting the review input
const input = review.querySelector('input');
//selecting the submit button
const button = review.querySelector('button');
//Selecting the section with the id of reviews
const reviewsEl = document.querySelector('#reviews');
//Adding event listener for the submit button to gather the values of stars and review and send a POST fetch request to /api/reviews to create a new review
button.addEventListener('click', async (event) => {
  event.preventDefault();

  const newReview = {
    game_id: button.dataset.game_id,
    stars: select.value,
    review: input.value,
  };

  const response = await fetch('/api/reviews', {
    method: 'POST',
    body: JSON.stringify({ ...newReview }),
    headers: { 'Content-Type': 'application/json' },
  });
  //If the reponse is redirected, redirect the user to the login page
  if (response.redirected) {
    window.location = "/login"
  } else if (response.ok) {
    window.location.reload();
  } else {
    alert(response.statusText);
  }
});
