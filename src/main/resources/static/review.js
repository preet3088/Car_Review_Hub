document.addEventListener("DOMContentLoaded", function() {
    const authPrompt = document.getElementById('auth-prompt');
    const reviewContentWrapper = document.getElementById('review-content-wrapper');
    let carModelName = '';

    // Check user authentication status
    fetch('/auth/user')
        .then(response => response.ok ? response.json().catch(() => null) : null)
        .then(user => {
            if (user && user.name) {
                authPrompt.style.display = 'none';
                reviewContentWrapper.style.display = 'block';
                initializeReviewPage();
            } else {
                authPrompt.style.display = 'block';
                reviewContentWrapper.style.display = 'none';
            }
        });

    function initializeReviewPage() {
        const formWrapper = document.getElementById('form-wrapper');
        const successMessage = document.getElementById('success-message');
        const reviewForm = document.getElementById('review-form');
        const starRatingsContainer = document.getElementById('star-ratings-container');
        const reviewCarHeader = document.getElementById('review-car-header');
        const reviewCarImage = document.getElementById('review-car-image');
        const reviewCarModel = document.getElementById('review-car-model');
        const thankYouHeading = document.getElementById('thank-you-heading');
        const backLink = document.getElementById('back-link');

        if (backLink) {
            backLink.addEventListener('click', (e) => { e.preventDefault(); window.history.back(); });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get('carId');

        // Fetch car details
        fetch(`/api/cars/${carId}`).then(response => response.json()).then(car => {
            carModelName = car?.model ?? 'this car';
            reviewCarModel.textContent = `Reviewing the ${carModelName}`;
            if (car?.image_url) {
                reviewCarImage.src = car.image_url;
                reviewCarImage.style.display = 'block';
            }
        });

        // Fetch and render star ratings
        fetch('/api/rating-types').then(response => response.json()).then(ratingTypes => {
            ratingTypes.forEach(ratingType => {
                const safeName = ratingType.name.replace(/\s+/g, '-').toLowerCase();
                const ratingElement = `
                    <div class="star-rating-group" data-rating-name="${ratingType.name}">
                        <label class="star-rating-label">${ratingType.name}:</label>
                        <div class="star-row">
                            <input type="radio" id="star5-${safeName}" name="${safeName}" value="5" /><label for="star5-${safeName}">&#9733;</label>
                            <input type="radio" id="star4-${safeName}" name="${safeName}" value="4" /><label for="star4-${safeName}">&#9733;</label>
                            <input type="radio" id="star3-${safeName}" name="${safeName}" value="3" /><label for="star3-${safeName}">&#9733;</label>
                            <input type="radio" id="star2-${safeName}" name="${safeName}" value="2" /><label for="star2-${safeName}">&#9733;</label>
                            <input type="radio" id="star1-${safeName}" name="${safeName}" value="1" required /><label for="star1-${safeName}">&#9733;</label>
                        </div>
                    </div>`;
                starRatingsContainer.insertAdjacentHTML('beforeend', ratingElement);
            });
        }).catch(error => {
            starRatingsContainer.innerHTML = '<p class="error-text">Failed to load rating categories.</p>';
        });

        // --- THIS IS THE FIX: The complete form submission logic ---
        reviewForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Stop the default page reload

            const ratings = [];
            // Gather the data from each star rating group
            document.querySelectorAll('.star-rating-group').forEach(group => {
                const checkedRadio = group.querySelector('input[type="radio"]:checked');
                const originalName = group.getAttribute('data-rating-name');
                if (checkedRadio && originalName) {
                    ratings.push({
                        value: parseInt(checkedRadio.value),
                        ratingType: { name: originalName }
                    });
                }
            });

            // Ensure all categories have been rated
            const totalRatingTypes = document.querySelectorAll('.star-rating-group').length;
            if (ratings.length < totalRatingTypes) {
                alert("Please rate all categories before submitting.");
                return;
            }

            // Prepare the data to be sent to the server
            const reviewData = {
                car: { car_id: carId },
                review_text: document.getElementById('review_text').value,
                ratings: ratings
            };

            // Send the data to the backend API
            fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            }).then(response => {
                if (response.ok) {
                    // If successful, show the thank you message
                    thankYouHeading.textContent = `Thank you for reviewing the ${carModelName}!`;
                    reviewCarHeader.style.display = 'none';
                    formWrapper.style.display = 'none';
                    successMessage.style.display = 'block';
                } else {
                    // If there's an error, alert the user
                    alert("Failed to submit review. Please try again.");
                }
            }).catch(error => {
                console.error("Submission error:", error);
                alert("An error occurred. Please check your network connection and try again.");
            });
        });
    }
});
