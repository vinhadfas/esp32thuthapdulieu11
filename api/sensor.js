import fs from 'fs/promises';
import path from 'path';

const DATA_PATH  = path.join(process.cwd(), 'data.json');
const MAX_POINTS = 20;            // giữ bao nhiêu tuỳ bạn

async function readHistory() {
  try { return JSON.parse(await fs.readFile(DATA_PATH,'utf8')); }
  catch { return []; }              // file chưa tồn tại
}
async function writeHistory(arr) {
  await fs.writeFile(DATA_PATH, JSON.stringify(arr));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { voltage, current, power, energy, frequency, temp } = req.body;
    const timestamp = Date.now();

    const history = await readHistory();
    history.push({ timestamp, voltage, current, power, energy, frequency, temp });
    if (history.length > MAX_POINTS) history.shift();

    await writeHistory(history);
    return res.status(200).json({ message: 'Saved' });
  }

  /* GET: trả mảng lịch sử */
  const history = await readHistory();
  return res.status(200).json({ history });
}
