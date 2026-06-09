export const toSlug = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove invalid chars
    .replace(/[\s_]+/g, '-')         // spaces/underscores to hyphens
    .replace(/-+/g, '-')             // collapse consecutive hyphens
    .replace(/^-|-$/g, '');          // strip leading/trailing hyphens
};

export default toSlug;