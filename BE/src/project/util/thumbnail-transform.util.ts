export const toPublicUrl = (key: string | null | undefined) => {
  if (!key) return null;
  if (key.startsWith('http://') || key.startsWith('https://')) return key;
  return `${process.env.NCP_OBJECT_STORAGE_ENDPOINT}/${process.env.NCP_OBJECT_STORAGE_BUCKET}/${key}`;
};
