export const processCentralMoneyData = (rawData, selectedYear = 'All') => {
  const totals = {
    called: 0,
    collected: 0,
    outstanding: 0,
    withdrawn: 0,
    borrowed: 0,
    returned: 0,
    outstandingReturn: 0
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
    const called = Number(item['ยอดเรียก (฿)']) || 0;
    const collected = Number(item['ยอดเก็บ (฿)']) || 0;
    const outstanding = Number(item['ยอดค้าง (฿)']) || 0;
    const withdrawn = Number(item['ยอดเบิกเงิน (฿)']) || 0;
    const borrowed = Number(item['ยอดยืมเงิน (฿)']) || 0;
    const returned = Number(item['ยอดคืนเงิน (฿)']) || 0;
    const outstandingReturn = Number(item['ยอดค้างคืน (฿)']) || 0;
    
    const memberName = item['สมาชิก'] ? String(item['สมาชิก']).trim() : '';
    const status = item['สถานะ'];

    totals.called += called;
    totals.collected += collected;
    totals.outstanding += outstanding;
    totals.withdrawn += withdrawn;
    totals.borrowed += borrowed;
    totals.returned += returned;
    totals.outstandingReturn += outstandingReturn;

    if (!memberName) return;

    if (!memberMap.has(memberName)) {
      memberMap.set(memberName, {
        name: memberName,
        totals: {
          called: 0, collected: 0, outstanding: 0,
          withdrawn: 0, borrowed: 0, returned: 0, outstandingReturn: 0
        },
        statuses: {
          'จ่ายแล้ว': 0, 'ค้างจ่าย': 0, 'อื่นๆ': 0
        },
        transactions: []
      });
    }

    const memberData = memberMap.get(memberName);

    memberData.totals.called += called;
    memberData.totals.collected += collected;
    memberData.totals.outstanding += outstanding;
    memberData.totals.withdrawn += withdrawn;
    memberData.totals.borrowed += borrowed;
    memberData.totals.returned += returned;
    memberData.totals.outstandingReturn += outstandingReturn;

    if (status === 'จ่ายแล้ว') memberData.statuses['จ่ายแล้ว'] += 1;
    else if (status === 'ค้างจ่าย' || status === 'ค้าง') memberData.statuses['ค้างจ่าย'] += 1;
    else if (status) {
      if (!memberData.statuses[status]) memberData.statuses[status] = 0;
      memberData.statuses[status] += 1;
    }

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
      monthKey = '01';
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
        monthlyMap.set(timeKey, { timeKey, displayTime });
      }
      
      const mData = monthlyMap.get(timeKey);
      if (!mData[memberName]) {
        mData[memberName] = { called: 0, collected: 0, outstanding: 0, borrowed: 0, returned: 0, outstandingReturn: 0 };
      }
      
      mData[memberName].called += called;
      mData[memberName].collected += collected;
      mData[memberName].outstanding += outstanding;
      mData[memberName].borrowed += borrowed;
      mData[memberName].returned += returned;
      mData[memberName].outstandingReturn += outstandingReturn;
    }
  });

  const customOrder = ['รอมือลาห์', 'ปาตีเมาะห์', 'อิบรอเฮง', 'ซากีเราะห์'];
  
  const members = Array.from(memberMap.values()).sort((a, b) => {
    const indexA = customOrder.indexOf(a.name);
    const indexB = customOrder.indexOf(b.name);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
  
  const timelineData = Array.from(monthlyMap.values()).sort((a, b) => a.timeKey.localeCompare(b.timeKey));

  return { totals, members, timelineData };
};
