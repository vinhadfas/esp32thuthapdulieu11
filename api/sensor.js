
  let latest = {
    voltage: 0,
    current: 0,
    power:   0,
    energy:  0,
    frequency: 0,
    temp:    0,
    timestamp: Date.now()
  };
  
  export default function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'POST') {
      const { voltage, current, power, energy, frequency, temp } = req.body;
      latest = { voltage, current, power, energy, frequency, temp, timestamp: Date.now() };
      return res.status(200).json({ message: 'Updated' });
    }
  
    // GET
    return res.status(200).json(latest);
  }
  