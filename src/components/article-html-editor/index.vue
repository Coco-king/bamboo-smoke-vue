<template lang="html">
  <div id="editor" class="text"></div>
</template>

<script>
import E from 'wangeditor'
import highlight from 'highlight.js'

export default {
  name: 'articleHtmlEditor',
  data() {
    return {
      uploadPath: `${window.SITE_CONFIG.baseUrl}/api/oss/upload/${this.type}`,
      editor: null,
      info_: null
    }
  },
  mounted() {
    this.editor = new E('#editor')
    this.setEditor()
    this.editor.txt.html(this.value)
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    }
  },
  watch: {
    value: function (value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value)
      }
    }
  },
  methods: {
    clearContent() {
      this.editor.txt.clear()
      this.info_ = null
    },
    setEditor() {
      // http://192.168.2.125:8080/admin/storage/create
      this.editor.config.showFullScreen = true
      this.editor.config.uploadImgShowBase64 = true // base 64 存储图片
      this.editor.config.uploadImgServer = this.uploadPath // 配置服务器端地址
      this.editor.config.uploadImgHeaders = {} // 自定义 header
      this.editor.config.uploadFileName = 'file' // 后端接受上传文件的参数名
      this.editor.config.uploadImgMaxSize = 5 * 1024 * 1024 // 将图片大小限制为 2M
      this.editor.config.uploadImgMaxLength = 3 // 限制一次最多上传 3 张图片
      this.editor.config.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

      // 配置代码高亮
      this.editor.highlight = highlight

      // 配置菜单
      this.editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo', // 重复
        'fullscreen' // 全屏
      ]

      /* this.editor.config.uploadImgHooks = {
        fail: (xhr, editor, result) => {
          // 插入图片失败回调
        },
        success: (xhr, editor, result) => {
          // 图片上传成功回调
        },
        timeout: (xhr, editor) => {
          // 网络超时的回调
        },
        error: (xhr, editor) => {
          // 图片上传错误的回调
        },
        customInsert: (insertImg, result, editor) => {
          // 图片上传成功，插入图片的回调
        }
      } */
      this.editor.config.onchange = html => {
        this.info_ = html
        this.$emit('change', this.info_) // 将内容同步到父组件中
      }
      // 创建富文本编辑器
      this.editor.create()
    }
  }
}
</script>
