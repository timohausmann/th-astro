import { createStore } from "zustand/vanilla";
import type { Project, ProjectCategory } from "../types/projects";
import { getProjects } from "./getProjects";

interface ProjectStore {
    projects: Project[];
    currentFilter: ProjectCategory;
    visibleCount: number;
}

export const projectStore = createStore<ProjectStore>((set) => ({
    projects: getProjects(),
    currentFilter: "all",
    visibleCount: 6,
}));

// Export store methods for easy access
export const { getState, setState, subscribe } = projectStore;
