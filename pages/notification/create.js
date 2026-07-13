Page({
  data: {
    form: { title: '', content: '', targetOrg: 'all', targetOrgName: '全部组织', targetRole: 'all', targetRoleName: '全部角色' },
    orgOptions: [
      { text: '全部组织', value: 'all' },
      { text: '学生会', value: 'student_union' },
      { text: '团委', value: 'youth_league' },
      { text: '青年志愿者协会', value: 'volunteer' },
      { text: '社团联合会', value: 'club_union' }
    ],
    roleOptions: [
      { text: '全部角色', value: 'all' },
      { text: '老师', value: 'teacher' },
      { text: '学生干部', value: 'student_leader' },
      { text: '普通同学', value: 'student' }
    ],
    showOrg: false, showRole: false,
    submitting: false
  },

  showOrgPicker() { this.setData({ showOrg: true }); },
  onOrgClose() { this.setData({ showOrg: false }); },

  onTitleChange(e) { this.setData({ 'form.title': e.detail }); },
  onContentChange(e) { this.setData({ 'form.content': e.detail }); },
  onOrgConfirm(e) {
    const { index } = e.detail;
    const item = this.data.orgOptions[index];
    this.setData({
      'form.targetOrg': item.value,
      'form.targetOrgName': item.text,
      showOrg: false
    });
  },

  showRolePicker() { this.setData({ showRole: true }); },
  onRoleClose() { this.setData({ showRole: false }); },
  onRoleConfirm(e) {
    const { index } = e.detail;
    const item = this.data.roleOptions[index];
    this.setData({
      'form.targetRole': item.value,
      'form.targetRoleName': item.text,
      showRole: false
    });
  },

  handleSubmit() {
    const { title, content } = this.data.form;
    if (!title || !content) {
      wx.showToast({ title: '请填写标题和内容', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    if (!wx.cloud) {
      setTimeout(() => {
        this.setData({ submitting: false });
        wx.showToast({ title: '发送成功', icon: 'success' });
        setTimeout(() => { wx.switchTab({ url: '/pages/notification/list' }); }, 800);
      }, 500);
      return;
    }

    wx.cloud.callFunction({
      name: 'createNotification',
      data: {
        title,
        content,
        target_organization: this.data.form.targetOrg,
        target_role: this.data.form.targetRole
      }
    }).then(res => {
      const result = res.result || {};
      if (result.code !== 0) {
        this.setData({ submitting: false });
        wx.showToast({ title: result.msg || '发送失败', icon: 'none' });
        return;
      }
      this.setData({ submitting: false });
      wx.showToast({ title: '发送成功', icon: 'success' });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/notification/list' });
      }, 800);
    }).catch(err => {
      console.error('createNotification 调用失败', err);
      this.setData({ submitting: false });
      wx.showToast({ title: '发送失败，请重试', icon: 'none' });
    });
  }
});
