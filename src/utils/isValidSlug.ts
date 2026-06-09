export const isValidSlug = (slug: string): boolean => {
  // lowercase letters, numbers, and hyphens only; no leading/trailing/consecutive hyphens
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

export default isValidSlug;