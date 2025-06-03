let activeProject: string | null = null;

export function toggleProject(slug: string) {
    const toggle = () => {
        activeProject = activeProject === slug ? null : slug;
        const projects = document.querySelectorAll(".projects .item");

        projects.forEach((p) => {
            const project = p as HTMLElement;
            if (activeProject === null) {
                project.classList.remove("is-open", "is-closed");
            } else {
                if (project.dataset.slug === slug) {
                    project.classList.add("is-open");
                } else {
                    project.classList.add("is-closed");
                }
            }

            if (project.dataset.slug === slug) {
                window.setTimeout(() => {
                    project.scrollIntoView({ behavior: "smooth" });
                }, 500);
            }
        });
    };

    if ("startViewTransition" in document) {
        document.startViewTransition(() => {
            toggle();
        });
    } else {
        toggle();
    }
}

export function closeProject() {
    if (activeProject) {
        toggleProject(activeProject);
    }
}
