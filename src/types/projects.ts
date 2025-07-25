export type ProjectCategory =
    | "all"
    | "spotlight"
    | "solutions"
    | "arts & culture"
    | "data vis"
    | "studies";

export const projectCategories: ProjectCategory[] = [
    "all",
    "spotlight",
    "solutions",
    "arts & culture",
    "data vis",
    "studies",
];

export type ProjectRole =
    | "Konzept"
    | "Design"
    | "Programmierung"
    | "Projektmanagement";

export const projectRoles: ProjectRole[] = [
    "Konzept",
    "Design",
    "Programmierung",
    "Projektmanagement",
];

export type ProjectTileVisibility = "visible" | "hidden" | "in" | "out";

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
    roles: ProjectRole[];
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
