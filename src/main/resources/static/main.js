document.addEventListener("DOMContentLoaded", function() {
    // Authentication and nav logic (as before)
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutForm = document.getElementById('logout-form');
    const adminDashboardLink = document.getElementById('admin-dashboard-link');

    fetch('/auth/user')
        .then(response => response.ok ? response.json().catch(() => null) : null)
        .then(user => {
            if (user && user.name) {
                if (loginLink) loginLink.style.display = 'none';
                if (registerLink) registerLink.style.display = 'none';
                if (logoutForm) logoutForm.style.display = 'block';
                const roles = user.authorities ? user.authorities.map(auth => auth.authority) : [];
                if (adminDashboardLink && roles.includes('ROLE_ADMIN')) {
                    adminDashboardLink.style.display = 'block';
                }
            } else {
                if (loginLink) loginLink.style.display = 'block';
                if (registerLink) registerLink.style.display = 'block';
                if (logoutForm) logoutForm.style.display = 'none';
            }
        });

    // Pagination and filtering logic
    let allCars = [];
    let filteredCars = [];
    let currentPage = 1;
    let pageSize = 10;

    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const pageSizeSelect = document.getElementById('page-size-select');
    const paginationControls = document.getElementById('pagination-controls');
    const vehicleList = document.getElementById('vehicle-list');

    function renderCarsPage() {
        vehicleList.innerHTML = '';
        if (filteredCars.length === 0) {
            vehicleList.innerHTML = '<p class="login-prompt">No cars match your criteria.</p>';
            paginationControls.innerHTML = '';
            return;
        }
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const carsToShow = filteredCars.slice(startIdx, endIdx);

        carsToShow.forEach(car => {
            const averageRating = car.average_rating ? car.average_rating.toFixed(1) : 'Not Rated';
            const carCard = `
                <div class="vehicle-card-v2">
                    <div class="card-image-container" style="background-image: url('${car.image_url}')"></div>
                    <div class="card-content">
                        <h3>${car.model}</h3>
                        <p class="card-subtitle">${car.year} - ${car.type}</p>
                        <div class="card-footer">
                            <span class="rating-display">&#9733; ${averageRating}</span>
                            <a href="review.html?carId=${car.car_id}" class="review-btn">Review</a>
                        </div>
                    </div>
                </div>
            `;
            vehicleList.insertAdjacentHTML('beforeend', carCard);
        });

        renderPagination();
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredCars.length / pageSize);
        let html = '';
        if (totalPages > 1) {
            html += `<button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">Prev</button>`;
            for (let i = 1; i <= totalPages; i++) {
                html += `<button ${i === currentPage ? 'class="active"' : ''} data-page="${i}">${i}</button>`;
            }
            html += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">Next</button>`;
        }
        paginationControls.innerHTML = html;

        // Add event listeners for pagination buttons
        Array.from(paginationControls.querySelectorAll('button[data-page]')).forEach(btn => {
            btn.addEventListener('click', function() {
                const page = parseInt(this.getAttribute('data-page'));
                if (!isNaN(page) && page >= 1 && page <= Math.ceil(filteredCars.length / pageSize)) {
                    currentPage = page;
                    renderCarsPage();
                }
            });
        });
    }

    function filterAndSortCars() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredCars = allCars.filter(car =>
            car.model.toLowerCase().includes(searchTerm) ||
            car.type.toLowerCase().includes(searchTerm) ||
            car.year.toString().includes(searchTerm)
        );
        // Sorting logic
        const sortValue = sortSelect.value;
        switch(sortValue) {
            case 'rating-desc':
                filteredCars.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
                break;
            case 'rating-asc':
                filteredCars.sort((a, b) => (a.average_rating || 0) - (b.average_rating || 0));
                break;
            case 'year-desc':
                filteredCars.sort((a, b) => b.year - a.year);
                break;
            case 'year-asc':
                filteredCars.sort((a, b) => a.year - b.year);
                break;
        }
        currentPage = 1; // Reset to first page on filter/sort change
        renderCarsPage();
    }

    // Initial fetch and event listeners
    fetch('/api/cars')
        .then(res => res.json())
        .then(data => {
            allCars = data;
            filteredCars = data;
            renderCarsPage();
            searchInput.addEventListener('input', filterAndSortCars);
            sortSelect.addEventListener('change', filterAndSortCars);
            pageSizeSelect.addEventListener('change', function() {
                pageSize = parseInt(this.value);
                currentPage = 1;
                renderCarsPage();
            });
        })
        .catch(error => {
            vehicleList.innerHTML = '<p class="login-prompt">Could not load car data. Please try again later.</p>';
        });
});
