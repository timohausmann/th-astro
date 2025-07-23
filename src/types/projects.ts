export type ProjectCategory =
    | "spotlight"
    | "solutions"
    | "arts & culture"
    | "datavis"
    | "experimental"
    | "open source";

export const projectCategories: ProjectCategory[] = [
    "spotlight",
    "solutions",
    "arts & culture",
    "datavis",
    "experimental",
    "open source",
];

/**
 * Represents a single project in the showcase
 */
export interface Project {
    id: number;
    slug: string;
    title: string;
    suptitle: string;
    img: string;
    alt: string;
    tech: string[];
    roles: string[];
    categories: ProjectCategory[];
    href?: string;
    description?: string;
    layout?: "tall" | "wide";
    year?: number;
    partner?: {
        logo: string;
        name: string;
        href: string;
        title?: string;
    };
}
