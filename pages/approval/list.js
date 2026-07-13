Page({
  data: { list: [], loading: true },

  onShow() { this.loadList(); },
  onPullDownRefresh() {
    this.loadList().then(() => wx.stopPullDownRefresh());
  },

  loadList() {
    this.setData({ loading: true });

    if (!wx.cloud) {
      const activities = wx.getStorageSync('activities') || [];
      const pending = activities.filter(a =>
        a.status === 'pending' && (a.approval_level === 1 || a.approval_level === 2)
      );
      this.setData({ list: pending, loading: false });
      return Promise.resolve();
    }

    return wx.cloud.callFunction({ name: 'getApprovalList' }).then(res => {
      const result = res.result || {};
      this.setData({ list: result.data || [], loading: false });
    }).catch(err => {
      console.error('getApprovalList 调用失败', err);
      this.setData({ loading: false });
    });
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/approval/detail?id=${id}` });
  }
});
