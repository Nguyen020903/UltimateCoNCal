// Keep track of current selections
let currentDoctrine = 'western';
let currentUnitType = 'infantry';

// Initialize when the document loads
document.addEventListener('DOMContentLoaded', () => {
    // Set up doctrine change listener
    const doctrineSelect = document.getElementById('doctrine');
    doctrineSelect.addEventListener('change', updateDoctrine);

    // Set up unit type button listeners
    const unitTypeButtons = document.querySelectorAll('.unit-type-btn');
    unitTypeButtons.forEach(button => {
        button.addEventListener('click', (e) => updateUnitType(e.target));
    });

    // Set initial state
    updateDisplay();
});

function updateDoctrine() {
    const doctrineSelect = document.getElementById('doctrine');
    currentDoctrine = doctrineSelect.value;
    updateDisplay();
}

function updateUnitType(buttonElement) {
    // Remove active class from all buttons
    document.querySelectorAll('.unit-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    buttonElement.classList.add('active');

    // Update current unit type (convert button text to lowercase)
    currentUnitType = buttonElement.textContent.toLowerCase();
    updateDisplay();
}

function updateDisplay() {
    // Hide all unit tabs first
    const allUnitTabs = document.querySelectorAll('.unit-tab');
    allUnitTabs.forEach(tab => {
        tab.style.display = 'none';
    });

    // Show the correct tab based on current selections
    const targetTabId = `${currentUnitType}-${currentDoctrine}`;
    const targetTab = document.getElementById(targetTabId);
    
    if (targetTab) {
        targetTab.style.display = 'block';
    }
}

// Input validation function
function validateInput(input) {
    // Remove any non-numeric characters
    input.value = input.value.replace(/[^0-9]/g, '');
    
    // Ensure the value is not negative
    if (input.value < 0) {
        input.value = 0;
    }
}