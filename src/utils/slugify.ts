/**
 * Slugify a string
 * @param str - The string to slugify
 * @returns The slugified string
 * @see https://dev.to/bybydev/how-to-slugify-a-string-in-javascript-4o9n
 */
export function slugify(str: string) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
    str = str.toLowerCase(); // convert string to lowercase
    str = str
        .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
        .replace(/\s+/g, "-") // replace spaces with hyphens
        .replace(/-+/g, "-"); // remove consecutive hyphens
    return str;
}
