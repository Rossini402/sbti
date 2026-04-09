const { questions, specialQuestions } = require('../../data/questions')
const { shuffle } = require('../../utils/algorithm')

Page({
  data: {
    shuffledQuestions: [],
    visibleQuestions: [],
    answers: {},
    progress: 0,
    progressText: '0 / 31',
    allDone: false,
    hintText: '全选完才会放行。世界已经够乱了，起码把题做完整。'
  },

  onLoad() {
    // 洗牌：30 常规题 + 第 1 道特殊题（饮酒门控）混在一起
    const mixed = [...questions, specialQuestions[0]]
    const shuffled = shuffle(mixed)
    this.setData({
      shuffledQuestions: shuffled,
      visibleQuestions: this._buildVisible(shuffled, {})
    })
  },

  // 构建可见题目列表（处理酒精追加题）
  _buildVisible(shuffled, answers) {
    const visible = [...shuffled]
    const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1')
    if (gateIndex !== -1 && answers['drink_gate_q1'] === 3) {
      // 在门控题后面插入追加题
      visible.splice(gateIndex + 1, 0, specialQuestions[1])
    }
    // 加上序号
    return visible.map((q, i) => ({
      ...q,
      index: i + 1,
      optionCodes: ['A', 'B', 'C', 'D']
    }))
  },

  // 选择选项
  onOptionChange(e) {
    const { qid, value } = e.currentTarget.dataset
    const numValue = Number(value)
    const answers = { ...this.data.answers, [qid]: numValue }

    // 如果门控题选了非"饮酒"，清除追加题答案
    if (qid === 'drink_gate_q1' && numValue !== 3) {
      delete answers['drink_gate_q2']
    }

    const visibleQuestions = this._buildVisible(this.data.shuffledQuestions, answers)
    const total = visibleQuestions.length
    const done = visibleQuestions.filter(q => answers[q.id] !== undefined).length
    const progress = total ? (done / total) * 100 : 0
    const allDone = done === total && total > 0

    this.setData({
      answers,
      visibleQuestions,
      progress,
      progressText: `${done} / ${total}`,
      allDone,
      hintText: allDone
        ? '都做完了。现在可以把你的电子魂魄交给结果页审判。'
        : '全选完才会放行。世界已经够乱了，起码把题做完整。'
    })
  },

  // 提交
  onSubmit() {
    if (!this.data.allDone) return
    const app = getApp()
    app.globalData.answers = this.data.answers
    wx.navigateTo({ url: '/pages/result/result' })
  },

  // 返回首页
  onBackHome() {
    wx.navigateBack()
  }
})
