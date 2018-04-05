<template>
  <div class="rating-select">
    <div class="rating-type">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" @click="toggleContent($event)" >
      <span class="icon-check_circle" :class="{'on': onlyContent===true }"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
    export default {
      name: "ratingselect",
      props:{
        ratings:{
          type: Array,
          default(){
            return [];
          }
        },
        selectType:{
          type:Number,
          default: ALL
        },
        onlyContent:{
          type: Boolean,
          default: false
        },
        desc:{
          type: Object,
          default(){
            return {
              all: '全部',
              positive: '满意',
              negative: '不满意'
            }
          }
        }
      },
      computed:{
        positives(){
           return this.ratings.filter((rating)=>{
            return rating.rateType === POSITIVE;
          });
        },
        negatives(){
          return this.ratings.filter((rating)=>{
            return rating.rateType === NEGATIVE;
          });
        }
      },
      methods:{
        select(type,event){
          if(!event._constructed){
            return;
          }
          this.selectType = type;
          //子组件修改某个变量的值后，通知父组件
          this.$dispatch('ratingtype.select',type);
        },
        toggleContent(event){
          if(!event._constructed){
            return;
          }
          this.onlyContent = !this.onlyContent;
          this.$dispatch('content.toggle',this.onlyContent);
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/index.styl"
.rating-select
  .rating-type
    padding 18px 0
    margin 0 18px
    border-1px(rgba(7,17,27,0.1))
    font-size 0
    .block
      padding 8px 12px
      border-radius 2px
      font-size 12px
      color: rgb(77,85,93)
      line-height 16px
      margin-right 8px
      .count
        margin-left 2px
        font-size 10px
    .positive
      background: rgba(0,160,220,0.2)
      &.active
        background: rgb(0,160,220)
        color: #fff
    .negative
      background rgba(77,85,93,0.2)
      &.active
        background rgb(77,85,93)
        color: #fff

  .switch
    padding 12px 18px
    line-height 24px
    color rgb(147,153,159)
    border-bottom 1px solid rgba(7,17,27,0.1)
    font-size 0
    .icon-check_circle
      display inline-block
      vertical-align top
      margin-right 4px
      font-size 24px
      &.on
        color #00c850
    .text
      display inline-block
      vertical-align top
      font-size 12px
</style>
