Page({
  data: { list: [], loading: true, keyword: '' },

  onShow() { this.loadList(); },
  onPullDownRefresh() {
    this.loadList().then(() => wx.stopPullDownRefresh());
  },

  loadList() {
    this.setData({ loading: true });
    if (!wx.cloud) {
      const notifications = wx.getStorageSync('notifications') || [];
      let list = notifications;
      if (this.data.keyword) {
        list = list.filter(n => n.title.includes(this.data.keyword));
      }
      this.setData({ list, loading: false });
      return Promise.resolve();
    }

    return wx.cloud.callFunction({ name: 'getNotificationList' }).then(res => {
      const result = res.result || {};
      let list = (result.data || []);
      if (this.data.keyword) {
        list = list.filter(n => n.title.includes(this.data.keyword));
      }
      this.setData({ list, loading: false });
    }).catch(err => {
      console.error('getNotificationList 调用失败', err);
      this.setData({ loading: false });
    });
  },

  onSearch(e) {
    this.setData({ keyword: e.detail });
    this.loadList();
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/notification/detail?id=${id}` });
  }
});
