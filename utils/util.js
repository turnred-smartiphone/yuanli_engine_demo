const app = getApp();

function getDashboardData() {
  const userRole = app.globalData.role;

  const data = {
    pendingCount: 5,
    weekActivityCount: 8,
    confirmRate: 76,
    confirmedCount: 19,
    totalNotices: 25,
    recentRates: [
      { title: '期末安排通知', rate: 85 },
      { title: '下周例会通知', rate: 72 },
      { title: '社团招新通知', rate: 90 },
      { title: '运动会通知', rate: 68 },
      { title: '考试安排通知', rate: 95 }
    ],
    orgRankings: [
      { name: '学生会', count: 12 },
      { name: '团委', count: 8 },
      { name: '青年志愿者协会', count: 6 },
      { name: '社团联合会', count: 4 },
      { name: '各班级', count: 3 }
    ]
  };

  if (userRole === 'student') {
    data.pendingCount = 0;
    data.weekActivityCount = 4;
  }

  return data;
}

function checkConflict(date, startTime, endTime, excludeId) {
  const schedules = wx.getStorageSync('schedules') || [];
  return schedules.filter(s => {
    if (s.date !== date) return false;
    if (excludeId && s._id === excludeId) return false;
    return startTime < s.endTime && endTime > s.startTime;
  });
}

function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatTime(date) {
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: formatDate(monday), end: formatDate(sunday) };
}

module.exports = {
  getDashboardData,
  checkConflict,
  formatDate,
  formatTime,
  getWeekRange
};
