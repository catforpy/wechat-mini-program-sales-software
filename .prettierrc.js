/**
 * Prettier 配置文件
 */

module.exports = {
  // 单行最大长度
  printWidth: 100,

  // 缩进空格数
  tabWidth: 2,

  // 使用空格缩进
  useTabs: false,

  // 语句末尾添加分号
  semi: true,

  // 使用单引号
  singleQuote: true,

  // 对象属性引号
  quoteProps: 'as-needed',

  // JSX 使用单引号
  jsxSingleQuote: true,

  // 尾随逗号
  trailingComma: 'es5',

  // 对象大括号内部空格
  bracketSpacing: true,

  // 多行 HTML 元素 > 单独一行
  bracketSameLine: false,

  // 箭头函数参数括号
  arrowParens: 'always',

  // 换行符
  endOfLine: 'lf',

  // Vue 文件缩进 <script> 和 <style>
  vueIndentScriptAndStyle: false,

  // 单个属性的标签换行
  singleAttributePerLine: false
}
