import fs from 'fs/promises';
import path from 'path';

const DATA_PATH  = path.join('/tmp', 'data.json');

/* đọc / ghi store */
async function readStore() {
  try {
    return JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
  } catch {
    return {
      history: [],
      thresholds: {
        tempLow1: -30, tempHigh1: 30,
        tempLow2: -30, tempHigh2: 30
      }
    };
  }
}

async function writeStore(store) {
  await fs.writeFile(DATA_PATH, JSON.stringify(store));
}

/* ------------ API ------------ */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const store = await readStore();

  if (req.method === 'POST') {
    const {
      voltage, current, power, energy, frequency,
      temp1, temp2,
      tempLow1, tempHigh1,
      tempLow2, tempHigh2
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
        temp1,
        temp2
      });
  
      changed = true;
    }

    /* threshold */
    if (typeof tempLow1 === 'number' && typeof tempHigh1 === 'number') {
      if (tempLow1 > tempHigh1)
        return res.status(400).json({ message: 'Ngưỡng thấp 1 phải nhỏ hơn hoặc bằng ngưỡng cao 1' });
      store.thresholds.tempLow1 = tempLow1;
      store.thresholds.tempHigh1 = tempHigh1;
      changed = true;
    }

    if (typeof tempLow2 === 'number' && typeof tempHigh2 === 'number') {
      if (tempLow2 > tempHigh2)
        return res.status(400).json({ message: 'Ngưỡng thấp 2 phải nhỏ hơn hoặc bằng ngưỡng cao 2' });
      store.thresholds.tempLow2 = tempLow2;
      store.thresholds.tempHigh2 = tempHigh2;
      changed = true;
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
  const minTemp = parseFloat(req.query.minTemp);
  const maxTemp = parseFloat(req.query.maxTemp);

  let filteredHistory = store.history;

  if (!isNaN(minTemp) && !isNaN(maxTemp)) {
    filteredHistory = filteredHistory.filter(p => {
      const t1 = parseFloat(p.temp1);
      const t2 = parseFloat(p.temp2);
      return (!isNaN(t1) && t1 >= minTemp && t1 <= maxTemp) ||
             (!isNaN(t2) && t2 >= minTemp && t2 <= maxTemp);
    });
  }

  return res.status(200).json({
    thresholds: store.thresholds,
    history: filteredHistory
  });
}
