/**
 * Represents a single project in the showcase
 */
export interface Project {
    /** Unique identifier for the project */
    id: number;
    /** Main title of the project */
    title: string;
    /** Subtitle or category of the project */
    suptitle: string;
    /** Filename of the project's image in the assets directory */
    img: string;
    /** Alt text for the project's image */
    alt: string;
    /** Array of technologies used in the project */
    tech: string[];
    /** Array of roles performed in the project */
    roles: string[];
    /** Full URL to the project */
    link?: string;
    /** Detailed project description */
    description?: string;
    /** Array of technologies used in the project (alternative name) */
    technologies?: string[];
}
