const chairElement = document.getElementById('chair');
const chairImage = document.getElementById('chair-image');
const thumbnails = document.querySelectorAll('.thumbnail');
const thumbnailBar = document.querySelector('.thumbnail-bar');
const scene1 = document.getElementById('scene1');
const scene2 = document.getElementById('scene2');

// Track if we're hovering over any thumbnail
let isHoveringThumbnail = false;

// Show chair with 25% opacity on thumbnail hover (with 0.2s ease-in-out fade)
thumbnails.forEach(thumbnail => {
    // Desktop hover events
    thumbnail.addEventListener('mouseover', () => {
        isHoveringThumbnail = true;
        const chairSrc = thumbnail.getAttribute('data-chair');
        chairImage.src = chairSrc;
        chairElement.classList.remove('visible-click', 'hidden');
        chairElement.classList.add('visible-hover');
        console.log('Mouse hover - chair should be visible');
    });

    thumbnail.addEventListener('mouseout', () => {
        isHoveringThumbnail = false;
        
        setTimeout(() => {
            if (!isHoveringThumbnail) {
                chairElement.classList.remove('visible-hover');
            }
        }, 50);
    });

    // Enhanced touch handling
    thumbnail.addEventListener('touchstart', function(e) {
        console.log('Touch start detected');
        // Don't prevent default here to allow the tap to register
        
        isHoveringThumbnail = true;
        const chairSrc = thumbnail.getAttribute('data-chair');
        
        // Force reflow before changing classes
        void chairElement.offsetWidth;
        
        // Update chair image and make visible
        chairImage.src = chairSrc;
        chairElement.classList.remove('visible-click', 'hidden');
        chairElement.classList.add('visible-hover');
        
        console.log('Chair should be visible with image:', chairSrc);
    });

    // For long press/touch - keep visible
    thumbnail.addEventListener('touchmove', function(e) {
        // Prevent scroll while touching thumbnail
        e.preventDefault();
    });

    // When touch ends, wait before hiding
    thumbnail.addEventListener('touchend', function(e) {
        console.log('Touch end detected');
        
        // Don't immediately remove visibility
        isHoveringThumbnail = false;
        
        // Add longer delay for mobile to see the chair
        setTimeout(() => {
            if (!isHoveringThumbnail) {
                console.log('Removing chair visibility after delay');
                chairElement.classList.remove('visible-hover');
            }
        }, 1000); // Longer 1-second delay for mobile
    });

    // Mouse enter (hover) event
    thumbnail.addEventListener('mouseenter', () => {
        // Dim other thumbnails but keep their animations
        thumbnails.forEach(thumb => {
            if (thumb !== thumbnail) {
                thumb.classList.add('dimmed');
                // Make sure we're not stopping animations
                if (thumb.style.animation === 'none') {
                    thumb.style.removeProperty('animation');
                }
            }
        });
    });

    // Mouse leave event
    thumbnail.addEventListener('mouseleave', () => {
        // Restore opacity of all thumbnails
        thumbnails.forEach(thumb => {
            thumb.classList.remove('dimmed');
        });
    });

    // Handle clicks for both touch and mouse
    thumbnail.addEventListener('click', () => {
        console.log('Click/tap detected - transitioning to scene 2');
        isHoveringThumbnail = false;
        chairElement.classList.remove('visible-hover');
        thumbnailBar.classList.add('hidden');
        
        // Disable only pointer events on thumbnails
        thumbnails.forEach(thumb => {
            thumb.style.pointerEvents = 'none';  // Disable interactions but keep animation
        });
        
        // Show the chair fully first
        const newChairSrc = thumbnail.getAttribute('data-chair');
        chairImage.src = newChairSrc;
        chairElement.classList.remove('hidden');
        chairElement.classList.add('visible-click', 'bounce');
        
        // After bounce animation
        setTimeout(() => {
            // Prepare scene2
            scene2.style.display = 'block';
            
            // Start fade out transition
            chairElement.style.transition = 'opacity 0.3s ease-out';
            chairElement.style.opacity = '0';
            
            // Start scene2 transition almost immediately
            setTimeout(() => {
                scene2.classList.add('active');
            }, 30);
            
        }, 1500); // Keep bounce animation timing
    });
});

// Preload images for better performance
function preloadImages() {
    thumbnails.forEach(thumbnail => {
        const imgSrc = thumbnail.getAttribute('data-chair');
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => console.log(`Image loaded: ${imgSrc}`);
        img.onerror = () => console.error(`Failed to load image: ${imgSrc}`);
    });
}

// Call this function when the page loads
window.addEventListener('load', preloadImages);

// Add these CSS fixes to help with mobile visibility
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @media (max-width: 768px) {
            .chair.visible-hover {
                opacity: 0.7 !important; /* Higher opacity on mobile */
                visibility: visible !important;
            }
            
            .thumbnail {
                -webkit-tap-highlight-color: rgba(0,0,0,0); /* Remove highlight on tap */
            }
        }
    </style>
`);