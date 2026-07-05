const app = getApp();

Page({
  data: {
    greeting: '',
    todayDate: '',
    loaded: false,
    dashboard: {
      pendingCount: 0,
      weekActivityCount: 0,
      confirmRate: 0,
      confirmedCount: 0,
      totalNotices: 0,
      recentRates: [],
      orgRankings: []
    }
  },

  onShow() {
    this.setGreeting();
    this.getTodayDate();
    this.loadDashboardData();
  },

  onPullDownRefresh() {
    this.loadDashboardData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  setGreeting() {
    const hour = new Date().getHours();
    let g = '上午好';
    if (hour >= 6 && hour < 12) g = '早上好';
    else if (hour >= 12 && hour < 14) g = '中午好';
    else if (hour >= 14 && hour < 18) g = '下午好';
    else if (hour >= 18) g = '晚上好';
    const userInfo = app.globalData.userInfo || {};
    this.setData({ greeting: `${g}，${userInfo.name || '老师'}` });
  },

  getTodayDate() {
    const d = new Date();
    const weekMap = ['日', '一', '二', '三', '四', '五', '六'];
    this.setData({
      todayDate: `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekMap[d.getDay()]}`
    });
  },

  loadDashboardData() {
    this.setData({ loaded: false });

    const userRole = app.globalData.role;
    if (userRole === 'student') {
      const data = {
        pendingCount: 0,
        weekActivityCount: 4,
        confirmRate: 80,
        confirmedCount: 8,
        totalNotices: 10,
        recentRates: [
          { title: '期末安排', rate: 85 },
          { title: '下周例会', rate: 72 },
          { title: '社团招新', rate: 90 },
          { title: '运动会', rate: 68 },
          { title: '考试通知', rate: 95 }
        ],
        orgRankings: [
          { name: '学生会', count: 12 },
          { name: '团委', count: 8 },
          { name: '青年志愿者协会', count: 6 }
        ]
      };
      this.setData({ dashboard: data, loaded: true });
      return;
    }

    setTimeout(() => {
      const data = {
        pendingCount: 5,
        weekActivityCount: 8,
        confirmRate: 76,
        confirmedCount: 19,
        totalNotices: 25,
        recentRates: [
          { title: '期末安排', rate: 85 },
          { title: '下周例会', rate: 72 },
          { title: '社团招新', rate: 90 },
          { title: '运动会', rate: 68 },
          { title: '考试通知', rate: 95 }
        ],
        orgRankings: [
          { name: '学生会', count: 12 },
          { name: '团委', count: 8 },
          { name: '青年志愿者协会', count: 6 },
          { name: '社团联合会', count: 4 },
          { name: '各班级', count: 3 }
        ]
      };
      this.setData({ dashboard: data, loaded: true });
    }, 500);
  },

  goApprovalList() {
    wx.navigateTo({ url: '/pages/approval/list' });
  },

  goSchedule() {
    wx.switchTab({ url: '/pages/schedule/calendar' });
  },

  goNotification() {
    wx.switchTab({ url: '/pages/notification/list' });
  }
});
