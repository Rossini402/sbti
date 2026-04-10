# SBTI 人格测试 - 微信小程序版

<img src="images/wx.jpg" width="200" alt="微信二维码" />

添加微信可以加入 AI 资讯、实践交流群

> MBTI 已经过时，SBTI 来了。

1:1 复刻 [sbti.unun.dev](https://sbti.unun.dev/) 的 SBTI 人格测试，原生微信小程序实现。

## 功能

- 30 道随机排序测试题 + 2 道隐藏门控题
- 27 种人格类型匹配（曼哈顿距离算法）
- 15 维度评分系统（5 大模型 × 3 维度）
- 酒精触发隐藏人格「DRUNK 酒鬼」
- 低匹配度兜底人格「HHHH 傻乐者」

## 项目结构

```
├── data/
│   ├── questions.js      # 题库（30 常规 + 2 特殊）
│   ├── types.js          # 27 种人格类型数据
│   └── dimensions.js     # 15 维度元数据与解释
├── utils/
│   └── algorithm.js      # 评分与匹配算法
├── pages/
│   ├── index/            # 首页
│   ├── test/             # 测试页
│   └── result/           # 结果页
├── app.js
├── app.json
└── app.wxss              # 全局样式（绿色主题）
```

## 开发

1. 使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)打开项目目录
2. 开发阶段勾选「不校验合法域名」以加载远程图片
3. 上线前需在微信公众平台添加 `sbti.unun.dev` 到 downloadFile 合法域名

## 致谢

- 原作者：[B站@蛆肉儿串儿](https://space.bilibili.com/417038183)
- 原站托管：Cloudflare
