import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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
    'images/warden.jpg',
    // New images you've added
    'images/wither_skeleton_skull.png',
    'images/yellow_bed.png',
    'images/zombie_head.png',
    'images/water_bucket.png',
    'images/weeping_vines.png',
    'images/tropical_fish.png',
    'images/trident.png',
    'images/spyglass.png',
    'images/totem_of_undying.png',
    'images/tnt.png',
    'images/waxed_cut_copper.png',
    'images/target.png',
    'images/slime_block.png',
    'images/string.png',
    'images/spawner.png',
    'images/red_mushroom.png',
    'images/porkchop.png',
    'images/recovery_compass.png',
    'images/ominous_trial_key.png',
    'images/netherite_ingot.png',
    'images/nether_star.png',
    'images/music_disc_pigstep.png',
    'images/netherite_upgrade_smithing_template.png',
    'images/mace.png',
    'images/magenta_concrete_powder.png',
    'images/magma_cream.png',
    'images/feather.png',
    'images/hay_block.png',
    'images/glass.png',
    'images/deepslate_emerald_ore.png',
    'images/cobweb.png',
    'images/carved_pumpkin.png',
    'images/axolotl_bucket.png',
    'images/beacon.png',
    'images/ancient_debris.png',
    'images/blue_orchid.png',
    'images/bookshelf.png'
];


// Copy of images array to track unused images for checklist
let unusedImages = [...images];

// Function to get a random image for the checklist
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

// Function to get a random image for the moving animation
function getRandomImageForAnimation() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
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

// Function to initialize moving images
function initMovingImages() {
    const movingImagesContainer = document.querySelector('.moving-images');
    const containerHeight = movingImagesContainer.offsetHeight;

    // Function to create a moving image
function createMovingImage() {
    const img = document.createElement('img');
    img.src = getRandomImageForAnimation();
    img.style.position = 'absolute';

    img.style.width = '60px'; // Adjust size as needed
    img.style.height = 'auto'; // Maintain aspect ratio

    img.style.left = '-60px'; // Start off-screen to the left

    // Wait until the image has loaded to get its height
    img.onload = () => {
        const imgHeight = img.height;
        const containerHeight = movingImagesContainer.offsetHeight;
        const maxTop = containerHeight - imgHeight;

        // Ensure maxTop is not negative
        const validMaxTop = Math.max(0, maxTop);

        const topPosition = Math.random() * validMaxTop;
        img.style.top = `${topPosition}px`;
    };

    const duration = 17 + Math.random() * 13; // Duration between 17 and 30 seconds
    const delay = Math.random() * 5; // Delay between 0 and 5 seconds

    img.style.animationDuration = `${duration}s`;
    img.style.animationDelay = `${delay}s`;

    // Remove the image when the animation ends
    const removeImage = () => img.remove();
    img.addEventListener('animationend', removeImage);
    img.addEventListener('webkitAnimationEnd', removeImage);

    movingImagesContainer.appendChild(img);
}

    // Create images at intervals
    setInterval(createMovingImage, 4000); // Reduced interval to 4 seconds

}

// Initialize both checklist and moving images when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initChecklist();
    initMovingImages();
});
