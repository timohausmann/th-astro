import { animate, scroll } from "motion";

const filterConfig = {
    visibleValue: "visible",
    inValue: "in",
    outValue: "out",
    hiddenValue: "hidden",
};

let projectTiles: Array<HTMLElement>;
let filterInputs: Array<HTMLInputElement>;
let currentFilter: string | null = null;

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

    // Apply initial filter (first checked input or "all")
    const checkedInput = filterInputs.find((input) => input.checked);
    if (checkedInput) {
        currentFilter = checkedInput.id;
        applyFilter(currentFilter);
    } else {
        // If no filter is checked, show all projects
        showAllProjects();
    }
}

// Handle filter radio button change
function handleFilterChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
        currentFilter = target.id;
        applyFilter(currentFilter);
    }
}

// Apply filter to show/hide projects
function applyFilter(filterId: string) {
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
    tile.setAttribute("data-visibility", filterConfig.inValue);
    const preview = tile.querySelector(".link") as HTMLElement;
    if (preview) {
        animate(
            preview,
            {
                opacity: 1,
                transform: "perspective(1000px) scale(1) rotateX(0deg)",
            },
            { type: "spring", stiffness: 200 }
        ).then(() => {
            tile.setAttribute("data-visibility", filterConfig.visibleValue);
        });
    }
}

function hideProject(tile: HTMLElement) {
    // Set visibility to hidden
    tile.setAttribute("data-visibility", filterConfig.outValue);
    const preview = tile.querySelector(".link") as HTMLElement;
    if (preview) {
        animate(
            preview,
            {
                transform: "perspective(1000px) scale(0.9) rotateX(7.5deg)",
                opacity: 0,
            },
            { duration: 0.3, ease: "circOut" }
        ).then(() => {
            tile.setAttribute("data-visibility", filterConfig.hiddenValue);
        });
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

    // Reset all projects to visible state
    projectTiles.forEach((tile) => {
        tile.removeAttribute("data-visibility");
    });

    // Reset variables
    projectTiles = [];
    filterInputs = [];
    currentFilter = null;
}

// Initialize on page load and cleanup on page change
document.addEventListener("astro:page-load", initProjectFilter);
document.addEventListener("astro:before-preparation", cleanupProjectFilter);
