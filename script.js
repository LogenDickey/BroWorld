// Import Firebase modules (make sure to include these at the top)
const app = firebase.app();
const db = firebase.firestore();
// Array of local image URLs
const images = [
    'images/Lantern.webp',
    'images/bedrock.png',
    'images/broworld.png',
    'images/chicken.webp',
    'images/cow.jpg',
    'images/diamond.png',
    'images/diamondpickaxe.gif',
    'images/enderman.png',
    'images/enderpearl.png',
    'images/grassblock.png',
    'images/netheritesword.png',
    'images/warden.jpg'
];


// Copy of images array to track unused images
let unusedImages = [...images];

// Inside initChecklist function, replace the fetch code with real-time listener
document.querySelectorAll('.checklist input[type="checkbox"]').forEach((checkbox, index) => {
    const label = checkbox.parentElement;
    const taskId = `task${index}`; // Unique ID for each task

    // Real-time listener for task state
    checklistRef.doc(taskId).onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            checkbox.checked = data.checked || false;
            if (checkbox.checked) {
                label.style.setProperty('--bg-image', `url(${getRandomImage()})`);
                // Apply line-through style
                label.querySelector('span').style.textDecoration = 'line-through';
            } else {
                label.style.setProperty('--bg-image', '');
                // Remove line-through style
                label.querySelector('span').style.textDecoration = 'none';
            }
        }
    });

    // Add event listener to update Firestore on change
    checkbox.addEventListener('change', function() {
        // Update Firestore with the new state
        checklistRef.doc(taskId).set({
            checked: this.checked
        });
    });
});

// Reference to the Firestore collection
const checklistRef = db.collection('checklist');

// Initialize the checklist
function initChecklist() {
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach((checkbox, index) => {
        const label = checkbox.parentElement;
        const taskId = `task${index}`; // Unique ID for each task

        // Fetch the task state from Firestore
        checklistRef.doc(taskId).get().then(doc => {
            if (doc.exists) {
                const data = doc.data();
                checkbox.checked = data.checked || false;
                if (checkbox.checked) {
                    label.style.setProperty('--bg-image', `url(${getRandomImage()})`);
                    // Apply line-through style
                    label.querySelector('span').style.textDecoration = 'line-through';
                }
            }
        });

        // Add event listener to update Firestore on change
        checkbox.addEventListener('change', function() {
            const span = label.querySelector('span');
            if (this.checked) {
                // Get a random image
                const selectedImage = getRandomImage();
                // Set the background image of the ::before pseudo-element
                label.style.setProperty('--bg-image', `url(${selectedImage})`);
                // Apply line-through style
                span.style.textDecoration = 'line-through';
            } else {
                // Remove the background image
                label.style.setProperty('--bg-image', '');
                // Remove line-through style
                span.style.textDecoration = 'none';
            }
            // Update Firestore with the new state
            checklistRef.doc(taskId).set({
                checked: this.checked
            });
        });
    });
}

// Call the initialization function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initChecklist);
