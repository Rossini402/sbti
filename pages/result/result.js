const { computeResult } = require('../../utils/algorithm')
const { TYPE_IMAGES } = require('../../data/types')
const { dimensionMeta, dimensionOrder, DIM_EXPLANATIONS } = require('../../data/dimensions')

Page({
  data: {
    // 结果数据
    posterImage: '',
    posterCaption: '',
    modeKicker: '',
    typeName: '',
    badge: '',
    typeSub: '',
    desc: '',
    dimList: [],
    funNote: '本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。',
    authorOpen: false
  },

  onLoad() {
    const app = getApp()
    const answers = app.globalData.answers || {}
    const result = computeResult(answers)
    const type = result.finalType

    // 构建维度列表
    const dimList = dimensionOrder.map(dim => ({
      name: dimensionMeta[dim].name,
      level: result.levels[dim],
      score: result.rawScores[dim],
      explanation: DIM_EXPLANATIONS[dim][result.levels[dim]]
    }))

    this.setData({
      posterImage: TYPE_IMAGES[type.code] || '',
      posterCaption: type.intro || '',
      modeKicker: result.modeKicker,
      typeName: `${type.code}（${type.cn}）`,
      badge: result.badge,
      typeSub: result.sub,
      desc: type.desc || '',
      dimList
    })
  },

  // 折叠面板
  toggleAuthor() {
    this.setData({ authorOpen: !this.data.authorOpen })
  },

  // 重新测试
  onRestart() {
    const app = getApp()
    app.globalData.answers = {}
    wx.redirectTo({ url: '/pages/test/test' })
  },

  // 回到首页
  onBackHome() {
    wx.reLaunch({ url: '/pages/index/index' })
  }
})
