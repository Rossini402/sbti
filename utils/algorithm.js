const { questions } = require('../data/questions')
const { dimensionMeta, dimensionOrder } = require('../data/dimensions')
const { TYPE_LIBRARY, NORMAL_TYPES } = require('../data/types')

// Fisher-Yates 洗牌
function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// 分数 → 等级：≤3 → L, 4 → M, ≥5 → H
function sumToLevel(score) {
  if (score <= 3) return 'L'
  if (score === 4) return 'M'
  return 'H'
}

// 等级 → 数值（用于距离计算）
function levelNum(level) {
  return { L: 1, M: 2, H: 3 }[level]
}

// 解析 pattern 字符串为数组，如 "HHH-HMH-MHH" → ['H','H','H','H','M','H','M','H','H']
function parsePattern(pattern) {
  return pattern.replace(/-/g, '').split('')
}

// 核心：根据用户答案计算结果
function computeResult(answers) {
  // 1. 按维度求和
  const rawScores = {}
  Object.keys(dimensionMeta).forEach(dim => { rawScores[dim] = 0 })

  questions.forEach(q => {
    rawScores[q.dim] += Number(answers[q.id] || 0)
  })

  // 2. 转换为 L/M/H 等级
  const levels = {}
  Object.entries(rawScores).forEach(([dim, score]) => {
    levels[dim] = sumToLevel(score)
  })

  // 3. 生成用户向量
  const userVector = dimensionOrder.map(dim => levelNum(levels[dim]))

  // 4. 对每种常规人格计算曼哈顿距离和相似度
  const ranked = NORMAL_TYPES.map(type => {
    const vector = parsePattern(type.pattern).map(levelNum)
    let distance = 0
    let exact = 0
    for (let i = 0; i < vector.length; i++) {
      const diff = Math.abs(userVector[i] - vector[i])
      distance += diff
      if (diff === 0) exact += 1
    }
    const similarity = Math.max(0, Math.round((1 - distance / 30) * 100))
    return { ...type, ...TYPE_LIBRARY[type.code], distance, exact, similarity }
  }).sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance
    if (b.exact !== a.exact) return b.exact - a.exact
    return b.similarity - a.similarity
  })

  const bestNormal = ranked[0]

  // 5. 判断是否触发酒精隐藏人格
  const drunkTriggered = answers['drink_gate_q2'] === 2

  // 6. 确定最终人格
  let finalType
  let modeKicker = '你的主类型'
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`
  let sub = '维度命中度较高，当前结果可视为你的第一人格画像。'
  let special = false
  let secondaryType = null

  if (drunkTriggered) {
    finalType = TYPE_LIBRARY.DRUNK
    secondaryType = bestNormal
    modeKicker = '隐藏人格已激活'
    badge = '匹配度 100% · 酒精异常因子已接管'
    sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。'
    special = true
  } else if (bestNormal.similarity < 60) {
    finalType = TYPE_LIBRARY.HHHH
    modeKicker = '系统强制兜底'
    badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`
    sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。'
    special = true
  } else {
    finalType = bestNormal
  }

  return {
    rawScores,
    levels,
    ranked,
    bestNormal,
    finalType,
    modeKicker,
    badge,
    sub,
    special,
    secondaryType
  }
}

module.exports = { shuffle, sumToLevel, computeResult }
