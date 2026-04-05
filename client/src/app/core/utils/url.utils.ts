const LOCAL_API_ORIGINS = ['https://localhost:5187', 'http://localhost:5187'];

export function normalizeAssetUrl(url: string | null | undefined): string {
  if (!url) {
    return '';
  }

  const trimmedUrl = url.trim();

  for (const origin of LOCAL_API_ORIGINS) {
    if (trimmedUrl.startsWith(origin)) {
      return ensureRootPath(trimmedUrl.slice(origin.length));
    }
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return ensureRootPath(trimmedUrl);
}

function ensureRootPath(path: string): string {
  return `/${path.replace(/^\/+/, '')}`;
}
