const review = document.querySelector('#newReview');
const select = review.querySelector('select');
const input = review.querySelector('input');
const button = review.querySelector('button');
const reviewsEl = document.querySelector('#reviews');

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

  if (response.redirected) {
    window.location = "/login"
  } else if (response.ok) {
    window.location.reload();
  } else {
    alert(response.statusText);
  }
});
