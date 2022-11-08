export function mapToStringArray(obj: any): string[] {
  let ret: string[] = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      const value = obj[p];
      ret.push(p, typeof value === 'object' ? JSON.stringify(value) : value);
    }
  }
  return ret;
}

export function trimEndSlash(url: string) {
  return url.replace(/(\/+)$/, '');
}
