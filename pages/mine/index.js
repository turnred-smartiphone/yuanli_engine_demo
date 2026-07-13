const app = getApp();

Page({
  data: {
    userInfo: {},
    roleText: '',
    orgText: '',
    isLogin: false
  },

  onShow() {
    this.loadUserInfo();
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    const roleMap = {
      teacher: '老师',
      student_leader: '学生干部',
      student: '普通同学'
    };
    const orgMap = {
      student_union: '学生会',
      youth_league: '团委',
      volunteer: '青年志愿者协会',
      club_union: '社团联合会',
      class: '班级'
    };
    this.setData({
      userInfo,
      isLogin: !!(userInfo && userInfo.student_id),
      roleText: roleMap[userInfo.role] || '',
      orgText: orgMap[userInfo.organization] || ''
    });
  },

  goLogin() {
    wx.reLaunch({ url: '/pages/login/login' });
  },

  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          app.globalData = { openid: '', userInfo: null, isLogin: false, role: '', cloudEnvId: app.globalData.cloudEnvId };
          wx.reLaunch({ url: '/pages/login/login' });
        }
      }
    });
  }
});
