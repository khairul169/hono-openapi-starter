import { randomUUIDv7 } from "bun";
import { randomUUID } from "node:crypto";

export const uuidv7 = () => randomUUIDv7();
export const uuidv4 = () => randomUUID();

export function md5(text: string) {
  return new Bun.CryptoHasher("md5").update(text).digest("hex");
}

export function omit<
  O extends Record<string, any>,
  T extends O | O[],
  K extends keyof O
>(obj: T, keys: K | K[]): T extends any[] ? Omit<T[number], K>[] : Omit<T, K> {
  const keySet = new Set(Array.isArray(keys) ? keys : [keys]);

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      const newItem = { ...item };
      keySet.forEach((key) => delete newItem[key]);
      return newItem;
    }) as any;
  }

  const newObj = { ...obj };
  keySet.forEach((key) => delete newObj[key as never]);
  return newObj as any;
}
