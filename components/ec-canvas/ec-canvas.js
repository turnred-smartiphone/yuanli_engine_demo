Component({
  properties: {
    canvasId: { type: String, value: 'ec-canvas' },
    ec: {
      type: Object,
      value: { onInit: () => {}, lazyLoad: false }
    },
    forceUseOldCanvas: { type: Boolean, value: false }
  },

  data: { useNewCanvas: true },

  lifetimes: {
    attached() {
      const version = wx.getSystemInfoSync().SDKVersion;
      const canUseNewCanvas = this.compareVersion(version, '2.9.0') >= 0;
      this.setData({
        useNewCanvas: canUseNewCanvas && !this.properties.forceUseOldCanvas
      });
      if (this.properties.ec && this.properties.ec.onInit) {
        this.properties.ec.onInit();
      }
    }
  },

  methods: {
    compareVersion(v1, v2) {
      const arr1 = v1.split('.');
      const arr2 = v2.split('.');
      for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
        const n1 = parseInt(arr1[i] || 0);
        const n2 = parseInt(arr2[i] || 0);
        if (n1 > n2) return 1;
        if (n1 < n2) return -1;
      }
      return 0;
    },

    init(callback) {
      callback(this);
    },

    touchStart(e) {
      if (this.properties.ec && this.properties.ec.onTouchStart) {
        this.properties.ec.onTouchStart(e);
      }
    },
    touchMove(e) {
      if (this.properties.ec && this.properties.ec.onTouchMove) {
        this.properties.ec.onTouchMove(e);
      }
    },
    touchEnd(e) {
      if (this.properties.ec && this.properties.ec.onTouchEnd) {
        this.properties.ec.onTouchEnd(e);
      }
    }
  }
});
