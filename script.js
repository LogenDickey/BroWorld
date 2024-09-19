// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJKgYLUWaS4JQxbL9D2eSFoD9rebsV-0w",
    authDomain: "broworld-database.firebaseapp.com",
    projectId: "broworld-database",
    storageBucket: "broworld-database.appspot.com",
    messagingSenderId: "626286532659",
    appId: "1:626286532659:web:f85ad79367d291ed152b46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
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

// Function to generate a random image
function getRandomImage() {
    // If all images have been used, reset the unusedImages array
    if (unusedImages.length === 0) {
        unusedImages = [...images];
    }
    // Select a random image and remove it from unusedImages
    const randomIndex = Math.floor(Math.random() * unusedImages.length);
    const selectedImage = unusedImages.splice(randomIndex, 1)[0];
    return selectedImage;
}

// Initialize the checklist
function initChecklist() {
    document.querySelectorAll('.checklist input[type="checkbox"]').forEach((checkbox, index) => {
        const label = checkbox.parentElement;
        const span = label.querySelector('span');
        const taskId = `task${index}`; // Unique ID for each task
        const taskDocRef = doc(db, 'checklist', taskId);

        // Real-time listener for task state
        onSnapshot(taskDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                checkbox.checked = data.checked || false;
                if (checkbox.checked) {
                    label.style.setProperty('--bg-image', `url(${getRandomImage()})`);
                    // Apply line-through style
                    span.style.textDecoration = 'line-through';
                } else {
                    label.style.setProperty('--bg-image', '');
                    // Remove line-through style
                    span.style.textDecoration = 'none';
                }
            }
        });

        // Add event listener to update Firestore on change
        checkbox.addEventListener('change', function() {
            // Update Firestore with the new state
            setDoc(taskDocRef, {
                checked: this.checked
            });
        });
    });
}
// Function to get a random image from the images array for animation
function getRandomImageForAnimation() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

// Function to initialize moving images
function initMovingImages() {
    const movingImagesContainer = document.querySelector('.moving-images');
    const containerHeight = movingImagesContainer.offsetHeight;

    // Function to create a moving image
    function createMovingImage() {
        const img = document.createElement('img');
        img.src = getRandomImageForAnimation();
        img.style.position = 'absolute';
        img.style.top = Math.random() * (containerHeight - 50) + 'px'; // Random vertical position
        img.style.left = '0'; // Start at the left edge
        img.style.width = '50px'; // Adjust size as needed
        img.style.height = '50px';

        const duration = 10 + Math.random() * 5; // Duration between 10 and 15 seconds
        const delay = Math.random() * 5; // Delay between 0 and 5 seconds

        img.style.animationDuration = `${duration}s`;
        img.style.animationDelay = `${delay}s`;

        // Remove the image when the animation ends
        img.addEventListener('animationend', () => {
            img.remove();
        });

        movingImagesContainer.appendChild(img);
    }

    // Create images at intervals
    setInterval(createMovingImage, 2000); // Adjust interval as needed
}

// Modify the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    initChecklist();
    initMovingImages();
});
