const app = getApp();

Page({
  data: {
    form: {
      studentId: '',
      name: '',
      role: '',
      organization: ''
    },
    roles: [
      { text: '老师', value: 'teacher' },
      { text: '学生干部', value: 'student_leader' },
      { text: '普通同学', value: 'student' }
    ],
    roleIndex: 0,
    roleName: '',
    showRole: false,
    organizations: [
      { text: '学生会', value: 'student_union' },
      { text: '团委', value: 'youth_league' },
      { text: '青年志愿者协会', value: 'volunteer' },
      { text: '社团联合会', value: 'club_union' },
      { text: '班级', value: 'class' }
    ],
    orgIndex: 0,
    orgName: '',
    showOrg: false,
    submitting: false
  },

  showRolePicker() { this.setData({ showRole: true }); },
  onRoleClose() { this.setData({ showRole: false }); },
  onRoleConfirm(e) {
    const { index } = e.detail;
    const role = this.data.roles[index];
    this.setData({
      roleIndex: index,
      roleName: role.text,
      'form.role': role.value,
      showRole: false
    });
  },

  showOrgPicker() { this.setData({ showOrg: true }); },
  onOrgClose() { this.setData({ showOrg: false }); },
  onOrgConfirm(e) {
    const { index } = e.detail;
    const org = this.data.organizations[index];
    this.setData({
      orgIndex: index,
      orgName: org.text,
      'form.organization': org.value,
      showOrg: false
    });
  },

  handleSubmit() {
    const { studentId, name, role, organization } = this.data.form;
    if (!studentId || !name || !role || !organization) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    const userInfo = {
      openid: 'demo_' + studentId,
      student_id: studentId,
      name: name,
      role: role,
      organization: organization,
      avatar: app.globalData.userInfo ? app.globalData.userInfo.avatarUrl : '',
      created_at: new Date().toISOString()
    };

    setTimeout(() => {
      wx.setStorageSync('userInfo', userInfo);
      wx.setStorageSync('openid', userInfo.openid);
      app.globalData.isLogin = true;
      app.globalData.role = role;
      app.globalData.openid = userInfo.openid;
      app.globalData.userInfo = userInfo;

      wx.showToast({ title: '绑定成功', icon: 'success' });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/dashboard/index' });
      }, 800);
    }, 500);
  }
});
