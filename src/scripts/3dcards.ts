const config = {
    rotationIntensity: 10, // Max rotation in degrees
    perspective: 1000, // Perspective value for 3D effect
    easing: 0.05, // Easing factor (lower = smoother)
};

// Store last interaction event (mouse or touch)
let lastInteractionEvent: MouseEvent | TouchEvent | null = null;
let items: Array<Element>;
let animationFrame: number | null = null;
let itemStates: Array<{
    currentRotateX: number;
    currentRotateY: number;
    targetRotateX: number;
    targetRotateY: number;
}>;

// Named event handler functions
function handleMouseMove(event: MouseEvent) {
    lastInteractionEvent = event;
    updateRotations(event);
}

function handleTouchMove(event: TouchEvent) {
    lastInteractionEvent = event;
    // Use the first touch point
    const touch = event.touches[0];
    if (touch) {
        updateRotations(touch);
    }
}

function handleScroll() {
    if (lastInteractionEvent) {
        // If we have a previous interaction, use it
        if (lastInteractionEvent instanceof MouseEvent) {
            updateRotations(lastInteractionEvent);
        } else if (
            lastInteractionEvent instanceof TouchEvent &&
            lastInteractionEvent.touches[0]
        ) {
            updateRotations(lastInteractionEvent.touches[0]);
        }
    } else {
        // Fallback: use viewport center for mobile devices
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;

        // Create a synthetic event-like object with clientX and clientY
        const syntheticEvent = {
            clientX: viewportCenterX,
            clientY: viewportCenterY,
        };

        updateRotations(syntheticEvent as MouseEvent);
    }
}

function handleMouseLeave() {
    itemStates.forEach((state) => {
        state.targetRotateX = 0;
        state.targetRotateY = 0;
    });
}

function handleTouchEnd() {
    itemStates.forEach((state) => {
        state.targetRotateX = 0;
        state.targetRotateY = 0;
    });
}

// Function to update rotations based on interaction position and scroll
function updateRotations(event: MouseEvent | Touch) {
    // Get the viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get scroll position
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Calculate absolute interaction position including scroll
    const absoluteX = event.clientX + scrollX;
    const absoluteY = event.clientY + scrollY;

    // Update target rotation for each item
    items.forEach((item, index) => {
        // Get item's position within viewport
        const itemRect = item.getBoundingClientRect();
        const itemCenterX = itemRect.left + itemRect.width / 2 + scrollX;
        const itemCenterY = itemRect.top + itemRect.height / 2 + scrollY;

        // Calculate distance from cursor to item center
        const dx = absoluteX - itemCenterX;
        const dy = absoluteY - itemCenterY;

        // Set rotation targets (invert Y for natural feeling)
        itemStates[index].targetRotateY =
            (dx / viewportWidth) * config.rotationIntensity;
        itemStates[index].targetRotateX =
            (-dy / viewportHeight) * config.rotationIntensity;
    });
}

// Animation loop for smooth transitions
function animate() {
    items.forEach((item, index) => {
        const state = itemStates[index];

        // Apply easing
        const newX =
            state.currentRotateX +
            (state.targetRotateX - state.currentRotateX) * config.easing;
        const newY =
            state.currentRotateY +
            (state.targetRotateY - state.currentRotateY) * config.easing;

        // Apply rotation
        if (Math.abs(newX - state.currentRotateX) > 0.01) {
            state.currentRotateX = newX;
        }
        if (Math.abs(newY - state.currentRotateY) > 0.01) {
            state.currentRotateY = newY;
        }
        (
            item as HTMLElement
        ).style.transform = `perspective(${config.perspective}px) rotateX(${state.currentRotateX}deg) rotateY(${state.currentRotateY}deg)`;
    });

    animationFrame = requestAnimationFrame(animate);
}

function initRotate() {
    items = Array.from(document.querySelectorAll("[data-module='3dcard']"));
    if (!items.length) return;

    // Initialize item states
    itemStates = Array.from(items).map(() => ({
        currentRotateX: 0,
        currentRotateY: 0,
        targetRotateX: 0,
        targetRotateY: 0,
    }));

    // mouse and touch event listeners
    // use a timeout to prevent view-transition glitches
    window.setTimeout(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("touchmove", handleTouchMove, { passive: true });
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("touchend", handleTouchEnd);

        // Start animation loop
        animate();
    }, 500);

}

function cleanupRotate() {
    if (!items.length) return;

    // Remove event listeners
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("mouseleave", handleMouseLeave);
    document.removeEventListener("touchend", handleTouchEnd);

    // reset transform to prevent view-transition glitches
    items.forEach(elem => {
        (elem as HTMLElement).style.transform = `translateZ(0)`;
    });

    items = [];
    itemStates = [];
    lastInteractionEvent = null;

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
}

// Initialize on page load and cleanup on page change
document.addEventListener("astro:page-load", initRotate);
document.addEventListener("astro:before-preparation", cleanupRotate);
