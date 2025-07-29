document.addEventListener("DOMContentLoaded", function() {
    const carForm = document.getElementById('car-form');
    const carTableBody = document.getElementById('car-table-body');
    const formMsg = document.getElementById('form-msg');
    const formTitle = document.getElementById('form-title');
    
    // Form fields
    const carIdField = document.getElementById('car-id');
    const modelField = document.getElementById('model');
    const typeField = document.getElementById('type');
    const yearField = document.getElementById('year');
    const imageUrlField = document.getElementById('image_url');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    function resetForm() {
        carForm.reset();
        carIdField.value = '';
        formTitle.textContent = 'Add a New Car';
        submitBtn.textContent = 'Add Car';
        cancelBtn.style.display = 'none';
        formMsg.innerHTML = '';
    }

    function loadCars() {
        fetch('/api/cars')
            .then(res => res.json())
            .then(cars => {
                carTableBody.innerHTML = '';
                cars.forEach(car => {
                    const row = `
                        <tr>
                            <td>${car.model}</td>
                            <td>${car.type}</td>
                            <td>${car.year}</td>
                            <td>${car.average_rating ? car.average_rating.toFixed(1) : 'N/A'}</td>
                            <td>
                                <button class="edit-btn" onclick="window.editCar(${car.car_id})">Edit</button>
                                <button class="delete-btn" onclick="window.deleteCar(${car.car_id})">Delete</button>
                            </td>
                        </tr>
                    `;
                    carTableBody.insertAdjacentHTML('beforeend', row);
                });
            });
    }

    carForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const carId = carIdField.value;
        const carData = {
            model: modelField.value,
            type: typeField.value,
            year: parseInt(yearField.value),
            image_url: imageUrlField.value
        };
        const url = carId ? `/api/cars/${carId}` : '/api/cars';
        const method = carId ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carData)
        }).then(res => {
            if (res.ok) {
                formMsg.innerHTML = `<div class="success-msg">${carId ? 'Car updated' : 'Car added'} successfully!</div>`;
                resetForm();
                loadCars();
            } else {
                formMsg.innerHTML = `<div class="error-msg">Failed to ${carId ? 'update' : 'add'} car.</div>`;
            }
        });
    });

    // Make editCar function globally accessible
	// Make editCar function globally accessible
	window.editCar = function(id) {
	    // Fetch the specific car's data to ensure we have the latest version
	    fetch(`/api/cars/${id}`)
	        .then(res => {
	            if (!res.ok) {
	                throw new Error(`HTTP error! status: ${res.status}`);
	            }
	            return res.json();
	        })
	        .then(car => {
	            // Use optional chaining (?.) and nullish coalescing (??) for safety
	            // This prevents "undefined" from appearing if a property is missing.
	            carIdField.value = car?.car_id ?? '';
	            modelField.value = car?.model ?? '';
	            typeField.value = car?.type ?? '';
	            yearField.value = car?.year ?? '';
	            imageUrlField.value = car?.image_url ?? '';
	            
	            // Switch form to "Update" mode
	            formTitle.textContent = `Editing: ${car?.model ?? 'Unknown Car'}`;
	            submitBtn.textContent = 'Update Car';
	            cancelBtn.style.display = 'inline-block';
	            window.scrollTo(0, 0); // Scroll to the top to see the form
	        })
	        .catch(error => {
	            console.error("Failed to fetch car for editing:", error);
	            alert("Could not load car details for editing. Please check the browser console for more details.");
	        });
	};

    
    cancelBtn.addEventListener('click', resetForm);

    window.deleteCar = function(id) {
        if (!confirm('Are you sure you want to delete this car?')) return;
        fetch(`/api/cars/${id}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    loadCars();
                } else {
                    alert('Failed to delete car.');
                }
            });
    };

    loadCars();
});

