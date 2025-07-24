import {
    animate,
    scroll,
    type AnimationPlaybackControlsWithThen,
} from "motion";
import { getState, setState, subscribe } from "./projectStore";
import type { ProjectCategory } from "../types/projects";

// TODO: when tiles fade in and others fade out, there can be a timing mismatch

const filterConfig = {
    visibleValue: "visible",
    inValue: "in",
    outValue: "out",
    hiddenValue: "hidden",
};

let projectTiles: Array<HTMLElement>;
let filterInputs: Array<HTMLInputElement>;
let unsubscribe: (() => void) | null = null;
let currentFilterId: string | null = null; // Track current filter state
const tileAnimations = new WeakMap<
    HTMLElement,
    AnimationPlaybackControlsWithThen
>();

// Initialize filtering functionality
function initProjectFilter() {
    // Get all project tiles and filter inputs
    projectTiles = Array.from(
        document.querySelectorAll("[data-module*='project-filter']")
    );
    filterInputs = Array.from(
        document.querySelectorAll('input[name="project-filter"]')
    );

    if (!projectTiles.length || !filterInputs.length) return;

    // Set up event listeners for filter changes
    filterInputs.forEach((input) => {
        input.addEventListener("change", handleFilterChange);
    });

    // Subscribe to store changes for reactive updates
    unsubscribe = subscribe((state) => {
        // Apply filter whenever the store's currentFilter changes
        if (state.currentFilter) {
            applyFilter(state.currentFilter);
        } else {
            showAllProjects();
        }
    });

    // Apply initial filter from store
    const { currentFilter } = getState();
    if (currentFilter) {
        applyFilter(currentFilter);
    } else {
        showAllProjects();
    }
}

// Handle filter radio button change
function handleFilterChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
        const filterId = target.id;
        // Use setState to update the currentFilter
        setState({ currentFilter: filterId as ProjectCategory });
        // Note: We don't need to call applyFilter here anymore
        // because the subscribe callback will handle it reactively
    }
}

// Apply filter to show/hide projects
function applyFilter(filterId: string) {
    currentFilterId = filterId; // Update current filter state
    projectTiles.forEach((tile) => {
        const categories = tile.getAttribute("data-categories");
        const shouldShow = shouldShowProject(categories, filterId);

        if (shouldShow) {
            showProject(tile);
        } else {
            hideProject(tile);
        }
    });
}

// Determine if a project should be shown based on filter
function shouldShowProject(
    categories: string | null,
    filterId: string
): boolean {
    if (!categories) return true;

    // If filter is "all", show everything
    if (filterId === "all") {
        return true;
    }

    // Check if project has the selected category
    const categoryList = categories.split(",");
    return categoryList.includes(filterId);
}

// Show a project tile
function showProject(tile: HTMLElement) {
    // Set visibility to visible
    if (tile.getAttribute("data-visibility") === filterConfig.hiddenValue) {
        tile.setAttribute("data-visibility", filterConfig.inValue);
    }
    if (tileAnimations.has(tile)) {
        console.log("cancelling animation");
        tileAnimations.get(tile)?.cancel();
    }
    const preview = tile.querySelector(".link") as HTMLElement;
    if (preview) {
        // Capture the filter state when animation starts
        const animationFilterId = currentFilterId;

        const animation = animate(
            preview,
            {
                opacity: [0, 1],
                transform: [
                    "perspective(1000px) scale(0.9) rotateX(7.5deg)",
                    "perspective(1000px) scale(1) rotateX(0deg)",
                ],
            },
            { type: "spring", stiffness: 200 }
        );

        animation.then(() => {
            console.log("animation complete");
            // Only set to visible if the filter hasn't changed during animation
            if (currentFilterId === animationFilterId) {
                tile.setAttribute("data-visibility", filterConfig.visibleValue);
            }
        });

        tileAnimations.set(tile, animation);
    }
}

function hideProject(tile: HTMLElement) {
    // Set visibility to hidden
    if (tile.getAttribute("data-visibility") === filterConfig.visibleValue) {
        tile.setAttribute("data-visibility", filterConfig.outValue);
    }
    const preview = tile.querySelector(".link") as HTMLElement;
    if (preview) {
        /*animate(
            preview,
            {
                opacity: [1, 0],
                transform: [
                    "perspective(1000px) scale(1) rotateX(0deg)",
                    "perspective(1000px) scale(0.9) rotateX(7.5deg)",
                ],
            },
            { duration: 0.3, ease: "circOut" }
        ).then(() => {
            tile.setAttribute("data-visibility", filterConfig.hiddenValue);
        });*/
        tile.setAttribute("data-visibility", filterConfig.hiddenValue);
    }
}

// Show all projects (used for "all" filter)
function showAllProjects() {
    projectTiles.forEach((tile) => {
        showProject(tile);
    });
}

// Clean up event listeners and reset state
function cleanupProjectFilter() {
    if (!filterInputs.length) return;

    // Remove event listeners
    filterInputs.forEach((input) => {
        input.removeEventListener("change", handleFilterChange);
    });

    // Unsubscribe from store changes
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }

    // Reset variables
    projectTiles = [];
    filterInputs = [];
}

// Initialize on page load and cleanup on page change
document.addEventListener("astro:page-load", initProjectFilter);
document.addEventListener("astro:before-preparation", cleanupProjectFilter);
