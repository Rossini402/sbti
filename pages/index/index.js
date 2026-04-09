Page({
  onStart() {
    // 清空上次的答案
    const app = getApp()
    app.globalData.answers = {}
    wx.navigateTo({ url: '/pages/test/test' })
  }
})
