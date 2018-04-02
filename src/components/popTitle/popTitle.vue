<template>
    <div class="pop-title">
      <div class="line"></div>
      <div class="text">{{text}}</div>
      <div class="line"></div>
    </div>
</template>

<script>
    export default {
      name: "pop-title",
      props:{
        text: {
          type: String
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.pop-title
  display flex
  width 80%
  margin 28px auto 24px auto
  .line
    position relative
    flex 1
    border-bottom 1px solid rgba(255,255,255,0.2)
    top -6px
  .text
    padding 0 12px
    line-height 14px
    font-size 14px
    font-weight 700
</style>
