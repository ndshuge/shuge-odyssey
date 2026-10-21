# SHUGE Odyssey · 好奇心引力场

独立的个人主页 V3.1：保留可探索的小镇和个人档案，新增「奇想宇航局」。七个真实作品组成可选择的轨道星系；造星工坊可以生成漂浮群岛、棱晶和丝绸环星，为星球命名、保存纪念图，并用链接重现同一种子。

**网站地址**：[ndshuge.github.io/shuge-odyssey](https://ndshuge.github.io/shuge-odyssey/)。首页点击「打开奇想宇宙」，即可进入作品星图和造星工坊。最新发布凭据与验证范围见 [STATUS.md](STATUS.md)。

V3.1 已部署；[GitHub Actions](https://github.com/ndshuge/shuge-odyssey/actions/runs/39696451625) 自动检查全部通过，线上 14 个关键资源与发布提交一致。

生成过程在设备上完成；最后一颗星存于本浏览器的 localStorage。分享链接包含星球的名字、形态和种子，复制后可以发给别人。1600×1000 PNG 为同种子生成的纪念插画，与可旋转的 3D 场景分别绘制。

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
npm run check:forge
npm run check:voyage
# 保持本地服务运行后，在另一终端执行：
npm run check:http
```

`check` 检查 JavaScript 语法；`check:scene` 使用真实 Three.js 对象及渲染器替身检查原小镇；`check:forge` 检查种子确定性、几何预算、资源释放和海报绘图；`check:voyage` 检查轨道选择、延迟分配、暂停和视图切换；`check:http` 检查静态资源与 HTTP，可用 `TEST_BASE_URL` 指定目标。CPU 和 HTTP 检查不能证明 GPU 效果、帧率或真实触摸体验。

本次已在浏览器中操作星图、三种造星形态、命名、导图、复制链接、零号种子恢复与浏览器返回；详见 [Voyage 浏览器记录](evidence/voyage-browser.json)。截图接口不可用，实际像素美感、实体手机手势与帧率仍未验收。继承的 `check-browser.cjs` 属于旧版检查，不能替代本次记录。

当前 V3 的检查结果以本次实际运行和 [STATUS.md](STATUS.md) 为准。继承的 `evidence/` 文件和旧版通过数量属于历史记录，不能作为新版的验收结果。

## 发布到 GitHub Pages

[Pages 工作流](.github/workflows/pages.yml)仅允许在 `ndshuge/shuge-odyssey` 仓库执行。它在 `main` 推送或手动触发时运行语法、原小镇、造星、模式生命周期及本地 HTTP 检查，通过后只上传 `dist/`，使用 `github-pages` 环境部署。

首次发布需创建独立仓库，将仓库 **Settings → Pages → Source** 设为 **GitHub Actions**，再推送本版。正式上线以成功的 Actions 部署及返回 URL 为准，之后仍需检查线上浏览器与手机体验。[GitHub Pages 官方工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## 实现与边界

纯 HTML / CSS / JavaScript，`dist/` 是唯一发布目录。Three.js r180 与本地 addons 提供 3D 场景和后期光效；星球、海洋、大气、传送门和植被均为创意场景，并非学校实景。无 WebGL 时仍应保留可阅读内容。第三方许可随站点保留在 `dist/vendor/` 与 `dist/fonts/`。

作品介绍与链接来自公开项目；公开简介及联系方式经主页所有者授权。仓库文档不收录本机个人配置、凭据或设备资料。
