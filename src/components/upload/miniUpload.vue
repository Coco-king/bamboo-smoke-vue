<template>
  <div>
    <el-upload
      action="https://bamboo-smoke-img.oss-cn-shanghai.aliyuncs.com"
      :data="dataObj"
      :show-file-list="false"
      list-type="picture"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
    >
      <img
        alt="头像"
        v-if="dialogVisible"
        :src="file.url"
        class="avatar"
      />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>
import { policy } from './policy'
import { getUUID } from '@/utils'

export default {
  name: 'singleUpload',
  props: {
    type: String
  },
  data() {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: ''
        // callback:'',
      },
      file: {
        name: '',
        url: ''
      },
      dialogVisible: false
    }
  },
  methods: {
    resetFields() {
      this.file = {}
      this.dialogVisible = false
    },
    init(url) {
      this.dialogVisible = true
      this.file.name = url ? url.substr(url.lastIndexOf('/') + 1) : ''
      this.file.url = url || ''
    },
    emitChange(val) {
      this.$emit('change', val)
    },
    handleRemove(file) {
      this.$http({
        url: this.$http.adornUrl('/api/oss/remove'),
        method: 'delete',
        data: this.$http.adornData({urls: [file.url]}, false)
      }).then(res => {
        if (res && res.code === 0) {
          this.emitChange('')
        }
      })
    },
    beforeUpload(file) {
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImg) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式！')
      }

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB！')
      }

      if (isImg && isLt2M) {
        let _self = this
        return new Promise((resolve, reject) => {
          policy(this.type)
          .then(response => {
            _self.dataObj.policy = response.data.policy
            _self.dataObj.signature = response.data.signature
            _self.dataObj.ossaccessKeyId = response.data.accessId
            _self.dataObj.key = response.data.dir + getUUID() + '_${filename}'
            _self.dataObj.dir = response.data.dir
            _self.dataObj.host = response.data.host
            resolve(true)
          })
          .catch(err => {
            reject(err)
          })
        })
      } else {
        return false
      }
    },
    handleUploadSuccess(res, file) {
      this.dialogVisible = true
      if (this.file.url) {
        this.$http({
          url: this.$http.adornUrl('/api/oss/remove'),
          method: 'delete',
          data: this.$http.adornData({urls: [this.file.url]}, false)
        }).then(res => {
        })
      }
      this.file = {
        name: file.name,
        url:
          this.dataObj.host +
          '/' +
          this.dataObj.key.replace('${filename}', file.name)
      }
      this.emitChange(this.file.url)
    }
  }
}
</script>
