<template>
    <div class="star" :class="starType">
      <span class="star-item" v-for="itemClass in itemClasses" :class="itemClass" track-by="$index"></span>
    </div>
</template>

<script>

    const LENGTH = 5;
    const CLS_ON = 'on';
    const CLS_HALF = 'half';
    const CLS_OFF = 'off';
    export default {
      name: "star",
      props: {
        size:{
          type : Number
        },
        score : {
          type : Number
        }
      },
      computed:{
        //控制评星的尺寸大小
        starType(){
          return 'star-' + this.size
        },
        itemClasses(){
          let result = [];
          let score = Math.floor(this.score*2) / 2;

          //整数部分为几就是几颗星
          let integer = Math.floor(score);
          //循环添加全星 on 这个类
          for(let i=0; i<integer; i++){
            result.push(CLS_ON);
          }
          //假如有小数的话，小数部分为半颗星，且只有一个
          let decimal = (score%1 !== 0);  //bealoon型
          if(decimal){
            result.push(CLS_HALF)
          }
          // 当result数组没有到达5时，剩下填充为空的星星
          while(result.length < LENGTH){
            result.push(CLS_OFF);
          }
          return result;

        }
      }
    }

</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .star
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        &:last-child
          margin-right 0
        background-size 20px 20px
        &.on
          bg-image("star48_on")
        &.half
          bg-image("star48_half")
        &.off
          bg-image("star48_off")

    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 16px
        &:last-child
          margin-right 0
        background-size 15px 15px
        &.on
          bg-image("star36_on")
        &.half
          bg-image("star36_half")
        &.off
          bg-image("star36_off")

    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        &:last-child
          margin-right 0
        background-size 10px 10px
        &.on
          bg-image("star24_on")
        &.half
          bg-image("star24_half")
        &.off
          bg-image("star24_off")

</style>
