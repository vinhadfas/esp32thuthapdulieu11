let latest = {
  voltage: 0,
  current: 0,
  power:   0,
  energy:  0,
  frequency: 0,
  temp:    0,
  timestamp: Date.now()
};

let history = []; // Lưu dữ liệu trôi
const MAX_POINTS = 20;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { voltage, current, power, energy, frequency, temp } = req.body;
    const timestamp = Date.now();

    latest = { voltage, current, power, energy, frequency, temp, timestamp };
    history.push({ timestamp, voltage, current, power, frequency, temp });
    if (history.length > MAX_POINTS) history.shift();

    return res.status(200).json({ message: 'Updated' });
  }

  // Không còn dùng alive nữa
  return res.status(200).json({ history });
}
