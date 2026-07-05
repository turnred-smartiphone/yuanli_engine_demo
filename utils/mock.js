function initMockData() {
  const activities = wx.getStorageSync('activities');
  if (activities && activities.length > 0) return;

  const demoActivities = [
    {
      _id: 'act_001',
      title: '校园歌手大赛',
      description: '为丰富校园文化生活，展示学生才艺，特举办校园歌手大赛。比赛分为初赛、复赛和决赛三个阶段。',
      organizer: '学生会',
      applicant_id: '2024001',
      applicant_name: '张三',
      date: '2026-07-10',
      start_time: '14:00',
      end_time: '18:00',
      location: '大学生活动中心',
      status: 'pending',
      approval_level: 1,
      approvals: [],
      created_at: '2026-07-01T10:00:00.000Z'
    },
    {
      _id: 'act_002',
      title: '志愿者社区服务',
      description: '组织志愿者前往附近社区开展志愿服务，包括清洁环境、慰问老人等活动。',
      organizer: '青年志愿者协会',
      applicant_id: '2024002',
      applicant_name: '李四',
      date: '2026-07-15',
      start_time: '08:00',
      end_time: '12:00',
      location: '阳光社区',
      status: 'pending',
      approval_level: 2,
      approvals: [{
        approver_name: '王主席',
        approver_role: '主席',
        status: 'approved',
        comment: '活动内容积极，同意',
        time: '2026-07-02T08:30:00.000Z'
      }],
      created_at: '2026-07-02T08:00:00.000Z'
    },
    {
      _id: 'act_003',
      title: '团委工作研讨会',
      description: '召开本学期团委工作研讨会，总结上学期工作，部署下学期工作计划。',
      organizer: '团委',
      applicant_id: '2024003',
      applicant_name: '王五',
      date: '2026-07-08',
      start_time: '09:00',
      end_time: '11:30',
      location: '行政楼会议室301',
      status: 'approved',
      approval_level: 2,
      approvals: [
        { approver_name: '赵主席', approver_role: '主席', status: 'approved', comment: '', time: '2026-07-01T09:00:00.000Z' },
        { approver_name: '陈老师', approver_role: '老师', status: 'approved', comment: '同意召开', time: '2026-07-02T10:00:00.000Z' }
      ],
      created_at: '2026-07-01T08:00:00.000Z'
    }
  ];

  wx.setStorageSync('activities', demoActivities);

  const demoSchedules = [
    { _id: 'sch_act_003', activity_id: 'act_003', title: '团委工作研讨会', date: '2026-07-08', start_time: '09:00', end_time: '11:30', location: '行政楼会议室301', organizer: '团委' },
    { _id: 'sch_001', activity_id: 'demo_001', title: '毕业典礼', date: '2026-07-01', start_time: '08:00', end_time: '12:00', location: '体育馆', organizer: '学校' },
    { _id: 'sch_002', activity_id: 'demo_002', title: '期末考试', date: '2026-07-03', start_time: '08:00', end_time: '17:00', location: '各教学楼', organizer: '教务处' },
    { _id: 'sch_003', activity_id: 'demo_003', title: '社团招新', date: '2026-07-12', start_time: '10:00', end_time: '16:00', location: '中心广场', organizer: '社团联合会' }
  ];

  wx.setStorageSync('schedules', demoSchedules);

  const demoNotifications = [
    {
      _id: 'noti_001',
      title: '关于期末考试安排的通知',
      content: '各位同学：本学期期末考试将于7月3日-7月7日进行，请各位同学提前做好准备，按时参加考试。具体考场安排请查看教务系统。',
      sender_id: 'T001',
      sender_name: '教务处',
      target_organization: 'all',
      target_role: 'student',
      receivers: ['2024001', '2024002', '2024003', '2024004', '2024005'],
      total_count: 5,
      confirmed_count: 3,
      confirmed_list: ['2024001', '2024002', '2024003'],
      created_at: '2026-07-01'
    },
    {
      _id: 'noti_002',
      title: '关于开展暑期社会实践的通知',
      content: '各位学生干部：暑期社会实践报名已开始，请各组织负责人于7月10日前提交实践方案，逾期不再受理。',
      sender_id: 'T002',
      sender_name: '团委老师',
      target_organization: 'all',
      target_role: 'student_leader',
      receivers: ['2024001', '2024002', '2024003'],
      total_count: 3,
      confirmed_count: 1,
      confirmed_list: ['2024001'],
      created_at: '2026-07-02'
    },
    {
      _id: 'noti_003',
      title: '关于下周全体教师会议的通知',
      content: '各位老师：定于下周一（7月7日）下午2点在行政楼会议室301召开全体教师会议，请准时参加。',
      sender_id: 'T003',
      sender_name: '学院办公室',
      target_organization: 'all',
      target_role: 'teacher',
      receivers: ['T001', 'T002', 'T003'],
      total_count: 3,
      confirmed_count: 2,
      confirmed_list: ['T001', 'T002'],
      created_at: '2026-07-03'
    }
  ];

  wx.setStorageSync('notifications', demoNotifications);
}

module.exports = { initMockData };
