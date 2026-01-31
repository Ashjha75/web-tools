// Utility to resolve public assets.
// By default this returns URLs pointing to the raw GitHub content for the
// repository commit specified below so the same URL works in local dev,
// preview builds and when served from GitHub.
// Usage: import { asset } from '@/lib/asset';
// <img src={asset('logo.svg')} />

// Replace this with a newer commit/hash if you update files in `public/`.
const RAW_BASE =
  'https://raw.githubusercontent.com/Ashjha75/web-tools/5725189647f79a435b911b24879c0eaa9cb9fa7e/public';

export function asset(name) {
  if (!name) return '';
  const clean = name.replace(/^\//, '');
  return `${RAW_BASE}/${clean}`;
}
