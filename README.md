# SHUGE Odyssey · 好奇心引力场

独立的个人主页 V3：以可探索的 Three.js 小星球连接关于我、校园、生活、作品、创意实验与联系方式。本版在 Little Universe 的基础上升级星球场景、光效、镜头和界面。

**新版预定地址**：[ndshuge.github.io/shuge-odyssey](https://ndshuge.github.io/shuge-odyssey/)；正式部署与线上验收尚待确认。

本项目使用独立仓库 `ndshuge/shuge-odyssey`。先前版本继续保留：

- [V2 · SHUGE Little Universe](https://ndshuge.github.io/shuge-little-universe/)
- [V1 · ChatGPT Sites](https://curious-practice-1017.ndshuge.chatgpt.site)（原站登录权限依平台设置）

## 本地运行

使用 Node.js 22，无需 `npm install`，没有运行时 CDN。入口为 `dist/index.html`；Three.js、addons、字体与图片均从站内加载。

```sh
npm start
```

默认打开 [127.0.0.1:5197](http://127.0.0.1:5197/)，也可通过环境变量 `PORT` 指定端口。

```sh
npm run check
npm run check:scene
# 保持本地服务运行后，在另一终端执行：
npm run check:http
```

`check` 检查 JavaScript 语法；`check:scene` 使用真实 Three.js 对象及渲染器替身检查场景构造和控件；`check:http` 检查静态资源与 HTTP，可用 `TEST_BASE_URL` 指定目标。CPU 和 HTTP 检查不能证明 GPU 效果、帧率或真实触摸体验。

可选浏览器复验：将 `PLAYWRIGHT_MODULE_PATH` 指向本机已有的 Playwright 模块目录，再执行 `node scripts/check-browser.cjs`；使用 `BASE_URL` 可检查指定地址。生产运行无需 Playwright。新版的桌面、窄屏、WebGL、键盘、降低动态效果与手机手势应分别验收；实体 iPhone Safari 的触摸手感需真机确认。

当前 V3 的检查结果以本次实际运行和 [STATUS.md](STATUS.md) 为准。继承的 `evidence/` 文件和旧版通过数量属于历史记录，不能作为新版的验收结果。

## 发布到 GitHub Pages

[Pages 工作流](.github/workflows/pages.yml)仅允许在 `ndshuge/shuge-odyssey` 仓库执行。它在 `main` 推送或手动触发时运行语法、CPU 场景与本地 HTTP 检查，通过后只上传 `dist/`，使用 `github-pages` 环境部署。

首次发布需创建独立仓库，将仓库 **Settings → Pages → Source** 设为 **GitHub Actions**，再推送本版。正式上线以成功的 Actions 部署及返回 URL 为准，之后仍需检查线上浏览器与手机体验。[GitHub Pages 官方工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## 实现与边界

纯 HTML / CSS / JavaScript，`dist/` 是唯一发布目录。Three.js r180 与本地 addons 提供 3D 场景和后期光效；星球、海洋、大气、传送门和植被均为创意场景，并非学校实景。无 WebGL 时仍应保留可阅读内容。第三方许可随站点保留在 `dist/vendor/` 与 `dist/fonts/`。

作品介绍与链接来自公开项目；公开简介及联系方式经主页所有者授权。仓库文档不收录本机个人配置、凭据或设备资料。
