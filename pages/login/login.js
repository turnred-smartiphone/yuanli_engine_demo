const app = getApp();

Page({
  data: {
    loading: false
  },

  onLoad() {
    if (app.globalData.isLogin) {
      wx.switchTab({ url: '/pages/dashboard/index' });
    }
  },

  handleLogin() {
    this.setData({ loading: true });

    this.getProfile().then(userInfo => {
      if (userInfo) {
        app.globalData.userInfo = userInfo;
      }
      this.routeAfterLogin();
    });
  },

  getProfile() {
    return new Promise(resolve => {
      if (!wx.getUserProfile) {
        resolve(null);
        return;
      }
      wx.getUserProfile({ desc: '用于展示用户信息' })
        .then(res => resolve(res.userInfo))
        .catch(() => resolve(null));
    });
  },

  routeAfterLogin() {
    if (!wx.cloud) {
      this.setData({ loading: false });
      wx.redirectTo({ url: '/pages/bind/bind' });
      return;
    }

    wx.cloud.callFunction({ name: 'login' }).then(res => {
      const result = res.result || {};
      if (result.code !== 0) {
        this.setData({ loading: false });
        wx.showToast({ title: '登录失败，请重试', icon: 'none' });
        return;
      }
      if (result.isNew) {
        this.setData({ loading: false });
        wx.redirectTo({ url: '/pages/bind/bind' });
      } else {
        const userInfo = result.data;
        if (app.globalData.userInfo) {
          userInfo.avatar = userInfo.avatar || app.globalData.userInfo.avatarUrl;
        }
        this.loginSuccess(userInfo);
      }
    }).catch(err => {
      console.error('login 云函数调用失败', err);
      this.setData({ loading: false });
      wx.redirectTo({ url: '/pages/bind/bind' });
    });
  },

  loginSuccess(userInfo) {
    wx.setStorageSync('openid', userInfo.openid || 'demo_openid');
    wx.setStorageSync('userInfo', userInfo);
    app.globalData.isLogin = true;
    app.globalData.role = userInfo.role;
    app.globalData.openid = userInfo.openid || 'demo_openid';
    app.globalData.userInfo = userInfo;

    wx.switchTab({ url: '/pages/dashboard/index' });
  }
});
