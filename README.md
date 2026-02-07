# 销售app会都

基于 Uniapp + Vue 3 + TypeScript 构建的跨平台销售管理应用。

## 技术栈

- **框架**: Uniapp + Vue 3 (Composition API)
- **语言**: TypeScript
- **状态管理**: Pinia
- **构建工具**: Vite
- **代码规范**: ESLint + Prettier
- **本地存储**: uni.storage
- **本地数据库**: SQLite (App 端)

## 项目结构

```
销售app会都/
├── src/
│   ├── api/              # API 接口层
│   ├── components/       # 组件
│   ├── composables/      # 组合式函数
│   ├── config/           # 配置管理
│   ├── layouts/          # 布局组件
│   ├── pages/            # 页面
│   ├── stores/           # 状态管理
│   ├── styles/           # 样式文件
│   ├── types/            # TypeScript 类型
│   └── utils/            # 工具函数
├── static/               # 静态资源
├── package.json          # 项目依赖
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── manifest.json         # 应用配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发

```bash
# H5 端
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin

# App 端
npm run dev:app
```

### 构建

```bash
# H5 端
npm run build:h5

# 微信小程序
npm run build:mp-weixin

# App 端
npm run build:app
```

### 代码规范

```bash
# 检查代码
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format
```

## 核心特性

- ✅ **高性能**: LRU 缓存、请求缓存、防抖节流
- ✅ **类型安全**: 完整的 TypeScript 类型定义
- ✅ **可扩展**: 模块化设计、依赖注入
- ✅ **代码规范**: ESLint + Prettier 自动格式化
- ✅ **本地数据库**: SQLite 支持 (App 端)
- ✅ **离线支持**: 本地存储 + 数据库

## 文档

- [Uniapp开发手册-架构与最佳实践.md](./Uniapp开发手册-架构与最佳实践.md)
- [基础设施使用指南.md](./基础设施使用指南.md)
- [API接口手册-小程序绑定功能.md](./API接口手册-小程序绑定功能.md)

## 开发规范

### Git 提交规范

遵循 Conventional Commits 规范：

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
perf: 性能优化
test: 测试
chore: 构建/工具变动
```

### 分支策略

- `main` - 主分支，稳定版本
- `develop` - 开发分支
- `feature/*` - 功能分支
- `bugfix/*` - 修复分支

## 许可证

MIT

---

**开发者**: Your Name
**最后更新**: 2026-02-07
