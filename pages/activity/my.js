Page({
  data: { list: [], loading: true },

  onShow() {
    this.loadList();
  },

  loadList() {
    this.setData({ loading: true });
    const activities = wx.getStorageSync('activities') || [];
    setTimeout(() => {
      this.setData({ list: activities, loading: false });
    }, 300);
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
