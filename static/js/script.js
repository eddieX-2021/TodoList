let calendar; // Declare calendar variable outside the function

document.getElementById("calendarBtn").addEventListener("click", function () {
    console.log("Calendar button clicked");
    var container = document.querySelector(".container");
    var calendarContainer = document.getElementById("calendar");

    if (container.dataset.toggle === "original") {
        // Replace the content with the calendar
        container.innerHTML = ''; // Clear the container
        calendarContainer.style.display = "block"; // Show the calendar container
        container.appendChild(calendarContainer); // Append the calendar container

        // Initialize the calendar if it hasn't been initialized yet
        if (!calendar) {
            calendar = new FullCalendar.Calendar(calendarContainer, {
                initialView: 'dayGridMonth', // Set the initial view to month
                events: '/get-tasks', // Fetch tasks from this endpoint
                eventClick: function (info) {
                    // Handle event click (e.g., show task details)
                    alert('Task: ' + info.event.title);
                }
            });
            calendar.render(); // Render the calendar
        }

        container.dataset.toggle = "calendar"; // Track that we are showing the calendar
    } else {
        // Restore the original content
        container.innerHTML = `
            <div class="to-do">
                <h1>To do</h1>
                <button class="new-task" id="todoBtn" data-category="to-do">+ Add a Task</button>
            </div>
            <div class="doing">
                <h1>Doing</h1>
                <button class="new-task" id="doingBtn" data-category="doing">+ Add a Task</button>
            </div>
            <div class="done">
                <h1>Done</h1>
                <button class="new-task" id="doneBtn" data-category="done">+ Add a Task</button>
            </div>
        `;
        container.dataset.toggle = "original"; // Track that we are showing the original content
        calendarContainer.style.display = "none"; // Hide the calendar container
    }
});
function toggleDropdown() {
    const dropdownMenu = document.getElementById("dropdownMenu");
    dropdownMenu.style.display = dropdownMenu.style.display === "none" || dropdownMenu.style.display === "" ? "block" : "none";
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('#settingBtn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.style.display === 'block') {
                openDropdown.style.display = 'none';
            }
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("taskModal");
    var addTaskButtons = document.querySelectorAll(".new-task");
    var closeModal = document.getElementById("closeModal");
    var taskForm = document.getElementById("taskForm");
    let selectedCategory = '';
    var calendarEl = document.getElementById('calendar');


    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Set the initial view to month
        events: '/get-tasks', // Fetch tasks from this endpoint
        eventClick: function (info) {
            // Handle event click (e.g., show task details)
            alert('Task: ' + info.event.title);
        }
    });

    calendar.render(); // Render the calendar
    // Function to open the modal
    function openModal(category) {
        modal.style.display = "flex"; // Display the modal
        selectedCategory = category;
    }

    // Add event listeners to all "Add Task" buttons
    addTaskButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const category = this.getAttribute('data-category'); // Get the category from the button
            openModal(category); // Pass the category to the modal opening function
        });
    });

    closeModal.addEventListener("click", function () {
        modal.style.display = "none"; // Hide the modal
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none"; // Close modal if clicking outside the modal
        }
    });

    taskForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(this); // Get form data
        formData.append('taskCategory', selectedCategory); // Append the selected category to the form data

        fetch('/add-task', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    addTaskToUI(data.task, selectedCategory); // Call the function to add the task to the UI with the category
                    closeModal(); // Close the modal after adding the task
                } else if (data.error) {
                    alert(data.error); // Show error message
                }
            })
            .catch(error => console.error('Error:', error));
    });
});

// Function to add the task to the UI
function addTaskToUI(task, category) {
    const categoryContainer = document.querySelector(`.${category}`); // Select the correct category container
    const taskElement = document.createElement('div');
    taskElement.classList.add('task'); // Add a class for styling

    // Set the inner HTML with the desired structure
    taskElement.innerHTML = `
        <div class="task-header">
            <span class="task-name">${task.name}</span>
            <span class="task-label">${task.label}</span>
        </div>
        <div class="task-details">${task.details}</div>
        <div class="task-footer">
            <span class="due-date">${task.due_date}</span> <!-- Due date on the left -->
            <button class="delete-task" data-id="${task.id}">Delete</button> <!-- Delete button on the right -->
        </div>
    `;

    categoryContainer.appendChild(taskElement);

    // Add event listener for the delete button
    const deleteButton = taskElement.querySelector('.delete-task');
    deleteButton.addEventListener('click', function () {
        const taskId = this.getAttribute('data-id');
        deleteTask(task.id, taskElement); // Call delete function with task ID and element
    });
}


function deleteTask(taskId, taskElement) {
    fetch(`/delete-task/${taskId}`, {
        method: 'DELETE' // Use DELETE method
    })
        .then(response => {
            if (response.ok) {
                taskElement.remove(); // Remove the task element from the UI
            } else {
                alert('Failed to delete the task.'); // Handle error
            }
        })
        .catch(error => console.error('Error:', error));
}


// Assuming you have a function to handle the form submission
document.getElementById('taskForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this); // Get form data

    fetch('/add-task', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // Assuming you have a function to add the task to the UI
                addTaskToUI(data.task); // Call the function to add the task to the UI
                closeModal(); // Close the modal after adding the task
            } else if (data.error) {
                alert(data.error); // Show error message
            }
        })
        .catch(error => console.error('Error:', error));
});

document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Set the initial view to month
        events: '/get-tasks', // Fetch tasks from this endpoint
        eventClick: function (info) {
            // Handle event click (e.g., show task details)
            alert('Task: ' + info.event.title);
        }
    });

    calendar.render(); // Render the calendar
});