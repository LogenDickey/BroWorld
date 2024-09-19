// Array of image URLs
const images = [
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/1/17/Grass_Block_%28graphics_fast%29_JE3.png/revision/latest?cb=20200831093828',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/f/f6/Ender_Pearl_JE3_BE2.png/revision/latest/thumbnail/width/360/height/360?cb=20200512195721',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/ab/Diamond_JE3_BE3.png/revision/latest/thumbnail/width/360/height/360?cb=20230924193138',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/5/5e/Cow_JE5_BE2.png/revision/latest?cb=20240729214026',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/2/28/Enderman.png/revision/latest?cb=20240729214332',
    'https://static.wikia.nocookie.net/minecraft_gamepedia/images/8/88/Hanging_Lantern_JE1_BE1.png/revision/latest?cb=20200207163022'
];

// Copy of images array to track unused images
let unusedImages = [...images];

document.querySelectorAll('.checklist input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const imgElement = this.parentElement.querySelector('.item-image');
        if (this.checked) {
            // If all images have been used, reset the unusedImages array
            if (unusedImages.length === 0) {
                unusedImages = [...images];
            }
            // Select a random image and remove it from unusedImages
            const randomIndex = Math.floor(Math.random() * unusedImages.length);
            const selectedImage = unusedImages.splice(randomIndex, 1)[0];
            imgElement.src = selectedImage;
        } else {
            // If unchecked, remove the image and add it back to unusedImages
            if (imgElement.src) {
                unusedImages.push(imgElement.src);
            }
            imgElement.src = '';
        }
    });
});
