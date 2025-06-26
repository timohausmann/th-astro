import showcase from "../data/showcase.json";
import type { Project } from "../types/projects";

export function getProjects(): Project[] {
    return (showcase as Project[]).map((project, i) => {
        project.id = i;
        return project;
    });
}