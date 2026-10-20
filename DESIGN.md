---
name: "SHUGE Odyssey · 好奇心引力场"
description: "松林夜色中的植物小星球，让可探索的世界与瓷白阅读面板相连。"
colors:
  sky: "#0b1a20"
  text: "#f2f0e2"
  soft: "#b9c9bf"
  accent: "#eab58f"
  sage: "#a9c6ac"
  paper: "#f0f0e7"
  ink: "#243b32"
  muted: "#53675a"
  rule: "#cdd6c9"
  primary-ink: "#17332b"
  accent-hover: "#f2c7a2"
  day-sky: "#c5d8ce"
  day-text: "#223d34"
  day-soft: "#3f6051"
  day-accent: "#b87145"
  day-sage: "#466a50"
  day-primary: "#365e46"
  day-primary-hover: "#426e52"
  day-primary-text: "#f6efe0"
  landmark-surface: "#102c2be8"
  landmark-hover: "#2d4b40"
  landmark-hover-text: "#f8e3c8"
  filter-ink: "#305a3b"
  filter-rule: "#59815b"
  panel-accent: "#ad653e"
  lab-ground: "#20382f"
  moss-ground: "#809d77"
  porcelain-building: "#e9dfc1"
  terracotta-roof: "#b96345"
  wood: "#805d45"
  deep-green: "#233e3d"
  sage-material: "#95b19b"
  patina-metal: "#527570"
  stone: "#b9b99a"
  warm-window: "#f5ca84"
  emissive-amber: "#eaa04e"
  botanical-leaf: "#789576"
  grass-blade: "#92a97b"
typography:
  display:
    fontFamily: 'ShugeSans, "Microsoft YaHei", "PingFang SC", sans-serif'
    fontSize: "clamp(46px, 4.55vw, 78px)"
    fontWeight: 550
    lineHeight: 1.34
    letterSpacing: "-0.04em"
  headline:
    fontFamily: 'ShugeSans, "Microsoft YaHei", "PingFang SC", sans-serif'
    fontSize: "clamp(34px, 3.25vw, 48px)"
    fontWeight: 550
    lineHeight: 1.4
    letterSpacing: "-0.035em"
  title:
    fontFamily: 'ShugeSans, "Microsoft YaHei", "PingFang SC", sans-serif'
    fontSize: "18px"
    fontWeight: 500
  work-title:
    fontFamily: 'ShugeSans, "Microsoft YaHei", "PingFang SC", sans-serif'
    fontSize: "18px"
    fontWeight: 550
    lineHeight: 1.5
  body:
    fontFamily: 'ShugeSans, "Microsoft YaHei", "PingFang SC", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 2.05
  lead:
    fontFamily: 'ShugeSans, "Microsoft YaHei", "PingFang SC", sans-serif'
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.8
    letterSpacing: "-0.02em"
  label:
    fontFamily: 'ShugeSans, "Microsoft YaHei", "PingFang SC", sans-serif'
    fontSize: "12px"
    fontWeight: 400
  wordmark:
    fontFamily: 'ShugeSans, "Microsoft YaHei", "PingFang SC", sans-serif'
    fontSize: "22px"
    fontWeight: 550
    lineHeight: 1.1
    letterSpacing: "0.21em"
  wordmark-subtitle:
    fontFamily: 'ShugeSans, "Microsoft YaHei", "PingFang SC", sans-serif'
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.32em"
rounded:
  action: "6px"
  landmark: "4px"
  preview: "3px"
  circle: "50%"
  mobile-sheet: "16px 16px 0 0"
  lab-canvas: "8px"
spacing:
  compact: "8px"
  small: "12px"
  control-gap: "20px"
  section: "24px"
  row-gap: "28px"
  panel-top-inset: "38px"
  panel-inset: "46px"
  panel-bottom: "60px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.action}"
    padding: "15px 23px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-primary-day:
    backgroundColor: "{colors.day-primary}"
    textColor: "{colors.day-primary-text}"
  button-primary-day-hover:
    backgroundColor: "{colors.day-primary-hover}"
  button-secondary:
    padding: "12px 0"
    textColor: "{colors.text}"
  camera-button:
    backgroundColor: "#112d2d80"
    rounded: "{rounded.circle}"
    size: "44px"
  filter-tab:
    textColor: "#5a715d"
    padding: "10px 0"
  filter-tab-selected:
    textColor: "{colors.filter-ink}"
  work-preview:
    backgroundColor: "#dae0d1"
    rounded: "{rounded.preview}"
    width: "138px"
  feature-link:
    padding: "24px 30px 24px 0"
  content-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    width: "min(640px, 49vw)"
  content-panel-mobile:
    rounded: "{rounded.mobile-sheet}"
    width: "100%"
    height: "calc(100dvh - 85px)"
  landmark:
    backgroundColor: "{colors.landmark-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.landmark}"
    padding: "8px 15px"
  lab-canvas:
    backgroundColor: "{colors.lab-ground}"
    rounded: "{rounded.lab-canvas}"
---

# Design System: SHUGE Odyssey · 好奇心引力场

## Overview

**Creative North Star: "好奇心引力场"**

这是一颗值得靠近的植物小星球。松林夜色托起苔绿地表、瓷白建筑、陶土屋顶与杏色微光；细草、树冠、湖水、环轨和漂浮小岛把好奇心变成可探索的空间。世界有丰富细节，界面保持有秩序的留白。

阅读发生在瓷白纸面上。作品以有分隔线的横向条目展开，标题、摘要和链接形成清楚的阅读节奏。主操作保留温暖杏色与轻微圆角；轨道标识、圆形相机按钮和细线导航延续球体的形态。

**Evidence status:** 本文件提取自本版的 `dist/town.css`、`dist/town.html`、`dist/odyssey.js`、`dist/planet-model.js`、`dist/world-fx.js` 与 `dist/town-ui.js`；由 `README.md` 核对版本和实现边界。它更新独立 V3 副本中的旧版设计记录。当前记录是 **source-extracted / visual-unverified**：本轮浏览器控制超时，未获得 V3 实际截图、GPU 呈现、帧率或手机触摸验收证据。继承的 V2 截图与通过数量不证明本版效果。

**Key Characteristics:**

- 松林夜色、瓷白、鼠尾草绿与杏色组成连续的材质世界。
- 球面建筑、程序化植被、水面与传送门承担探索主体。
- 有分隔线的作品条目和浅色阅读面板提供稳定的信息层级。
- 普通链接、键盘入口、动态暂停与画质切换伴随三维探索。

## Colors

配色以自然材料和带绿色倾向的中性色为底，暖杏色标记主操作。frontmatter 是规范值；界面色和场景材质色分别保留源码定义。

### Primary

- **暖杏色**（`accent`）：傍晚主按钮、焦点轮廓、标题句点和当前导航。悬停使用 `accent-hover`。
- **白昼松绿**（`day-primary`）：白昼主按钮配合 `day-primary-text`，悬停使用对应变体。白昼普通强调使用独立的 `day-accent`。
- **纸面陶色**（`panel-accent`）：浅色面板标题中的小面积强调。

### Secondary

- **鼠尾草绿**（`sage` / `day-sage`）：外层文字的小面积标记。
- **苔绿地表**、**深林绿**、**鼠尾草材质**与**铜绿金属**：球面、植被、圆顶、环轨和建筑暗部。地表同时使用源码中的顶点色变化。
- **植物叶色**（`botanical-leaf`）与**草叶色**（`grass-blade`）：实例化植被的基础材质，实例色另在场景源码中定义。
- **筛选深绿**（`filter-ink` / `filter-rule`）：纸面筛选和实验标签的选中文字与下划线。

### Tertiary

- **屋顶陶土**（`terracotta-roof`）：建筑屋顶与局部结构。
- **暖窗金**与**发光琥珀**：窗面和自发光材料分别取色。白昼改变发光强度。
- **木色**与**石色**：窗框、门、轨道枕木、台阶与浮岛基底。

### Neutral

- **松林夜空**（`sky`）、**暖白文字**（`text`）和**灰鼠尾草文字**（`soft`）：傍晚页面底色与文字层。
- **瓷白纸面**（`paper`）、**松绿墨色**（`ink`）、**柔叶灰**（`muted`）与**纸面分隔线**（`rule`）：阅读面板、正文、说明与边线。
- **白昼天空**、**白昼墨色**与**白昼柔绿**：白昼替换外层页面的背景和文字。
- **瓷白建筑**与**实验深绿**：三维墙体和实验画布各有独立材料，不与阅读纸面合并。
- **深色地标面**（`landmark-surface`）：傍晚地标标签；白昼标签使用浅色覆盖值，记录在 sidecar。

**The Material Continuity Rule.** 新增界面和场景先复用对应材质角色；区分杏色主操作、陶土屋顶、阅读纸面与建筑墙体。

## Typography

**Display Font:** ShugeSans，本地 `fonts/outfit.woff2` 提供 Outfit variable 字重（100–900）。

**Body Font:** 同一字体栈，中文回退至 Microsoft YaHei、PingFang SC，再回退 sans-serif。

**Character:** 无衬线标题有适度紧凑字距，正文有宽松行高。拉丁字标保持清楚的字距；中文长段落使用自然系统字体回退。

### Hierarchy

- **Display**：首页标题采用 frontmatter 的 display。移动端使用（`clamp(32px, 8.8vw, 49px)` / 1.35），极窄屏为（32px）。
- **Headline**：面板标题采用 headline；移动端为（34px），极窄屏为（31px）。
- **Title / Work title**：入口标题使用 title，作品标题使用 work-title；作品标题随视口缩到（17px / 16px）。
- **Body**：阅读段落采用 body，最大行长（68ch）；移动端行高（2.03）。全局基础字号为（14px / 1.6），首页说明为（15px / 1.95）。
- **Lead**：面板引导段采用 lead；移动端为（19px），极窄屏为（18px）。
- **Label**：标注、说明与手机导航从 label 起；筛选、按钮和多数桌面导航在（13–14px）范围。
- **Wordmark**：主字标使用 wordmark；副字标 ODYSSEY 在所有断点保持（12px），移动端字距为（0.22em）。

**The Reading Floor Rule.** 功能文字保持源码现有的（12px）下限；窄屏身份行中（11px）的装饰性拉丁签名不作为新功能标签的模板。

## Layout

桌面以介绍和三维世界相邻构图：页头高（108px）、水平留白（4.7vw）；介绍位于顶部（23%）、宽（43%）且最大宽（660px）；三维舞台右对齐、宽（74%）。视口世界容器高（100dvh），最小高（730px）。底部地区导航和世界设置固定在舞台内部，相机控件沿右侧排列。

面板从右侧进入，桌面宽度由 frontmatter 定义；顶部操作区高（90px），独立滚动区内边距为（26px 46px 60px）。作品列表为单列横向条目，缩略图列宽（138px）、列间距（23px）、条目间距（28px）。面板打开时介绍退出交互、世界左移（24%），保留桌面世界与底部入口。

响应式覆盖按源码执行：超宽桌面（1600px 起）、中等桌面（1200px 以下）、窄桌面（761–950px）、手机（760px 以下）、极窄屏（370px 以下）。中等桌面面板宽（51vw），作品缩略图列依次变为（116px / 92px）。

手机水平留白（24px），页头高（85px）；介绍顶部（109px），世界顶部（342px）、高（480px）、宽（100%）。世界容器最小高（1000px），允许页面纵向滚动；极窄屏改为（965px），场景顶部（325px）、高（465px）、水平留白（20px）。手机面板从页头下方开始，占据剩余动态视口高度；面板操作区高（74px），正文内边距（21px 26px 47px），极窄屏水平内边距（22px）。手机作品条目继续使用缩略图与摘要并排布局，缩略图列宽（106px / 86px）。

可点击主入口和相机按钮主要使用（44px）及以上高度；作品文字链接和学校入口另有（36px / 30px）的较小高度，不应把现状描述为全页面触摸目标均已达标。低矮桌面允许纵向滚动。上述布局均为源码定义，尚未实际观察溢出、遮挡和触摸效果。

**The Direct Passage Rule.** 每个内容地区都有普通 hash 链接。阅读不能以旋转、射线命中、巡游或声音为前提。

## Elevation & Depth

世界深度来自球面几何、圆润建筑、半球光、太阳光、轮廓光、软阴影和材质。程序化草叶与树冠、着色水面、大气边缘、传送门、漂浮小岛、星点和虚线轨道共同组成空间。高画质叠加 bloom，并通过运行时混合设置保留透明场景的 alpha；这些是渲染意图和源码能力，实际光效仍需 GPU 验证。

界面的结构主要靠色面、文字与分隔线。阴影只为地标和阅读覆盖层提供分离，不把作品条目做成浮起卡片。

### Shadow Vocabulary

- **Landmark lift**（`0 8px 22px #04161245`）：傍晚场景标签。
- **Landmark daylight**（`0 8px 22px #2d5b3422`）：白昼场景标签。
- **Drawer separation**（`-24px 0 80px #03171355`）：桌面阅读面板。
- **Mobile sheet**（`0 -16px 55px #03171345`）：手机阅读面板上缘。
- **Status lift**（`0 12px 28px #071d2433`）：短暂状态通知。

**The World Carries Depth Rule.** 让几何、光照和覆盖关系承担主深度，作品条目使用纸面分隔线保持平稳。

## Shapes

球体、圆顶、轨道、鼠形传送门与圆形相机按钮构成识别形态。主按钮是小圆角矩形，次操作是带细底线的文字；地标是微圆角标签，筛选是下划线标签。具体圆角以 frontmatter 为准。手机阅读页只有顶部圆角，作品预览保持稳定的矩形与纵横比（1.3）。

建筑使用 RoundedBoxGeometry，倒角为最小边长的（0.09）倍，再与挤出屋顶、圆柱、圆顶和环组合。新增地标应先形成可辨识轮廓，再加入细节。

## Components

### Buttons

主按钮为暖杏色实底、深绿文字，默认最小高度（52px）；悬停上移（2px），按下回到原位。手机主次操作最小高（48px）。次操作保持透明底和细底线，通过文字强调变化反馈。白昼主按钮切换到松绿底和暖白字。

圆形相机按钮桌面（44px）见方，手机宽（40px）、高（44px），极窄屏宽（36px）。禁用态不响应操作且透明度（0.4）。面板关闭按钮始终为（44px）见方。

### Chips / Tabs

作品筛选与实验选择采用底线标签。默认文字为柔绿，选中项使用深绿文字与（2px）底线，通过 `aria-pressed` 表达状态；不要沿用旧版胶囊筛选。悬停变陶色，默认最小高（44px）。

### Cards / Containers

作品条目由左侧预览、右侧标题、摘要和链接构成，条目底部用细线分隔。预览悬停缩放（1.06），不增加包围阴影。普通入口行保持上边线和箭头，箭头悬停向右移动（4px）。

纸面内的可操作元素使用松绿墨色焦点轮廓（2px，偏移 5px），在浅色底上保持辨识度；世界外层继续使用强调色轮廓。

阅读面板是带独立滚动区的 aside。它没有声明模态语义或焦点陷阱；打开后焦点移到当前标题，Escape 或关闭操作返回，并尝试恢复仍可见触发者的焦点。桌面保留舞台操作，手机把被遮挡的舞台、底部导航、设置和相机设为 inert。

### Inputs / Fields

实验参数使用原生 range，宽（100%）、高（40px），有可见 label 和 output；数值使用等宽数字特性。实验画布为正方形、深绿底、轻圆角。页面没有自定义文本输入或验证错误样式，不为未实现状态添加规范。

### Navigation

页头是有细下划线的文字导航；地区导航使用线性图标与标签，当前项和悬停项变杏色并上移（2px）。手机地区入口垂直排列图标和文字。当前普通链接使用 `aria-current="page"`，所有主要内容保留直接链接。

地标标签由场景投影、朝向、边缘和相互遮挡决定可见性；隐藏标签同步设为 inert 和 `aria-hidden`。面板打开时隐藏地标。手机隐藏一个次要地标，仍保留普通地区导航。

### Planet, Camera & Motion

相机与输入定义详见 sidecar：场景视角使用透视相机、可调整距离；拖动阈值（4px），鼠标与触摸分别使用（0.007 / 0.010 rad/px），拖动时立即更新水平和竖直旋转。手势结束后的惯性按指数衰减，没有旧版的竖直硬限位。指针 ID、capture 和标签上的手势委托区分点击与拖动；方向键以（0.25 rad）调整。缩放由靠近、远离按钮提供；重置回到默认视角。

主动巡游用（24s）转过一圈并更新章节说明。一般相机过渡使用指数趋近，减少动态偏好下立即更新；主动巡游仍可启动。传送门短暂暗场后打开作品。暂停会取消巡游和惯性、冻结时间驱动的列车、植被、水面、星点与浮岛，手动操作和明确启动的巡游仍可绘制。声音默认关闭，用户开启后才发出简短操作音。

### Quality & Fallback

桌面初始精细画质、手机初始流畅画质。精细画质启用 bloom、草叶与花，采用更高像素比和阴影尺寸；流畅画质隐藏草叶与花，保留树木和主要建筑。源码有慢帧自动降档逻辑，手动画质选择后不再自动覆盖。画质机制不等于已经达到某个帧率。

隐藏页面跳过绘制；暂停且没有相机变化、脏标记或定向过渡时跳过渲染。模块加载、初始化、着色器或 WebGL context 失败显示阅读降级提示；无自动 context 恢复流程。文字导航继续提供内容入口，失效相机与巡游入口隐藏或禁用。状态提示为 `role="status"`，不阻断操作。

**The Evidence Boundary Rule.** 源码定义、CPU 场景检查、HTTP 可用、GPU 视觉、浏览器交互和实体手机体验分别记录；前一层不替后一层作验收结论。

## Do's and Don'ts

### Do:

- **Do** 复用松林夜色、瓷白、鼠尾草与杏色的材料角色，并区分界面色和场景材质。
- **Do** 保留单列横向作品条目、清楚的分隔线和舒展的阅读行高。
- **Do** 为内容提供普通链接、键盘入口和可见操作状态。
- **Do** 让功能文字保持 12px 下限，并分别检查手机触摸目标与阅读布局。
- **Do** 保留暂停、画质选择、减少动态与阅读降级路径。
- **Do** 把源码能力、运行时观察和视觉验收分别记录。

### Don't:

- **Don't** 用无意义粒子替代具有地标和植被细节的可探索世界。
- **Don't** 把作品条目恢复成一排有阴影的通用卡片或旧版胶囊筛选。
- **Don't** 让巡游、动画、射线命中或声音成为获取内容的前提。
- **Don't** 把概念场景描述为实景复刻，或把程序化动画描述为物理仿真。
- **Don't** 把继承的 V2 截图、静态检查或本文档描述为 V3 GPU 与手机体验已通过。
