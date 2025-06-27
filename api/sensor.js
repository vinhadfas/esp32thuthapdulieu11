import fs from 'fs/promises';
import path from 'path';

/* ---------- cấu hình ---------- */
const DATA_PATH = path.join(process.cwd(), 'data.json');
const MAX_POINTS = 50;

/* đọc / ghi store */
async function readStore() {
  try { return JSON.parse(await fs.readFile(DATA_PATH, 'utf8')); }
  catch {                     // lần đầu chưa có file
    return { history: [], thresholds: { tempLow: 9, tempHigh: 10 } };
  }
}
async function writeStore(store) {
  await fs.writeFile(DATA_PATH, JSON.stringify(store));
}

/* ---------- API handler ---------- */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const store = await readStore();      // đọc file JSON

  /* ---------- POST ---------- */
  if (req.method === 'POST') {
    const {
      voltage, current, power, energy, frequency, temp, // sensor
      tempLow, tempHigh                                 // threshold
    } = req.body;
    let changed = false;

    /* ghi điểm sensor nếu có ít nhất 1 trường số */
    if ([voltage,current,power,energy,frequency,temp].some(v=>typeof v==='number')) {
      const timestamp = Date.now();
      store.history.push({ timestamp, voltage, current, power, energy, frequency, temp });
      if (store.history.length > MAX_POINTS) store.history.shift();
      changed = true;
    }

    /* ghi threshold nếu đủ 2 trường */
    if (typeof tempLow === 'number' && typeof tempHigh === 'number') {
      if (tempLow > tempHigh) {
        return res.status(400).json({ message: 'tempLow phải ≤ tempHigh' });
      }
      store.thresholds = { tempLow, tempHigh };
      changed = true;
    } else if ((tempLow !== undefined) || (tempHigh !== undefined)) {
      return res.status(400).json({ message: 'Thiếu tempLow / tempHigh' });
    }

    if (!changed) {
      return res.status(400).json({ message: 'Không có dữ liệu hợp lệ' });
    }
    await writeStore(store);
    return res.status(200).json({ message: 'Saved' });
  }

  /* ---------- GET ---------- */
  return res.status(200).json({
    thresholds: store.thresholds,
    history: store.history
  });
}
