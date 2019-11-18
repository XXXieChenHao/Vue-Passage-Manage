<template>
  <el-select v-model="chid" clearable>
    <el-option v-for="item in channel_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
  </el-select>
</template>

<script>
export default {
  data () {
    return {
      channel_list: [],
      chid: ''
    }
  },
  props: {
    cid: {
      default: 0
    }
  },
  watch: {
    cid (newV) {
      this.chid = newV
    },
    chid: function (newV) {
      this.$emit('slt', this.chid)
    }
  },
  created () {
    this.getChannelList()
  },
  methods: {
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(res => {
          if (res.data.message === 'OK') {
            this.channel_list = res.data.data.channels
          }
        })
        .catch(() => {
          this.$message.error('出错啦')
        })
    }
  }
}
</script>
