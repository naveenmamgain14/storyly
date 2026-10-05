/**
 * The SDK story list is read constantly and changes a few times a day, while
 * each read costs several round trips to a distant database. Holding the
 * finished response briefly turns ~1.5s into ~1ms for almost every request.
 *
 * A TTL alone would mean waiting up to a minute to see an edit, so every
 * mutation clears this explicitly; the TTL is only a backstop.
 */
interface Entry {
  payload: unknown;
  expiresAt: number;
}

const TTL_MS = 60_000;
const store = new Map<string, Entry>();

export const storyCache = {
  get(key: string): unknown | undefined {
    const hit = store.get(key);
    if (!hit) return undefined;
    if (Date.now() > hit.expiresAt) {
      store.delete(key);
      return undefined;
    }
    return hit.payload;
  },

  set(key: string, payload: unknown): void {
    store.set(key, { payload, expiresAt: Date.now() + TTL_MS });
  },

  /** Called whenever stories or their media change. */
  clear(): void {
    store.clear();
  },

  get size(): number {
    return store.size;
  }
};
