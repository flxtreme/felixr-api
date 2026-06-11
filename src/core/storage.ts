import { getSupabaseClient } from "./supabase";

// ─── Bucket Names ────────────────────────────────────────────────────────────
export const BUCKETS = {
  CONTENT: "post-content",  // stores content.md files
  MEDIA: "post-media",      // stores images and other media
  FILES: "post-files",      // stores other misc files
} as const;

type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

// ─── Upload ──────────────────────────────────────────────────────────────────

/**
 * Upload a file to a Supabase storage bucket.
 *
 * @param bucket  - Target bucket (use BUCKETS.CONTENT, BUCKETS.MEDIA, etc.)
 * @param path    - Path inside the bucket e.g. "posts/my-post/content.md"
 * @param file    - File content as string, Buffer, or Blob
 * @param contentType - MIME type e.g. "text/markdown", "image/png"
 *
 * @example
 * await uploadFile(BUCKETS.CONTENT, `posts/${postId}/content.md`, markdownString, "text/markdown");
 */
export async function uploadFile(
  bucket: BucketName,
  path: string,
  file: string | Buffer | Blob,
  contentType: string
): Promise<string> {
  const supabase = getSupabaseClient();

  const body =
    typeof file === "string" ? Buffer.from(file, "utf-8") : file;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, body, {
      contentType,
      upsert: true, // overwrite if exists
    });

  if (error) throw new Error(`Upload failed [${bucket}/${path}]: ${error.message}`);

  return path;
}

// ─── Download ─────────────────────────────────────────────────────────────────

/**
 * Download a file from a bucket and return its text content.
 * Best for markdown files and JSON.
 *
 * @example
 * const markdown = await downloadText(BUCKETS.CONTENT, `posts/${postId}/content.md`);
 */
export async function downloadText(
  bucket: BucketName,
  path: string
): Promise<string> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage.from(bucket).download(path);

  if (error) throw new Error(`Download failed [${bucket}/${path}]: ${error.message}`);
  if (!data) throw new Error(`No data returned for [${bucket}/${path}]`);

  return await data.text();
}

/**
 * Download a file from a bucket and return its raw Buffer.
 * Best for images and binary files.
 *
 * @example
 * const buffer = await downloadBuffer(BUCKETS.MEDIA, `posts/${postId}/cover.png`);
 */
export async function downloadBuffer(
  bucket: BucketName,
  path: string
): Promise<Buffer> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage.from(bucket).download(path);

  if (error) throw new Error(`Download failed [${bucket}/${path}]: ${error.message}`);
  if (!data) throw new Error(`No data returned for [${bucket}/${path}]`);

  return Buffer.from(await data.arrayBuffer());
}

// ─── Get Public URL ───────────────────────────────────────────────────────────

/**
 * Get the public URL of a file. Bucket must have public access enabled.
 *
 * @example
 * const url = getPublicUrl(BUCKETS.MEDIA, `posts/${postId}/cover.png`);
 */
export function getPublicUrl(bucket: BucketName, path: string): string {
  const supabase = getSupabaseClient();

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Get a temporary signed URL for private bucket files.
 * Default expiry is 1 hour.
 *
 * @example
 * const url = await getSignedUrl(BUCKETS.FILES, `posts/${postId}/attachment.pdf`, 3600);
 */
export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresInSeconds = 3600
): Promise<string> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error) throw new Error(`Signed URL failed [${bucket}/${path}]: ${error.message}`);
  if (!data) throw new Error(`No signed URL returned for [${bucket}/${path}]`);

  return data.signedUrl;
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Delete one or more files from a bucket.
 *
 * @example
 * await deleteFiles(BUCKETS.CONTENT, [`posts/${postId}/content.md`]);
 */
export async function deleteFiles(
  bucket: BucketName,
  paths: string[]
): Promise<void> {
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage.from(bucket).remove(paths);

  if (error) throw new Error(`Delete failed [${bucket}]: ${error.message}`);
}

/**
 * Delete all files under a folder prefix (e.g. all files for a post).
 *
 * @example
 * await deleteFolder(BUCKETS.CONTENT, `posts/${postId}`);
 */
export async function deleteFolder(
  bucket: BucketName,
  folderPath: string
): Promise<void> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage.from(bucket).list(folderPath);

  if (error) throw new Error(`List failed [${bucket}/${folderPath}]: ${error.message}`);
  if (!data || data.length === 0) return;

  const paths = data.map((f) => `${folderPath}/${f.name}`);
  await deleteFiles(bucket, paths);
}

// ─── List ─────────────────────────────────────────────────────────────────────

/**
 * List all files under a folder prefix in a bucket.
 *
 * @example
 * const files = await listFiles(BUCKETS.MEDIA, `posts/${postId}`);
 */
export async function listFiles(
  bucket: BucketName,
  folderPath: string
): Promise<string[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage.from(bucket).list(folderPath);

  if (error) throw new Error(`List failed [${bucket}/${folderPath}]: ${error.message}`);

  return (data ?? []).map((f) => `${folderPath}/${f.name}`);
}