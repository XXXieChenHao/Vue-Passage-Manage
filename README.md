# Vue 项目 文章后台管理

## 项目介绍

>  一个类似于[今日头条自媒体头条号](<http://mp.toutiao.com/profile_v3/index>)的后台管理系统。



## 项目目标

能使用  Vue + Element组件库 + 系列技术栈 开发文章后台管理系统开发。



## 案例演示

在线地址：<http://ttmp.research.itcast.cn/>

> 账号：`13911111111`
>
> 密码：`246810`



## 项目进展

### 项目初始化

- [x] 使用 vulcli 脚手架进行 Vue 项目的构建
- [x] 使用 ESLint 进行代码规范检测
- [x] 引入 Element-UI 使用饿了吗组件

## login 页面

### 实现思路：

1. 配置路由 login 页面 
2. 页面基本构建
3. 表单验证
   1. 本地验证
   2. 远程验证
4. 人机交互
5. 页面跳转
   1. 成功： 保存 token 信息到本地，并跳转到后台页面
   2. 失败： 重新输入用户名和密码

### 学习回顾：

#### 知识总结：

- el-form 组件
  - **ref** 作为提交表单时整体验证（非自然验证）
  - **rules** 作为表单填写时的验证 （自然验证）
  - **prop**  设置需要校验的字段名
- 本地验证
  - 使用 element-ui 中的表单验证方法
    - 自然验证	在 data 中声明 rules 中的变量名， prop 绑定的数据名 ： [{ 验证规则 }]
    - 非自然验证 $refs.loginFormRef.validate 调用验证方法
- 验证码人机交互
  - 使用第三方人机交互验证【极验】
  - 配置 Web 客户端所需文件
  - 配置服务端 **SDK**
  - 绑定验证按钮，在 onReady 中开启验证框，在 onSuccess 中进行后台账号密码验证

#### 问题 bug：

1、运行在线打包时出现 Module build failed (from ./node_modules/babel-loader/lib/index.js):

​		依赖包没有安装 `yarn add babel-plugin-component -D`

2、在表单验证时，未给输入框绑定 v-model，以至于输入后并没有改变 data 中声明的变量

3、 验证码人机交互时 this 指针失去方向，由于使用了匿名函数，修改为箭头函数

## Home 页面

### 实现思路：

1. 使用 element-ui 组件搭建后台基本布局结构
2. 头部分栏布局
3. 左侧垂直菜单布局
4. 主体部分设置 占位符
5. 页面退出功能

### 学习回顾：

#### 知识总结：

- el-container 布局结构
  - el-aside 侧边栏
  - el-header 头部
  - el-main 主体部分
- el-menu 垂直菜单
  - el-menu-item  叶子菜单
  - el-submenu     拥有子级菜单
- 退出功能
  - 清除本地 token
  - 使用编程式导航跳转回登录页面

#### 问题 bug:

1、 el-aside 高度 100% 失效，el-aside 高度必须给到父盒子 el-container 上才会生效

2、 el-aside 左右伸缩更改宽度报错， 必须使用 bind: 否则无法进行简单语句运算



## artical 页面

### 实现思路：

1. el-card 组件进行页面分割
2. el-form 进行数据筛选
3. 后台获取数据渲染筛选频道
4. 后台获取数据进行文章展示
5. 分页系统

### 学习回顾：

#### 知识总结：

- 数据筛选
  - el-radio 中的 v-model 可以使用el-radio-group 统一保存数据
- 日期选择器
  - el-date-picker 变化时会有两个数值，但 v-model 只能绑定一个，所以使用一个中间数组获取两个数值，在监听器中对 开始 和 结束 日期分别进行赋值
- watch 监听
  - 普通监听
    - 指定数据被修改时则会触发函数，无法监听对象或者数组
  - 深度监听
    - 在筛选时进行深度监听，监听整个对象中任意数据的变化

- el-pagination 分页系统中带有两种方法，分别监听 页码 和 每页显示条数

#### 问题 bug：

1、 页面渲染时 el-table-column 中展示图片使用 img 的 src 失效，因为 el-table-column 使用作用域插槽，所以src 失效，应该先声明 slot-scope 后使用 声明变量.row 使用具体数据

2、 后台数据已获取，但页面渲染不出，el-table 必须绑定数据，使用 :data="数据名"



## 文章发布页面

### 实现思路：

1. 页面整体布局使用表单布局
2. 使用 quill-editor 富文本编辑器
3. 表单验证 
4. 发布按钮

### 学习回顾：

#### 知识总结：

- 富文本编辑器
  - 下载依赖包，引入 css 和模块，模块注册
  - 修改富文本编辑器的高度，使用深度选择器 /deep/  使组件不会自动产生 data-v-xxx 属性
- 发布按钮
  - 发布时需要传递 query 参数，true 为发布，false 为存入草稿
  - 传参时不仅需要传递需要发送的数据意外 还需要传递 { params：{draft： flag}}

#### 问题 bug:

1、 401 状态码，遇到了 401 报错，后来发现原来后台控制 token 失效只有 2个小时，所以重新登陆就好了，后续应该做一个检测，响应拦截，如果状态码为 401 则应该跳转回登陆页面



## 文章删除功能

### 实现思路：

1. 点击按钮调用删除函数并传入文章 id
2. 查看接口文档，发送删除文章 id
3. 做出页面提示和列表刷新

### 学习回顾：

#### 知识总结：

- 大数处理

  - 在删除 id 时发现需要删除的 id 与传入后台的 id 并不相同
  - 使用 `json-bigint` 第三方依赖包进行大数处理

- 转换器

  - 请求拦截器接收到的数据就已经被变型过了，所以应当在数据变型前进行大数处理

  - 引入依赖包 `import JSONbig from 'json-bigint'`

  - 使用转换器进行数据处理

    ```js
    axios.defaults.transformResponse = function (data) {
      if (data) {
        return JSONbig.parse(data)
      } else {
        return data
      }
    }
    ```

    

#### 问题 bug:

1、 删除的文章 id 并不是后台数据库中的 id

- 问题分析：
  - 后端服务器给我们返回的文章id已经大大超过了js可以表达的整型范畴，因而使用的时候会发生**变型**，文章的 id 是整形，已经超过了 JavaScript 的最大整数型
- 问题处理：
  - 后台修改整形为字符串类型，或者将文章 id 减少为 JS 最大数字类型之内
  - 使用 json-bigint 依赖包进行处理