const { initMockData } = require('./utils/mock');
const config = require('./config');

App({
  globalData: {
    openid: '',
    userInfo: null,
    isLogin: false,
    role: '',
    cloudEnvId: config.cloudEnvId
  },

  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: this.globalData.cloudEnvId,
        traceUser: true
      });
    }
    initMockData();
    this.checkLoginStatus();
  },

  checkLoginStatus() {
    const openid = wx.getStorageSync('openid');
    const userInfo = wx.getStorageSync('userInfo');
    if (openid && userInfo) {
      this.globalData.openid = openid;
      this.globalData.userInfo = userInfo;
      this.globalData.isLogin = true;
      this.globalData.role = userInfo.role;
    }
  },

  navigateToApprovalList() {
    wx.navigateTo({ url: '/pages/approval/list' });
  },

  navigateToSchedule() {
    wx.switchTab({ url: '/pages/schedule/calendar' });
  },

  navigateToNotification() {
    wx.switchTab({ url: '/pages/notification/list' });
  }
});
