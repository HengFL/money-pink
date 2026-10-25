export const processDashboardData = (rawData, selectedYear = 'All') => {
  const totals = {
    cost: 0,
    paid: 0,
    outstandingPay: 0, // ค้างจ่าย
    income: 0,
    received: 0,       // ยอดรับ
    outstandingReceive: 0 // ค้างรับ
  };

  const memberMap = new Map();
  const monthlyMap = new Map();
  
  const getThaiMonthAbbr = (m) => {
    const abbrs = {
      '01': 'ม.ค.', '02': 'ก.พ.', '03': 'มี.ค.', '04': 'เม.ย.',
      '05': 'พ.ค.', '06': 'มิ.ย.', '07': 'ก.ค.', '08': 'ส.ค.',
      '09': 'ก.ย.', '10': 'ต.ค.', '11': 'พ.ย.', '12': 'ธ.ค.'
    };
    return abbrs[m] || m;
  };
  
  const thaiMonthMap = {
    'มกราคม': '01',
    'กุมภาพันธ์': '02',
    'มีนาคม': '03',
    'เมษายน': '04',
    'พฤษภาคม': '05',
    'มิถุนายน': '06',
    'กรกฎาคม': '07',
    'สิงหาคม': '08',
    'กันยายน': '09',
    'ตุลาคม': '10',
    'พฤศจิกายน': '11',
    'ธันวาคม': '12'
  };

  const thaiMonths = [
    { key: 'มกรา', val: '01' }, { key: 'กุมภา', val: '02' }, { key: 'มีนา', val: '03' },
    { key: 'เมษา', val: '04' }, { key: 'พฤษภา', val: '05' }, { key: 'มิถุนา', val: '06' },
    { key: 'กรกฎา', val: '07' }, { key: 'สิงหา', val: '08' }, { key: 'กันยา', val: '09' },
    { key: 'ตุลา', val: '10' }, { key: 'พฤศจิ', val: '11' }, { key: 'ธันวา', val: '12' }
  ];

  const parseMonthKey = (monthRaw) => {
    if (!monthRaw) return '';
    const text = String(monthRaw).trim();
    if (thaiMonthMap[text]) return thaiMonthMap[text];
    for (const tm of thaiMonths) {
      if (text.includes(tm.key)) return tm.val;
    }
    const abbrMap = {
      'ม.ค.': '01', 'ก.พ.': '02', 'มี.ค.': '03', 'เม.ย.': '04',
      'พ.ค.': '05', 'มิ.ย.': '06', 'ก.ค.': '07', 'ส.ค.': '08',
      'ก.ย.': '09', 'ต.ค.': '10', 'พ.ย.': '11', 'ธ.ค.': '12'
    };
    if (abbrMap[text]) return abbrMap[text];
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      return String(num).padStart(2, '0');
    }
    return '';
  };

  rawData.forEach(item => {
    // Parse numeric values, treating empty strings as 0
    const cost = Number(item['ต้นทุน (฿)']) || 0;
    const paid = Number(item['ยอดจ่าย (฿)']) || 0;
    const outPay = Number(item['ค้างจ่าย (฿)']) || 0;
    const income = Number(item['รายได้ (฿)']) || 0;
    const received = Number(item['ยอดรับ (฿)']) || 0;
    const outReceive = Number(item['ค้างรับ (฿)']) || 0;
    
    const memberName = item['สมาชิก'] ? String(item['สมาชิก']).trim() : '';
    const status = item['สถานะ'];

    // Update overall totals
    totals.cost += cost;
    totals.paid += paid;
    totals.outstandingPay += outPay;
    totals.income += income;
    totals.received += received;
    totals.outstandingReceive += outReceive;

    if (!memberName) return; // Skip if no member name

    // Initialize member if not exists
    if (!memberMap.has(memberName)) {
      memberMap.set(memberName, {
        name: memberName,
        totals: {
          cost: 0,
          paid: 0,
          outstandingPay: 0,
          income: 0,
          received: 0,
          outstandingReceive: 0
        },
        statuses: {
          'จ่ายแล้ว': 0,
          'ค้างจ่าย': 0,
          'อื่นๆ': 0
        },
        transactions: []
      });
    }

    const memberData = memberMap.get(memberName);

    // Update member totals
    memberData.totals.cost += cost;
    memberData.totals.paid += paid;
    memberData.totals.outstandingPay += outPay;
    memberData.totals.income += income;
    memberData.totals.received += received;
    memberData.totals.outstandingReceive += outReceive;

    // Update member statuses
    if (status === 'จ่ายแล้ว') {
      memberData.statuses['จ่ายแล้ว'] += 1;
    } else if (status === 'ค้างจ่าย') {
      memberData.statuses['ค้างจ่าย'] += 1;
    } else if (status) {
      if (!memberData.statuses[status]) memberData.statuses[status] = 0;
      memberData.statuses[status] += 1;
    }

    // Add to transactions (optional, for detailed view later)
    memberData.transactions.push(item);

    // Calculate timeline data (Year or Month) for the chart
    // Primary: use source_year (ค.ศ.) and เดือน (Thai full month)
    let yearKey = item['source_year'] ? String(item['source_year']).trim() : '';
    let monthKey = parseMonthKey(item['เดือน']);

    // Fallback to วันที่สรุป or วันที่ทำ if source_year or เดือน is missing
    let dateStr = item['วันที่สรุป'] || item['วันที่ทำ'];
    if ((!yearKey || !monthKey) && dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        if (!yearKey) yearKey = String(d.getFullYear());
        if (!monthKey) monthKey = String(d.getMonth() + 1).padStart(2, '0');
      }
    }

    if (!yearKey) {
      yearKey = String(new Date().getFullYear());
    }
    if (!monthKey) {
      monthKey = '01'; // Default safely if unknown
    }

    let timeKey = '';
    let displayTime = '';

    if (selectedYear === 'All') {
      timeKey = yearKey;
      displayTime = yearKey;
    } else {
      timeKey = `${yearKey}-${monthKey}`;
      displayTime = getThaiMonthAbbr(monthKey);
    }

    if (timeKey) {
      if (!monthlyMap.has(timeKey)) {
        monthlyMap.set(timeKey, {
           timeKey: timeKey,
           displayTime: displayTime
        });
      }
      
      const mData = monthlyMap.get(timeKey);
      if (!mData[memberName]) {
        mData[memberName] = { 
          cost: 0, 
          paid: 0, 
          outstandingPay: 0, 
          income: 0, 
          received: 0, 
          outstandingReceive: 0 
        };
      }
      
      mData[memberName].cost += cost;
      mData[memberName].paid += paid;
      mData[memberName].outstandingPay += outPay;
      mData[memberName].income += income;
      mData[memberName].received += received;
      mData[memberName].outstandingReceive += outReceive;
    }
  });

  // Custom member sorting order
  const customOrder = ['รอมือลาห์', 'ปาตีเมาะห์', 'อิบรอเฮง', 'ซากีเราะห์'];
  
  // Convert Map to Array and sort by custom order
  const members = Array.from(memberMap.values()).sort((a, b) => {
    const indexA = customOrder.indexOf(a.name);
    const indexB = customOrder.indexOf(b.name);
    
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    } else if (indexA !== -1) {
      return -1;
    } else if (indexB !== -1) {
      return 1;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  const timelineData = Array.from(monthlyMap.values()).sort((a, b) => a.timeKey.localeCompare(b.timeKey));

  return {
    totals,
    members,
    timelineData
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};
