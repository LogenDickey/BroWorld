// Import Firebase modules (make sure to include these at the top)
const app = firebase.app();
const db = firebase.firestore();
// Array of image URLs// Updated array of image URLs
const images = [
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/17/Grass_Block_%28graphics_fast%29_JE3.png/revision/latest?cb=20200831093828',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/f6/Ender_Pearl_JE3_BE2.png/revision/latest/thumbnail/width/360/height/360?cb=20200512195721',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/ab/Diamond_JE3_BE3.png/revision/latest/thumbnail/width/360/height/360?cb=20230924193138',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/5e/Cow_JE5_BE2.png/revision/latest?cb=20240729214026',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/28/Enderman.png/revision/latest?cb=20240729214332',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/8/88/Hanging_Lantern_JE1_BE1.png/revision/latest?cb=20200207163022',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/2c/Chicken_JE2_BE2.png/revision/latest/scale-to-width/360?cb=20240729214013',
    'https://static.wikia.nocookie.net/minecraft/images/e/e1/Warden_glowing_soul_heart.gif/revision/latest?cb=20201209225712',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/0/0f/Netherite_Sword_JE2_BE2.png/revision/latest/scale-to-width/360?cb=20200304213920',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/13/Enchanted_Diamond_Pickaxe.gif/revision/latest?cb=20201118111642',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/68/Bedrock_JE2_BE2.png/revision/latest?cb=20200224220504'
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
