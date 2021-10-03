const updateButton = document.querySelector('#updateButton');

updateButton.addEventListener('click', async (event) => {
    event.preventDefault();
    updateButton.style.display = "none"
    const review = updateButton.dataset.review_id
    //hiding current stars
    event.target.parentElement.querySelector('.stars').style.display = "none";
    //hiding current reviewBody
    event.target.parentElement.querySelector('.reviewBody').style.display = "none";
    console.log(event.target.parentElement)
    const span1 = document.createElement('span');
    const span2 = document.createElement('span');

    const label = document.createElement('label');
    label.setAttribute("for", "stars");
    label.innerText = "How many stars?";

    const select = document.createElement('select');
    for (let i = 1; i < 7; i++) {
        const option = document.createElement('option');
        option.setAttribute("value", i);
        option.innerText = i;
        select.appendChild(option);
    }
    select.value = updateButton.parentElement.querySelector('.stars').dataset.stars;
    select.setAttribute('id', "newStars")

    const input = document.createElement('input');
    input.setAttribute('type', "text")
    input.setAttribute('name', "review")
    input.setAttribute('id', 'newReview')
    input.value = updateButton.parentElement.querySelector('.reviewBody').dataset.reviewbody

    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.dataset.review_id = updateButton.dataset.review_id
    button.setAttribute("id", "updateReview")
    button.innerText = "Update"

    span1.appendChild(label)
    span1.appendChild(select)

    span2.appendChild(input);
    span2.appendChild(button);

    event.target.parentElement.append(span1)
    event.target.parentElement.append(span2)

    button.addEventListener('click', async (event) => {
        event.preventDefault();

        const updatedReview = {
            stars: event.target.parentElement.parentElement.querySelector('#newStars').value,
            review: event.target.parentElement.querySelector('#newReview').value
        }

        const response = await fetch(`/api/reviews/${updateButton.dataset.review_id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...updatedReview }),
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.ok) {
            document.location.reload();
          } else {
            alert(response.statusText);
          }
    })

})