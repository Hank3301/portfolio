// Shared fallback images for project cards
// Files in public/media/cards/: m1-launch.webp, m2-orbit.webp, m3-base.webp, m4-walk.webp
export const PROJECT_FALLBACK_IMAGES = [
  '/media/cards/m1-launch.webp',
  '/media/cards/m2-orbit.webp',
  '/media/cards/m3-base.webp',
  '/media/cards/m4-walk.webp',
] as const;

export function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h;
}

export function getProjectFallbackImage(projectId: string): string {
  const index = Math.abs(hashCode(projectId)) % PROJECT_FALLBACK_IMAGES.length;
  return PROJECT_FALLBACK_IMAGES[index];
}