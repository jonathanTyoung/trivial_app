export function pickRandom<T>(items: T[], exclude?: T): T {
  if (items.length === 0) throw new Error('nothing to pick from');
  const pool = exclude !== undefined && items.length > 1 ? items.filter((i) => i !== exclude) : items;
  return pool[Math.floor(Math.random() * pool.length)];
}
