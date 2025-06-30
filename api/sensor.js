import fs from 'fs/promises';
import path from 'path';

const DATA_PATH  = path.join('/tmp', 'data.json');
const MAX_POINTS = 50;

/* đọc / ghi store */
async function readStore() {
  try {
    return JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
  } catch {
    return { history: [], thresholds: { tempLow: -30, tempHigh: 30 } };
  }
}
async function writeStore(store) {
  await fs.writeFile(DATA_PATH, JSON.stringify(store));
}

/* ------------ API ------------ */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const store = await readStore();

  if (req.method === 'POST') {
    const {
      voltage, current, power, energy, frequency,
      temp1, temp2, tempLow, tempHigh
    } = req.body;

    let changed = false;

    /* sensor */
    if ([voltage, current, power, energy, frequency, temp1, temp2].some(v => typeof v === 'number')) {
      store.history.push({
        timestamp: Date.now(),
        voltage,
        current,
        power,
        energy,
        frequency,
        temp1,     // thêm temp1
        temp2      // thêm temp2
      });
      if (store.history.length > MAX_POINTS) store.history.shift();
      changed = true;
    }

    /* threshold */
    if (typeof tempLow === 'number' && typeof tempHigh === 'number') {
      if (tempLow > tempHigh) return res.status(400).json({ message: 'tempLow ≤ tempHigh' });
      store.thresholds = { tempLow, tempHigh };
      changed = true;
    } else if (tempLow !== undefined || tempHigh !== undefined) {
      return res.status(400).json({ message: 'Need both tempLow & tempHigh' });
    }

    if (!changed) return res.status(400).json({ message: 'No valid fields' });

    try {
      await writeStore(store);
      return res.status(200).json({ message: 'Saved' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Cannot write data (read-only FS?)' });
    }
  }

  /* GET */
  return res.status(200).json({
    thresholds: store.thresholds,
    history: store.history
  });
}
