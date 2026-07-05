const app = getApp();

Page({
  data: {
    loading: false
  },

  handleLogin() {
    this.setData({ loading: true });

    wx.getUserProfile({
      desc: '用于展示用户信息'
    }).then(res => {
      const userInfo = res.userInfo;
      app.globalData.userInfo = userInfo;

      const existingUser = wx.getStorageSync('userInfo');
      if (existingUser && existingUser.student_id) {
        this.loginSuccess(existingUser);
      } else {
        wx.redirectTo({ url: '/pages/bind/bind' });
      }
    }).catch(() => {
      this.setData({ loading: false });
      this.doMockLogin();
    });
  },

  doMockLogin() {
    setTimeout(() => {
      const mockUser = wx.getStorageSync('userInfo');
      if (mockUser && mockUser.student_id) {
        this.loginSuccess(mockUser);
      } else {
        wx.redirectTo({ url: '/pages/bind/bind' });
      }
      this.setData({ loading: false });
    }, 600);
  },

  loginSuccess(userInfo) {
    wx.setStorageSync('openid', userInfo.openid || 'demo_openid');
    wx.setStorageSync('userInfo', userInfo);
    app.globalData.isLogin = true;
    app.globalData.role = userInfo.role;
    app.globalData.openid = userInfo.openid || 'demo_openid';

    wx.switchTab({ url: '/pages/dashboard/index' });
  }
});
