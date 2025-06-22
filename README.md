# 多语言多币种支付演示

这是一个展示多语言和多币种支付功能的演示应用，使用 Stripe 和 i18next 构建。

## 功能特性

- 🌍 **多语言支持**: 支持英语、中文、西班牙语、法语
- 💰 **多币种支付**: 支持美元、欧元、人民币、日元、英镑
- 🔒 **安全支付**: 使用 Stripe 提供安全的支付处理
- 🎨 **现代化 UI**: 采用现代设计和流畅动画效果
- 📱 **响应式设计**: 适配移动端和桌面端

## 技术栈

- **React 18** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **Stripe** - 支付处理平台
- **i18next** - 国际化框架
- **styled-components** - CSS-in-JS 样式解决方案

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Stripe 支付

#### 获取 Stripe 密钥

1. 注册 [Stripe 账户](https://stripe.com)
2. 在 Stripe 仪表板中获取你的密钥：
   - 测试环境：`pk_test_...` (可发布密钥) 和 `sk_test_...` (密钥)
   - 生产环境：`pk_live_...` (可发布密钥) 和 `sk_live_...` (密钥)

#### 配置前端

1. 复制环境变量文件：
```bash
cp env.example .env
```

2. 编辑 `.env` 文件，添加你的 Stripe 可发布密钥：
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
REACT_APP_API_URL=http://localhost:3001
```

#### 配置后端（真实支付处理）

1. 进入 server 目录并安装依赖：
```bash
cd server
npm install
```

2. 创建后端环境变量文件：
```bash
echo "STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here" > .env
echo "PORT=3001" >> .env
```

3. 启动后端服务器：
```bash
npm start
```

#### 测试支付

使用 Stripe 提供的测试卡号进行测试：

- **成功支付**: `4242 4242 4242 4242`
- **需要验证**: `4000 0027 6000 3184`
- **余额不足**: `4000 0000 0000 9995`
- **过期日期**: 任何未来日期 (如 12/25)
- **CVC**: 任何 3 位数字 (如 123)

### 3. 运行应用

```bash
npm start
```

应用将在 http://localhost:3000 启动。

## 项目结构

```
src/
├── components/          # React 组件
│   ├── Header.tsx      # 页面头部和语言切换
│   ├── PaymentSection.tsx   # 支付表单
│   └── FeaturesSection.tsx  # 功能特性展示
├── i18n/               # 国际化配置
│   ├── config.ts       # i18next 配置
│   └── locales/        # 翻译文件
│       ├── en.json     # 英语翻译
│       ├── zh.json     # 中文翻译
│       ├── es.json     # 西班牙语翻译
│       └── fr.json     # 法语翻译
├── App.tsx             # 主应用组件
└── index.tsx           # 应用入口
```

## 支持的语言

- 🇺🇸 English
- 🇨🇳 中文 (简体)
- 🇪🇸 Español
- 🇫🇷 Français

## 支持的币种

- USD - 美元 ($29.99)
- EUR - 欧元 (€27.99)
- CNY - 人民币 (¥199.99)
- JPY - 日元 (¥3999)
- GBP - 英镑 (£24.99)

## 支付功能说明

### 🔒 安全性

- 所有支付数据通过 Stripe 的安全基础设施处理
- 敏感的卡片信息永远不会接触你的服务器
- 支持 3D Secure 和其他身份验证方法
- 符合 PCI DSS 标准

### 💳 支持的支付方式

- 信用卡和借记卡（Visa、Mastercard、American Express 等）
- 银行转账（根据地区而定）
- 数字钱包（Apple Pay、Google Pay 等）

### 🌍 国际支付

- 支持 135+ 种货币
- 自动汇率转换
- 本地化的支付方式

### 📊 支付状态

应用会处理以下支付状态：

- `processing` - 支付正在处理中
- `succeeded` - 支付成功完成
- `requires_action` - 需要客户进一步操作（如 3D Secure）
- `payment_failed` - 支付失败

## 生产环境部署

### 前端部署

```bash
npm run build
# 将 build 文件夹部署到你的静态文件托管服务
```

### 后端部署

确保在生产环境中：

1. 使用 HTTPS
2. 设置适当的 CORS 策略
3. 添加速率限制
4. 实施日志记录和监控
5. 使用生产环境的 Stripe 密钥

## 注意事项

- 在测试模式下，不会产生真实费用
- 在生产环境中使用真实的 Stripe 密钥
- 建议添加更多的错误处理和验证逻辑
- 考虑添加 webhook 处理支付状态更新

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License 