import { filterConfig } from "./projectFilter";
import { getState, setState, subscribe } from "./projectStore";
import { animate } from "motion";

let loadMoreButton: HTMLElement | null = null;
let projectTiles: Array<HTMLElement>;
let unsubscribe: (() => void) | null = null;

// Initialize load more functionality
function initLoadMore() {
    // Get load more button and project tiles
    loadMoreButton = document.querySelector("[data-module='load-more']");
    projectTiles = Array.from(
        document.querySelectorAll("[data-module*='project-filter']")
    );

    if (!projectTiles.length) return;

    // Set up event listener for load more button
    if (loadMoreButton) {
        loadMoreButton.addEventListener("click", handleLoadMore);
    }

    // Subscribe to store changes for reactive updates
    unsubscribe = subscribe((state) => {
        // Update visibility whenever visibleCount changes
        updateProjectVisibility(state.visibleCount);
        updateLoadMoreButton(state.visibleCount, state.projects.length);
    });

    // Apply initial visibility from store
    const { visibleCount, projects } = getState();
    updateProjectVisibility(visibleCount);
    updateLoadMoreButton(visibleCount, projects.length);
}

// Handle load more button click
function handleLoadMore() {
    const { visibleCount, projects } = getState();
    const newVisibleCount = Math.min(visibleCount + 6, projects.length);
    setState({ visibleCount: newVisibleCount });
}

// Update project visibility based on visible count
function updateProjectVisibility(visibleCount: number) {
    projectTiles.forEach((tile, index) => {
        if (index < visibleCount) {
            const offset = index % 6;
            if (
                tile.getAttribute("data-visibility") ===
                filterConfig.visibleValue
            ) {
                return;
            }
            if (
                tile.getAttribute("data-visibility") ===
                filterConfig.hiddenValue
            ) {
                tile.setAttribute("data-visibility", filterConfig.inValue);
            }
            // Show the tile
            const preview = tile.querySelector(".link") as HTMLElement;
            if (preview) {
                animate(
                    preview,
                    {
                        opacity: [0, 1],
                        transform: [
                            "perspective(1000px) scale(0.9) rotateX(7.5deg)",
                            "perspective(1000px) scale(1) rotateX(0deg)",
                        ],
                    },
                    { type: "spring", stiffness: 200, delay: 0.1 * offset }
                ).then(() => {
                    tile.setAttribute(
                        "data-visibility",
                        filterConfig.visibleValue
                    );
                });
            }
        } else {
            // Hide the tile
            tile.setAttribute("data-visibility", "hidden");
        }
    });
}

// Update load more button visibility and text
function updateLoadMoreButton(visibleCount: number, totalProjects: number) {
    if (!loadMoreButton) return;

    if (visibleCount >= totalProjects) {
        // Hide button when all projects are shown
        loadMoreButton.style.display = "none";
    } else {
        // Show button and update text
        loadMoreButton.style.display = "block";
    }
}

// Clean up event listeners and reset state
function cleanupLoadMore() {
    if (loadMoreButton) {
        loadMoreButton.removeEventListener("click", handleLoadMore);
    }

    // Unsubscribe from store changes
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }

    // Reset variables
    loadMoreButton = null;
    projectTiles = [];
}

// Initialize on page load and cleanup on page change
document.addEventListener("astro:page-load", initLoadMore);
document.addEventListener("astro:before-preparation", cleanupLoadMore);
