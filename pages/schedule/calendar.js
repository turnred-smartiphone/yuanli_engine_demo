Page({
  data: {
    year: 2026, month: 7,
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    days: [],
    selectedDate: '',
    dayActivities: []
  },

  onShow() {
    const now = new Date();
    this.setData({ year: now.getFullYear(), month: now.getMonth() + 1 });
    this.generateCalendar();
    this.loadSelectedActivities();
  },

  onPullDownRefresh() {
    this.generateCalendar();
    this.loadSelectedActivities();
    wx.stopPullDownRefresh();
  },

  generateCalendar() {
    const { year, month } = this.data;
    const schedules = wx.getStorageSync('schedules') || [];
    const scheduleDates = {};
    schedules.forEach(s => { scheduleDates[s.date] = true; });

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    const prevMonthDays = new Date(year, month - 1, 0).getDate();

    const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;

    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isOtherMonth: true,
        isToday: false,
        hasActivity: false,
        fullDate: ''
      });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        isOtherMonth: false,
        isToday: dateStr === todayStr,
        hasActivity: !!scheduleDates[dateStr],
        fullDate: dateStr
      });
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({
        day: d,
        isOtherMonth: true,
        isToday: false,
        hasActivity: false,
        fullDate: ''
      });
    }

    this.setData({ days });
  },

  selectDay(e) {
    const date = e.currentTarget.dataset.date;
    if (!date) return;
    this.setData({ selectedDate: date });
    this.loadDayActivities(date);
  },

  loadDayActivities(date) {
    const schedules = wx.getStorageSync('schedules') || [];
    const activities = schedules.filter(s => s.date === date);
    this.setData({ dayActivities: activities });
  },

  loadSelectedActivities() {
    if (this.data.selectedDate) {
      this.loadDayActivities(this.data.selectedDate);
    }
  },

  prevMonth() {
    let { year, month } = this.data;
    if (month === 1) { year--; month = 12; } else { month--; }
    this.setData({ year, month });
    this.generateCalendar();
    this.setData({ selectedDate: '', dayActivities: [] });
  },

  nextMonth() {
    let { year, month } = this.data;
    if (month === 12) { year++; month = 1; } else { month++; }
    this.setData({ year, month });
    this.generateCalendar();
    this.setData({ selectedDate: '', dayActivities: [] });
  },

  goToday() {
    const now = new Date();
    this.setData({ year: now.getFullYear(), month: now.getMonth() + 1 });
    this.generateCalendar();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    this.setData({ selectedDate: todayStr });
    this.loadDayActivities(todayStr);
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/schedule/detail?id=${id}` });
  }
});
