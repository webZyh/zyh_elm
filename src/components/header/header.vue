<template>
    <div class="header">
      <div class="cont-wrap">
        <div class="logo">
          <img width="64" height="64" :src="seller.avatar">
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <div v-if="seller.supports" class="sales">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div v-if="seller.supports" class="sales-count" @click="showDetail()">
          <div class="count">{{seller.supports.length}}个</div>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <div class="bulletin" @click="showDetail()">
        <div class="bulletin-icon"></div><span class="text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <div class="background">
        <img :src="seller.avatar" width="100%" height="100%" alt="">
      </div>
      <div class="detial" v-show="detailShow" transition="fade">
        <div class="detail-wrap clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrap">
              <v-star :size="48" :score="seller.score"></v-star>
            </div>
            <v-pop-title :text="title1"></v-pop-title>
            <ul v-if="seller.supports" class="sales">
              <li v-for="item in seller.supports" class="sales-item">
                <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
                <span class="text">{{seller.supports[$index].description}}</span>
              </li>
            </ul>
            <v-pop-title :text="title2"></v-pop-title>
            <div class="notice">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="closeDetail()">
          <i class="icon-close"></i>
        </div>
      </div>
    </div>
</template>

<script>
  import star from 'components/star/star';
  import poptitle from 'components/poptitle/poptitle';

    export default {
      name: "header",
      props:{
        seller: {
          type: Object
        }
      },
      data(){
        return {
          detailShow :false,
          title1 : "优惠信息",
          title2 : "商家公告"
        }
      },
      methods: {
        showDetail(){
          this.detailShow = true;
        },
        closeDetail(){
          this.detailShow = false;
        }
      },
      created(){
        this.classMap = ["decrease","discount","guarantee","invoice","special"];
      },
      components:{
        "v-star": star,
        "v-pop-title": poptitle
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" >
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/base.styl"

.header
  color: #fff
  background-color rgba(7,17,27,0.5)
  position: relative
  overflow hidden
  .cont-wrap
    position relative
    padding: 24px 12px 18px 24px
    font-size  0
    .logo
      display inline-block
      vertical-align top
      margin-right 16px
      img
        border-radius 2px
    .content
      display inline-block
      .title
        font-size 16px
        margin-top 2px
        .brand
          display inline-block
          vertical-align top
          width: 30px
          height: 18px
          bg-image("brand")
          background-size 30px 18px
          background-repeat no-repeat
        .name
          margin-left 6px
          line-height: 18px
          font-weight bold
      .description
        line-height 12px
        margin 8px 0 10px 0
        font-size 12px
      .sales
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 4px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image("decrease_1")
          &.discount
            bg-image("discount_1")
          &.guarantee
            bg-image("guarantee_1")
          &.invoice
            bg-image("invoice_1")
          &.special
            bg-image("special_1")
        .text
          font-size 10px
          line-height 12px
    .sales-count
      position absolute
      right 12px
      bottom 16px
      border-radius 14px
      padding 0 8px
      height 24px
      line-height 24px
      background-color rgba(0,0,0,0.2)
      text-align center
      .count
        display inline-block
        vertical-align top
        font-size 10px
        margin-top 1px
      .icon-keyboard_arrow_right
        margin-left 2px
        line-height 24px
        font-size 10px
  .bulletin
    position relative
    padding 0 22px 0 12px
    height 28px
    line-height 28px
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    background-color: rgba(7,17,27,0.2)
    .bulletin-icon
      display inline-block
      vertical-align top
      margin-top 8px
      width 22px
      height 12px
      bg-image("bulletin")
      background-size 22px 12px
      background-repeat no-repeat
    .text
      vertical-align top
      margin 0 4px
      font-size 10px
    .icon-keyboard_arrow_right
      position absolute
      line-height 12px
      top 8px
      right 12px
      font-size 10px

  .background
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    z-index -1
    filter blur(10px)
  .detial
    z-index 100
    position fixed
    left 0
    top 0
    width 100%
    height 100%
    overflow auto
    transition all 0.5s
    backdrop-filter blur(10px)
    &.fade-transition
      opacity 1
      background rgba(7,17,27,0.8)
    &.fade-enter,&.fade-leave
      opacity 0
      background rgba(7,17,27,0)
    .detail-wrap
      min-height 100%
      width 100%
      .detail-main
        padding-bottom 64px
        margin-top 64px
        .name
          text-align center
          line-height 16px
          font-size 16px
          font-weight 700
        .star-wrap
          margin-top 16px
          padding 4px 0
          text-align center
        .sales
          .sales-item
            width 80%
            margin auto
            font-size 0
            .icon
              display inline-block
              vertical-align top
              width 16px
              height 16px
              margin 0 6px 12px 12px
              &:last-child
                margin-bottom 0
              background-size 16px 16px
              background-repeat no-repeat
              &.decrease
                bg-image("decrease_2")
              &.discount
                bg-image("discount_2")
              &.guarantee
                bg-image("guarantee_2")
              &.invoice
                bg-image("invoice_2")
              &.special
                bg-image("special_2")
            .text
              line-height 16px
              font-size 12px
        .notice
          width 80%
          margin 0 auto
          .content
            padding 0 12px
            line-height 24px
            font-size 12px
    .detail-close
      position relative
      margin -64px auto 0 auto
      clear both
      width 32px
      height 32px
      font-size 32px
</style>
