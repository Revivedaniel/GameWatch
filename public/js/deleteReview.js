//Selecting the deleteButton
const deleteButton = document.querySelector('#deleteButton');
//Adding event listener to the deleteButton that sends a DELETE fetch request with the /api/reviews/{Review ID}
deleteButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const review = deleteButton.dataset.review_id
    console.log(review)
    const response = await fetch(`/api/reviews/${review}`, {
        method: 'DELETE',
        body: "",
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
})