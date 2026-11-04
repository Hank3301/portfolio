// Shared fallback image for project cards
// File in public/media/cards/: code-fallback.jpg
export const PROJECT_FALLBACK_IMAGE = '/media/cards/code-fallback.jpg' as const;

// Pre-defined object positions to vary the framing per project
const OBJECT_POSITIONS = [
  'center',      // default
  'center top',  // show more top
  'center bottom', // show more bottom
  'left center',   // show more left
  'right center',  // show more right
  'top left',
  'top right',
  'bottom left',
  'bottom right',
] as const;

export function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h;
}

export function getProjectFallbackImage(_projectId: string): string {
  return PROJECT_FALLBACK_IMAGE;
}

export function getProjectFallbackPosition(projectId: string): string {
  const index = Math.abs(hashCode(projectId)) % OBJECT_POSITIONS.length;
  return OBJECT_POSITIONS[index];
}
