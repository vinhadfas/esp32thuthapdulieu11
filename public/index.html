<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Thông số cảm biến</title>
  <script src="https://code.highcharts.com/highcharts.js"></script>
  <script>Highcharts.setOptions({ time: { useUTC: false } });</script>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #eef9f8;
      margin: 0;
    }
    .header {
      background: #4eb9b7;
      color: white;
      text-align: center;
      padding: 1rem;
      font-size: 2rem;
      font-weight: bold;
    }
    .chart-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }
    .chart-box {
      background: white;
      border-radius: 1rem;
      padding: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 90%;
      max-width: 800px;
    }
  </style>
</head>
<body>
  <div class="header">Thông số cảm biến</div>
  <div class="chart-container">
    <div id="voltageChart" class="chart-box"></div>
    <div id="currentChart" class="chart-box"></div>
    <div id="powerChart" class="chart-box"></div>
    <div id="frequencyChart" class="chart-box"></div>
    <div id="tempChart" class="chart-box"></div>
  </div>

  <script>
    const MAX_POINTS = 10;
    const charts = {};
    let isOnline = true;
    let fetchInterval = null;
    const syncKey = 'latest_sensor_data';

    const COLORS = {
      Voltage: '#f94144',
      Current: '#f3722c',
      Power: '#f9c74f',
      Frequency: '#43aa8b',
      Temperature: '#577590'
    };

    const chartOptions = (title, unit) => ({
      chart: { type: 'line', animation: Highcharts.svg, marginRight: 10 },
      title: { text: title },
      xAxis: {
        type: 'datetime',
        tickInterval: 60000,
        labels: { format: '{value:%H:%M:%S}' },
        tickPixelInterval: 150
      },
      yAxis: {
        title: { text: unit },
        plotLines: [{ value: 0, width: 1, color: '#808080' }]
      },
      tooltip: {
        formatter() {
          return `<b>${this.series.name}</b><br/>` +
                 Highcharts.dateFormat('%H:%M:%S', this.x) +
                 `<br/>Giá trị: ${Highcharts.numberFormat(this.y, 2)} ${unit}`;
        }
      },
      legend: { enabled: false },
      exporting: { enabled: false },
      series: [{
        name: title,
        data: [],
        color: COLORS[title]
      }]
    });

    const chartConfigs = [
      { id: 'voltageChart', title: 'Voltage', unit: 'V' },
      { id: 'currentChart', title: 'Current', unit: 'A' },
      { id: 'powerChart', title: 'Power', unit: 'W' },
      { id: 'frequencyChart', title: 'Frequency', unit: 'Hz' },
      { id: 'tempChart', title: 'Temperature', unit: '°C' }
    ];

    chartConfigs.forEach(({ id, title, unit }) => {
      charts[title.toLowerCase()] = Highcharts.chart(id, chartOptions(title, unit));
    });

    function updateCharts(payload) {
      const { timestamp, voltage, current, power, frequency, temp } = payload;
      const values = { voltage, current, power, frequency, temp };
      for (let key in values) {
        const value = values[key];
        const chart = charts[key];
        if (chart && !isNaN(value)) {
          chart.series[0].addPoint([timestamp, value], true, chart.series[0].data.length >= MAX_POINTS);
        }
      }
    }

    async function fetchSensorData() {
      try {
        const res = await fetch('/api/sensor', { cache: 'no-store' });
        const { history = [], alive } = await res.json();

        if (!alive) {
          if (isOnline) {
            isOnline = false;
            clearInterval(fetchInterval);
            fetchInterval = null;
            alert('ESP32 mất kết nối. Đồ thị tạm dừng.');
          }
          return;
        }

        if (!isOnline) {
          isOnline = true;
          alert('ESP32 đã kết nối lại. Tiếp tục cập nhật đồ thị.');
          startFetching();
        }

        history.forEach(updateCharts);
        if (history.length) {
          localStorage.setItem(syncKey, JSON.stringify(history[history.length - 1]));
        }
      } catch (e) {
        console.warn('Lỗi khi kết nối tới API:', e);
        if (isOnline) {
          isOnline = false;
          clearInterval(fetchInterval);
          fetchInterval = null;
        }
      }
    }

    function startFetching() {
      if (fetchInterval) return;
      fetchSensorData();

      const now = new Date();
      const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
      setTimeout(() => {
        fetchSensorData();
        fetchInterval = setInterval(fetchSensorData, 60000);
      }, delay);
    }

    window.addEventListener('storage', (e) => {
      if (e.key === syncKey && e.newValue) {
        updateCharts(JSON.parse(e.newValue));
      }
    });

    startFetching();
  </script>
</body>
</html>
