import slugify from "slugify";

export function titleSlug(title: string): string {
  return slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g });
}
