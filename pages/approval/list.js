Page({
  data: { list: [], loading: true },

  onShow() { this.loadList(); },
  onPullDownRefresh() {
    this.loadList().then(() => wx.stopPullDownRefresh());
  },

  loadList() {
    this.setData({ loading: true });
    const activities = wx.getStorageSync('activities') || [];
    const pending = activities.filter(a =>
      a.status === 'pending' && (a.approval_level === 1 || a.approval_level === 2)
    );
    setTimeout(() => {
      this.setData({ list: pending, loading: false });
      if (!pending.length) {
        const demos = wx.getStorageSync('demoApprovals');
        if (demos && demos.length) {
          this.setData({ list: demos });
        }
      }
    }, 300);
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/approval/detail?id=${id}` });
  }
});
