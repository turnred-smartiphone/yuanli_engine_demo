Page({
  data: { list: [], loading: true, keyword: '' },

  onShow() { this.loadList(); },
  onPullDownRefresh() {
    this.loadList().then(() => wx.stopPullDownRefresh());
  },

  loadList() {
    this.setData({ loading: true });
    const notifications = wx.getStorageSync('notifications') || [];
    let list = notifications;
    if (this.data.keyword) {
      list = list.filter(n => n.title.includes(this.data.keyword));
    }
    setTimeout(() => {
      this.setData({ list, loading: false });
    }, 300);
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
