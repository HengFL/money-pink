export const processDashboardData = (rawData) => {
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
  
  const thaiMonths = [
    { key: 'มกรา', val: '01' }, { key: 'กุมภา', val: '02' }, { key: 'มีนา', val: '03' },
    { key: 'เมษา', val: '04' }, { key: 'พฤษภา', val: '05' }, { key: 'มิถุนา', val: '06' },
    { key: 'กรกฎา', val: '07' }, { key: 'สิงหา', val: '08' }, { key: 'กันยา', val: '09' },
    { key: 'ตุลา', val: '10' }, { key: 'พฤศจิ', val: '11' }, { key: 'ธันวา', val: '12' }
  ];

  rawData.forEach(item => {
    // Parse numeric values, treating empty strings as 0
    const cost = Number(item['ต้นทุน (฿)']) || 0;
    const paid = Number(item['ยอดจ่าย (฿)']) || 0;
    const outPay = Number(item['ค้างจ่าย (฿)']) || 0;
    const income = Number(item['รายได้ (฿)']) || 0;
    const received = Number(item['ยอดรับ (฿)']) || 0;
    const outReceive = Number(item['ค้างรับ (฿)']) || 0;
    
    const memberName = item['สมาชิก'];
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

    // Calculate monthly data for TradingView-like chart
    let dateStr = item['วันที่ทำ'] || item['วันที่สรุป'];
    let monthKey = '';
    let yearKey = String(item['source_year'] || new Date().getFullYear());

    if (dateStr) {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        yearKey = String(d.getFullYear());
        monthKey = String(d.getMonth() + 1).padStart(2, '0');
      }
    }
    
    if (!monthKey) {
      const text = item['การลงทุน'] || '';
      for (const tm of thaiMonths) {
        if (text.includes(tm.key)) {
          monthKey = tm.val;
          break;
        }
      }
    }

    if (monthKey) {
      const fullMonthKey = `${yearKey}-${monthKey}`;
      if (!monthlyMap.has(fullMonthKey)) {
        monthlyMap.set(fullMonthKey, {
           monthKey: fullMonthKey,
           displayMonth: getThaiMonthAbbr(monthKey) + ' ' + yearKey.substring(2)
        });
      }
      
      const mData = monthlyMap.get(fullMonthKey);
      if (!mData[memberName]) mData[memberName] = 0;
      mData[memberName] += paid; // using Paid (ยอดจ่าย) as requested
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
  const monthlyData = Array.from(monthlyMap.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  return {
    totals,
    members,
    monthlyData
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};
