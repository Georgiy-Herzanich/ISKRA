import sizeOf from 'image-size';
import { readdirSync, existsSync, readFileSync } from 'fs';
import path from 'path';

export type GalleryItem = {
  before: string; // original photo (revealed on the left)
  after: string; // animated clip when available, otherwise the restored photo
  afterIsVideo: boolean;
  ratio: number; // width / height of the before image, drives the card shape
};

// Files live flat in /public/gallery, named "<n>-before", "<n>-after" and
// optionally "<n>-animated", grouped by their leading number.
const FILE_RE = /^(\d+)-(before|after|animated)\.(jpe?g|png|webp|avif|mp4)$/i;
const DEFAULT_RATIO = 3 / 4;

function ratioOf(file: string): number {
  try {
    const { width, height } = sizeOf(readFileSync(file));
    if (width && height) return width / height;
  } catch {
    // Unreadable/unsupported file — fall back to the portrait default.
  }
  return DEFAULT_RATIO;
}

export function getGalleryItems(): GalleryItem[] {
  const dir = path.join(process.cwd(), 'public', 'gallery');
  if (!existsSync(dir)) return [];

  const groups = new Map<number, { before?: string; after?: string; animated?: string }>();
  for (const f of readdirSync(dir)) {
    const m = FILE_RE.exec(f);
    if (!m) continue;
    const n = Number(m[1]);
    const role = m[2].toLowerCase() as 'before' | 'after' | 'animated';
    const g = groups.get(n) ?? {};
    g[role] = f;
    groups.set(n, g);
  }

  const items: GalleryItem[] = [];
  for (const n of [...groups.keys()].sort((a, b) => a - b)) {
    const g = groups.get(n)!;
    if (!g.before) continue;
    const ratio = ratioOf(path.join(dir, g.before));
    if (g.animated) {
      items.push({
        before: `/gallery/${g.before}`,
        after: `/gallery/${g.animated}`,
        afterIsVideo: true,
        ratio
      });
    } else if (g.after) {
      items.push({
        before: `/gallery/${g.before}`,
        after: `/gallery/${g.after}`,
        afterIsVideo: false,
        ratio
      });
    }
  }
  return items;
}
