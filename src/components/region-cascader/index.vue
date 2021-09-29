<template>
  <el-cascader
    style="width:100%"
    v-model="cascadeData"
    :options="regionList"
    :props="props"
    @change="handleChange"
    change-on-select
    clearable
    filterable
  ></el-cascader>
</template>

<script>
export default {
  name: 'region-cascader',
  props: {
    maxLevel: Number
  },
  data() {
    return {
      cascadeData: [],
      regionList: [],
      props: {
        checkStrictly: true,
        label: 'name',
        children: 'children',
        expandTrigger: 'hover'
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.resetFields()
      this.$http({
        url: this.$http.adornUrl('/api/region/list/tree'),
        method: 'get',
        params: this.$http.adornParams({maxLevel: this.maxLevel})
      })
      .then(({data}) => {
        if (data && data.code === 0) {
          this.regionList = data.list
        }
      })
    },
    initSelect(regionId, excludeSelf = true) {
      this.$http({
        url: this.$http.adornUrl(
          '/api/region/path'
        ),
        method: 'get',
        params: this.$http.adornParams({
          id: regionId,
          excludeSelf: excludeSelf
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.cascadeData = data.cascadeData
          this.handleChange(this.cascadeData)
        }
      })
    },
    handleChange(value) {
      this.$emit('change', value)
    },
    resetFields() {
      this.cascadeData = []
    }
  }
}
</script>
