const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async () => {
  const pendingCount = (await db.collection('activities').where({ status: 'pending' }).count()).total;
  const now = new Date();
  const monday = new Date(now); monday.setDate(now.getDate() - (now.getDay() || 7) + 1);
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  const startStr = `${monday.getFullYear()}-${String(monday.getMonth()+1).padStart(2,'0')}-${String(monday.getDate()).padStart(2,'0')}`;
  const endStr = `${sunday.getFullYear()}-${String(sunday.getMonth()+1).padStart(2,'0')}-${String(sunday.getDate()).padStart(2,'0')}`;
  const weekCount = (await db.collection('schedules').where({ date: _.gte(startStr).and(_.lte(endStr)) }).count()).total;

  const notifications = await db.collection('notifications').get();
  let totalNotices = notifications.data.length;
  let confirmedTotal = 0;
  notifications.data.forEach(n => { confirmedTotal += n.confirmed_count || 0; });
  const totalRecipients = notifications.data.reduce((s, n) => s + (n.total_count || 0), 0);
  const confirmRate = totalRecipients ? Math.round((confirmedTotal / totalRecipients) * 100) : 0;

  const recentRates = notifications.data.slice(0, 5).map(n => ({
    title: n.title,
    rate: n.total_count ? Math.round(((n.confirmed_count || 0) / n.total_count) * 100) : 0
  }));

  const orgRes = await db.collection('activities').where({ status: 'approved' }).get();
  const orgMap = {};
  orgRes.data.forEach(a => {
    orgMap[a.organizer] = (orgMap[a.organizer] || 0) + 1;
  });
  const orgRankings = Object.entries(orgMap).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count).slice(0, 5);

  return {
    code: 0,
    data: {
      pendingCount,
      weekActivityCount: weekCount,
      confirmRate,
      confirmedCount: confirmedTotal,
      totalNotices,
      recentRates,
      orgRankings
    }
  };
};
