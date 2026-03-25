import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

let cachedUploadDir: string | null = null;

export function resolveUploadImageDir() {
  if (cachedUploadDir) {
    return cachedUploadDir;
  }

  const candidates = [
    process.env.IMAGE_UPLOAD_DIR,
    '/tmp/image',
    join(process.cwd(), 'src', 'image'),
    join(process.cwd(), 'tmp', 'image'),
  ].filter((dir): dir is string => Boolean(dir));

  for (const dir of candidates) {
    try {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      cachedUploadDir = dir;
      return cachedUploadDir;
    }
    catch {
      // Try next candidate when the current path is not writable.
    }
  }

  throw new Error('No writable upload directory available');
}
