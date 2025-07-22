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
