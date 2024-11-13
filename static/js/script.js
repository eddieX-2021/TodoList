document.getElementById("calendarBtn").addEventListener("click", function () {
    var container = document.querySelector(".container");
    if (container.dataset.toggle === "original") {
        // Replace the content with the calendar
        container.innerHTML = `
            <div id="calendarContainer" style="text-align:center; padding: 20px;">
                <h2>Calendar</h2>
                <p>This is a placeholder for the calendar</p>
            </div>
        `;
        container.dataset.toggle = "calendar"; // Track that we are showing the calendar
    } else {
        // Restore the original content
        container.innerHTML = `
            <div class="to-do">
                <h1>To do</h1>
                <button class="new-task" id ="todoBtn">+ Add a Task</button>
            </div>
            <div class="doing">
                <h1>Doing</h1>
                <button class="new-task" id ="doingBtn">+ Add a Task</button>
            </div>
            <div class="done">
                <h1>Done</h1>
                <button class="new-task" id ="doneBtn">+ Add a Task</button>
            </div>
            <div class="new-cat"></div>
                <button class="new-category" id ="newCatBtn">+ Add another Category</button>
            </div>
        `;
        container.dataset.toggle = "original"; // Track that we are showing the original content
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


//task opening button
document.addEventListener("DOMContentLoaded", function () {
    // Get the modal and the buttons to open it
    var modal = document.getElementById("taskModal");
    var addTaskButtons = document.querySelectorAll(".new-task");

    // Get the close button
    var closeModal = document.getElementById("closeModal");

    // Function to open the modal
    function openModal() {
        modal.style.display = "flex"; // Display the modal
    }

    // Add event listeners to all "Add Task" buttons
    addTaskButtons.forEach(function (button) {
        button.addEventListener("click", openModal);
    });
    closeModal.addEventListener("click", function () {
        modal.style.display = "none"; // Hide the modal
    });
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none"; // Close modal if clicking outside the modal
        }
    })


    var taskForm = document.getElementById("taskForm");
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission (for now)
        alert("Task Added: " + document.getElementById("taskName").value);
        taskForm.reset();
        modal.style.display = "none";
    });
});
