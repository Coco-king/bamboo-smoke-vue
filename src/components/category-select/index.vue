<template>
  <el-select v-model="categoryId" clearable placeholder="请选择分类" style="width: 100%;">
    <el-option
      v-for="item in categoryList"
      :key="item.id"
      :label="item.name"
      :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'categorySelect',
  props: {
    value: String
  },
  data() {
    return {
      categoryId: this.value,
      categoryList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$http({
        url: this.$http.adornUrl('/api/category/list'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.categoryList = data.list
        }
      })
    }
  },
  watch: {
    value(newVal) {
      this.categoryId = newVal
    },
    categoryId(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('input', this.categoryId)
      }
    }
  }
}
</script>

