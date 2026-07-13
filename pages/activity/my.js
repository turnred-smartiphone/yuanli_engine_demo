Page({
  data: { list: [], loading: true },

  onShow() {
    this.loadList();
  },

  loadList() {
    this.setData({ loading: true });

    if (!wx.cloud) {
      const activities = wx.getStorageSync('activities') || [];
      this.setData({ list: activities, loading: false });
      return;
    }

    wx.cloud.callFunction({ name: 'getMyActivities' }).then(res => {
      const result = res.result || {};
      this.setData({ list: result.data || [], loading: false });
    }).catch(err => {
      console.error('getMyActivities 调用失败', err);
      this.setData({ loading: false });
    });
  },

  statusClass(status) {
    const map = { pending: 'tag-warning', approved: 'tag-success', rejected: 'tag-danger', cancelled: 'tag-danger' };
    return map[status] || '';
  },

  statusText(status) {
    const map = { pending: '待审批', approved: '已通过', rejected: '已驳回', cancelled: '已取消' };
    return map[status] || status;
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/activity/progress?id=${id}` });
  }
});
