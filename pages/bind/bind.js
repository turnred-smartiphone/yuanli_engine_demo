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
    organizations: [
      { text: '学生会', value: 'student_union' },
      { text: '团委', value: 'youth_league' },
      { text: '青年志愿者协会', value: 'volunteer' },
      { text: '社团联合会', value: 'club_union' },
      { text: '班级', value: 'class' }
    ],
    orgIndex: 0,
    orgName: '',
    submitting: false
  },

  onRoleChange(e) {
    const index = Number(e.detail.value);
    const role = this.data.roles[index];
    this.setData({
      roleIndex: index,
      roleName: role.text,
      'form.role': role.value
    });
  },

  onOrgChange(e) {
    const index = Number(e.detail.value);
    const org = this.data.organizations[index];
    this.setData({
      orgIndex: index,
      orgName: org.text,
      'form.organization': org.value
    });
  },

  onStudentIdChange(e) {
    this.setData({ 'form.studentId': e.detail });
  },

  onNameChange(e) {
    this.setData({ 'form.name': e.detail });
  },

  handleSubmit() {
    const { studentId, name, role, organization } = this.data.form;
    if (!studentId || !name || !role || !organization) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    if (wx.cloud) {
      wx.cloud.callFunction({
        name: 'bindUser',
        data: {
          student_id: studentId,
          name: name,
          role: role,
          organization: organization
        }
      }).then(res => {
        const result = res.result || {};
        if (result.code !== 0) {
          this.setData({ submitting: false });
          wx.showToast({ title: result.msg || '绑定失败', icon: 'none' });
          return;
        }
        this.finishBind({
          openid: result.data.openid,
          student_id: studentId,
          name: name,
          role: role,
          organization: organization,
          avatar: app.globalData.userInfo ? app.globalData.userInfo.avatarUrl : '',
          created_at: new Date().toISOString()
        });
      }).catch(err => {
        console.error('bindUser 调用失败', err);
        this.doMockBind();
      });
    } else {
      this.doMockBind();
    }
  },

  doMockBind() {
    const { studentId, name, role, organization } = this.data.form;
    setTimeout(() => {
      this.finishBind({
        openid: 'demo_' + studentId,
        student_id: studentId,
        name: name,
        role: role,
        organization: organization,
        avatar: app.globalData.userInfo ? app.globalData.userInfo.avatarUrl : '',
        created_at: new Date().toISOString()
      });
    }, 500);
  },

  finishBind(userInfo) {
    wx.setStorageSync('userInfo', userInfo);
    wx.setStorageSync('openid', userInfo.openid);
    app.globalData.isLogin = true;
    app.globalData.role = userInfo.role;
    app.globalData.openid = userInfo.openid;
    app.globalData.userInfo = userInfo;

    this.setData({ submitting: false });
    wx.showToast({ title: '绑定成功', icon: 'success' });
    setTimeout(() => {
      wx.switchTab({ url: '/pages/dashboard/index' });
    }, 800);
  }
});
