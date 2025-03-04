const chairElement = document.getElementById('chair');
const chairImage = document.getElementById('chair-image');
const thumbnails = document.querySelectorAll('.thumbnail');
const thumbnailContainer = document.querySelector('.thumbnail-container');
const scene1 = document.getElementById('scene1');
const scene2 = document.getElementById('scene2');

// Track if we're hovering over any thumbnail
let isHoveringThumbnail = false;

// Add this at the top with other variable declarations
const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
let selectedThumbnail = null;

// Create the confirm button element and add it to the body
const confirmButton = document.createElement('button');
confirmButton.className = 'mobile-confirm-button';
confirmButton.textContent = 'Vote Now!';
document.body.appendChild(confirmButton);

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
        e.preventDefault();
        
        // Store the selected thumbnail
        selectedThumbnail = thumbnail;
        
        // Get the chair image source
        const chairSrc = thumbnail.getAttribute('data-chair');
        chairImage.src = chairSrc;
        
        // Reset any existing classes
        chairElement.classList.remove('hidden', 'visible-click', 'visible-hover');
        void chairElement.offsetWidth; // Force reflow
        chairElement.classList.add('mobile-preview');
        
        // Clear any existing blur on thumbnails first
        thumbnails.forEach(thumb => {
            thumb.classList.remove('dimmed');
            thumb.style.filter = 'none';
            thumb.style.webkitFilter = 'none';
        });
        
        // Then dim other thumbnails
        thumbnails.forEach(thumb => {
            if (thumb !== thumbnail) {
                thumb.classList.add('dimmed');
            }
        });
        
        // Don't move the thumbnail bar
        // thumbnailBar.classList.add('with-confirm-button');
        
        // Show the confirm button
        confirmButton.classList.remove('visible');
        void confirmButton.offsetWidth; // Force reflow
        confirmButton.classList.add('visible');
    });

    // For long press/touch - keep visible and prevent scrolling
    thumbnail.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    // When touch ends, do nothing (handled by touchstart)
    thumbnail.addEventListener('touchend', function(e) {
        // Prevent default to avoid any conflicts
        e.preventDefault();
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
        thumbnailContainer.classList.add('hidden');
        
        // Get the chair position for sparkle center
        const chairRect = chairImage.getBoundingClientRect();
        const centerX = chairRect.left + chairRect.width / 2;
        const centerY = chairRect.top + chairRect.height / 2;
        
        // Create sparkles around the chair
        createSparkles(centerX, centerY);
        
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
                opacity: 0.8 !important; /* Higher opacity on mobile */
                visibility: visible !important;
            }
            
            .thumbnail {
                -webkit-tap-highlight-color: rgba(0,0,0,0); /* Remove highlight on tap */
            }
            
            /* Add a slight delay to the chair transition for mobile */
            .chair {
                transition: opacity 0.4s ease-out, visibility 0s, filter 0.4s ease-out;
            }
        }
    </style>
`);

// Add click handler for the confirm button
confirmButton.addEventListener('click', function() {
    if (!selectedThumbnail) return;
    
    // Hide the confirm button immediately
    confirmButton.classList.remove('visible');
    
    // Get the chair source from the selected thumbnail
    const chairSrc = selectedThumbnail.getAttribute('data-chair');
    
    // Get the chair position for sparkle center
    const chairRect = chairImage.getBoundingClientRect();
    const centerX = chairRect.left + chairRect.width / 2;
    const centerY = chairRect.top + chairRect.height / 2;
    
    // Create sparkles around the chair
    createSparkles(centerX, centerY);
    
    // Hide thumbnail bar
    thumbnailContainer.classList.add('hidden');
    // thumbnailBar.classList.remove('with-confirm-button'); // Not needed anymore
    
    // Clear any blur effects on thumbnails
    thumbnails.forEach(thumb => {
        thumb.classList.remove('dimmed');
        thumb.style.filter = 'none';
        thumb.style.webkitFilter = 'none';
        thumb.style.pointerEvents = 'none';
    });
    
    // Show chair with bounce effect
    chairElement.classList.remove('mobile-preview');
    chairElement.classList.add('visible-click', 'bounce');
    
    // After bounce animation
    setTimeout(() => {
        // Prepare scene2
        scene2.style.display = 'block';
        
        // Fade out chair
        chairElement.style.opacity = '0';
        
        // Show scene 2
        setTimeout(() => {
            scene2.classList.add('active');
        }, 30);
        
    }, 1000);
});

// Update the HTML file to include the confirm button
document.addEventListener('DOMContentLoaded', function() {
    // Only show the confirm button on mobile
    if (isMobile) {
        confirmButton.style.display = 'block';
    } else {
        confirmButton.style.display = 'none';
    }
});

// Add a way to cancel the selection on mobile
document.addEventListener('click', function(e) {
    // If clicking outside thumbnails and confirm button, reset the view
    if (e.target.closest('.thumbnail') || e.target.closest('.mobile-confirm-button')) {
        return;
    }
    
    // Reset the view
    if (selectedThumbnail) {
        selectedThumbnail = null;
        confirmButton.classList.remove('visible');
        thumbnailContainer.classList.remove('with-confirm-button');
        chairElement.classList.remove('mobile-preview');
        thumbnails.forEach(thumb => {
            thumb.classList.remove('dimmed');
        });
    }
});

// More expansive sparkle explosion effect
function createSparkles(centerX, centerY) {
    const sparkleContainer = document.getElementById('sparkle-container');
    
    // Clear any existing sparkles
    sparkleContainer.innerHTML = '';
    
    // Add a flash effect
    const flash = document.createElement('div');
    flash.className = 'flash';
    sparkleContainer.appendChild(flash);
    
    // Add central glow effect - make it bigger
    const centralGlow = document.createElement('div');
    centralGlow.className = 'central-glow';
    centralGlow.style.left = centerX + 'px';
    centralGlow.style.top = centerY + 'px';
    sparkleContainer.appendChild(centralGlow);
    
    // Sparkle image paths
    const sparkleImages = [
        'assets/sparkle1.webp',
        'assets/sparkle2.webp',
        'assets/sparkle3.webp'
    ];
    
    // Create more sparkles for a bigger explosion
    const sparkleCount = 80; // Increased from 50
    const sizes = ['small', 'medium', 'large'];
    
    // Create all sparkles at once
    const fragment = document.createDocumentFragment();
    
    // Create sparkles with wider distribution
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('img');
        sparkle.className = `sparkle-img ${sizes[Math.floor(Math.random() * sizes.length)]}`;
        
        // Select a random sparkle image
        sparkle.src = sparkleImages[Math.floor(Math.random() * sparkleImages.length)];
        
        // More concentrated at center for initial explosion
        const initialDistance = Math.random() < 0.8 ? 
            Math.random() * 20 : // 80% very close to center
            20 + Math.random() * 50; // 20% slightly further out
            
        const angle = Math.random() * Math.PI * 2;
        const x = centerX + Math.cos(angle) * initialDistance;
        const y = centerY + Math.sin(angle) * initialDistance;
        
        // Much longer travel distances for more expansive effect
        const randomAngle = angle + (Math.random() - 0.5) * 0.5; // Less deviation for more outward explosion
        const distance = 300 + Math.random() * 600; // Much longer distances
        const tx = Math.cos(randomAngle) * distance + 'px';
        const ty = Math.sin(randomAngle) * distance + 'px';
        
        sparkle.style.setProperty('--tx', tx);
        sparkle.style.setProperty('--ty', ty);
        
        // Reduced rotation - much more subtle now
        sparkle.style.setProperty('--rotate', (Math.random() * 30) + 'deg'); // Reduced from 180
        sparkle.style.setProperty('--final-rotate', (Math.random() * 60 - 30) + 'deg'); // Reduced from 360
        
        // Set position
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        // Faster animation for more explosive feel
        const duration = 0.6 + Math.random() * 0.8;
        sparkle.style.animationDuration = duration + 's';
        
        // Minimal delay for more synchronized explosion
        sparkle.style.animationDelay = (Math.random() * 0.1) + 's';
        
        fragment.appendChild(sparkle);
    }
    
    // Add all sparkles at once
    sparkleContainer.appendChild(fragment);
    
    // Add a second wave with wider spread
    setTimeout(() => {
        const secondFragment = document.createDocumentFragment();
        
        for (let i = 0; i < 40; i++) { // More sparkles in second wave
            const sparkle = document.createElement('img');
            sparkle.className = `sparkle-img ${sizes[Math.floor(Math.random() * sizes.length)]}`;
            sparkle.src = sparkleImages[Math.floor(Math.random() * sparkleImages.length)];
            
            // Start from slightly further out
            const initialDistance = 30 + Math.random() * 80;
            const angle = Math.random() * Math.PI * 2;
            const x = centerX + Math.cos(angle) * initialDistance;
            const y = centerY + Math.sin(angle) * initialDistance;
            
            // Even longer distances for second wave
            const randomAngle = Math.random() * Math.PI * 2;
            const distance = 400 + Math.random() * 600;
            const tx = Math.cos(randomAngle) * distance + 'px';
            const ty = Math.sin(randomAngle) * distance + 'px';
            
            sparkle.style.setProperty('--tx', tx);
            sparkle.style.setProperty('--ty', ty);
            sparkle.style.setProperty('--rotate', (Math.random() * 30) + 'deg'); // Reduced from 180
            sparkle.style.setProperty('--final-rotate', (Math.random() * 60 - 30) + 'deg'); // Reduced from 360
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            // Longer animation duration for second wave
            const duration = 0.8 + Math.random() * 1;
            sparkle.style.animationDuration = duration + 's';
            
            secondFragment.appendChild(sparkle);
        }
        
        sparkleContainer.appendChild(secondFragment);
    }, 50);
    
    // Add a third wave for even more expansion
    setTimeout(() => {
        const thirdFragment = document.createDocumentFragment();
        
        for (let i = 0; i < 30; i++) {
            const sparkle = document.createElement('img');
            sparkle.className = `sparkle-img ${Math.random() > 0.5 ? 'small' : 'medium'}`;
            sparkle.src = sparkleImages[Math.floor(Math.random() * sparkleImages.length)];
            
            // Start from medium distance
            const initialDistance = 50 + Math.random() * 100;
            const angle = Math.random() * Math.PI * 2;
            const x = centerX + Math.cos(angle) * initialDistance;
            const y = centerY + Math.sin(angle) * initialDistance;
            
            // Extreme distances for third wave
            const randomAngle = Math.random() * Math.PI * 2;
            const distance = 500 + Math.random() * 700;
            const tx = Math.cos(randomAngle) * distance + 'px';
            const ty = Math.sin(randomAngle) * distance + 'px';
            
            sparkle.style.setProperty('--tx', tx);
            sparkle.style.setProperty('--ty', ty);
            sparkle.style.setProperty('--rotate', (Math.random() * 30) + 'deg'); // Reduced from 180
            sparkle.style.setProperty('--final-rotate', (Math.random() * 60 - 30) + 'deg'); // Reduced from 360
            
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            // Even longer animation for third wave
            const duration = 1 + Math.random() * 1.2;
            sparkle.style.animationDuration = duration + 's';
            
            thirdFragment.appendChild(sparkle);
        }
        
        sparkleContainer.appendChild(thirdFragment);
    }, 150);
}

// Add this function to detect the platform and show the appropriate store link
function setupAppStoreLinks() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    const iosLink = document.getElementById('ios-link');
    const androidLink = document.getElementById('android-link');
    
    if (isAndroid) {
        // Show Android link, hide iOS link
        iosLink.style.display = 'none';
        androidLink.style.display = 'flex';
        console.log('Android device detected, showing Google Play Store link');
    } else if (isIOS) {
        // Show iOS link (already default)
        iosLink.style.display = 'flex';
        androidLink.style.display = 'none';
        console.log('iOS device detected, showing App Store link');
    } else {
        // For desktop or unknown devices, show iOS link by default
        iosLink.style.display = 'flex';
        androidLink.style.display = 'none';
        console.log('Desktop or unknown device detected, showing App Store link by default');
    }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', setupAppStoreLinks);