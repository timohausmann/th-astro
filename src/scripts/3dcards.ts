const config = {
    rotationIntensity: 10, // Max rotation in degrees
    perspective: 1000, // Perspective value for 3D effect
    easing: 0.05, // Easing factor (lower = smoother)
};

// Store last mouse event
let lastMouseEvent: MouseEvent | null = null;
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
    lastMouseEvent = event;
    updateRotations(event);
}

function handleScroll() {
    if (lastMouseEvent) {
        updateRotations(lastMouseEvent);
    }
}

function handleMouseLeave() {
    itemStates.forEach((state) => {
        state.targetRotateX = 0;
        state.targetRotateY = 0;
    });
}

// Function to update rotations based on mouse position and scroll
function updateRotations(event: MouseEvent) {
    // Get the viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Get scroll position
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Calculate absolute mouse position including scroll
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

    console.log("animate");
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

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Start animation loop
    animate();
}

function cleanupRotate() {
    if (!items.length) return;

    // Remove event listeners
    document.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("scroll", handleScroll);
    document.removeEventListener("mouseleave", handleMouseLeave);

    items = [];
    itemStates = [];

    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }
}

// Initialize on page load and cleanup on page change
document.addEventListener("astro:page-load", initRotate);
document.addEventListener("astro:before-preparation", cleanupRotate);
