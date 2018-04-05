<template>
    <div v-show="showFlag" class="food" transition="move" v-el:food>
      <div class="food-cont">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="cont">
          <h1 class="title">{{food.name}}</h1>
          <div class="extra">
            <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now-price">￥{{food.price}}</span><span v-show="food.oldPrice" class="old-price">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrap">
            <v-cartcontrol :food="food"></v-cartcontrol>
          </div>
          <div @click="addFirst($event)" class="add-cart" transition="addCartFade" v-show="!food.count || food.count === 0">加入购物车</div>
        </div>
        <v-split v-show="food.info"></v-split>
        <div class="food-introduce" v-show="food.info">
          <div class="title">商品介绍</div>
          <div class="text">{{ food.info }}</div>
        </div>
        <v-split></v-split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <v-rating-select :ratings="food.ratings" :select-type="selectType" :only-content="onlyContent" :desc="desc"></v-rating-select>
          <div class="rating-cont">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
                </div>
                <div class="time">{{rating.rateTime | formatdate}}</div>
                <p class="text" >
                  <span :class="{ 'icon-thumb_up': rating.rateType === 0,'icon-thumb_down':rating.rateType === 1 }"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import BScroll from "better-scroll"
  import Vue from "vue"
  import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
  import split from 'components/split/split.vue'
  import ratingselect from 'components/ratingselect/ratingselect.vue'

  import {formatDate} from "../../common/js/date";

  const ALL = 2;

    export default {
      name: "food",
      props:{
          food:{
            type: Object
          }
      },
      data(){
        return{
          showFlag: false,
          //  ratingselect组件中需要监控的变量
          selectType: ALL,
          onlyContent: false,
          desc:{
            all: '全部',
            positive: '推荐',
            negative: '吐槽'
          }
        }
      },
      methods:{
        show(){
          this.showFlag = true;

          this.selectType = ALL;
          this.onlyContent = false;

          this.$nextTick(()=>{
            if(!this.scroll){
              this.scroll = new BScroll(this.$els.food,{
                click:true
              })
            }else{
              this.scroll.refresh();
            }
          })
        },
        hide(){
          this.showFlag = false;
        },
        //第一次点击加入购物车
        addFirst(event){
          if(!event._constructed){
            return;
          }
          if(!this.food.count){
            /*派发一个事件，将DOM对象event.target作为这个事件的参数*/
            this.$dispatch('cart.add', event.target);
            Vue.set(this.food,'count',1);   //动态给传入组件的对象添加属性
          }
        },
        needShow(type,text){
          //console.log(type,text);
          if(this.onlyContent && !text){
            return false;
          }
          if(this.selectType === ALL){
            return true;
          }else{
            return type === this.selectType;
          }
        }
      },
      filters:{
        formatdate(time){
          let date = new Date(time);
          return formatDate(date,'yyyy-MM-dd hh:mm')
        }
      },
      events:{
        //监听子组件属性的变化，并更新当前组件的数据
        'ratingtype.select'(type){
          this.selectType = type;
          this.$nextTick(()=>{
            //在重新更新dom后，刷新调用betterScroll
            this.scroll.refresh();
          })
        },
        'content.toggle'(onlyContent){
          this.onlyContent = onlyContent;
          this.$nextTick(()=>{
            this.scroll.refresh();
          })
        }
      },
      components:{
        "v-cartcontrol":cartcontrol,
        "v-split":split,
        "v-rating-select": ratingselect
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index.styl"
.food
  position fixed
  left 0
  top 0
  bottom 48px
  z-index 48
  width 100%
  background #fff
  transition all 0.2s linear
  &.move-transition
    transform translate3d(0,0,0)
  &.move-enter,&.move-leave
    transform translate3d(100%,0,0)
  .image-header
    position relative
    width 100%
    height 0
    padding-top 100%
    img
      position absolute
      left 0
      top 0
      width 100%
      height 100%
    .back
      position absolute
      left 0
      top 10px
      .icon-arrow_lift
        display block
        padding 10px
        font-size 20px
        color #fff

  .cont
    position relative
    padding 18px
    .title
      line-height 14px
      font-weight 700
      font-size 14px
      color rgb(7,17,27)
      margin-bottom 8px
    .extra
      color rgb(147,153,159)
      height 10px
      line-height 10px
      font-size 10px
      margin-bottom 18px
      .count
        margin-right 12px
    .price
      line-height 24px
      .now-price
        margin-right 8px
        font-size 14px
        color rgb(240,20,20)
        font-weight 700
      .old-price
        vertical-align top
        text-decoration line-through
        font-size 10px
        font-weight normal
        color rgb(147,153,159)

    .cartcontrol-wrap
      position absolute
      right 12px
      bottom 12px
    .add-cart
      position absolute
      right 18px
      bottom 18px
      z-index 10
      height 24px
      line-height 24px
      padding 0 12px
      box-sizing border-box
      border-radius 12px
      font-size 10px
      color #fff
      background rgb(0,160,220)
      &.addCartFade-transition
        transition all 0.2s
        opacity 1
      &.addCartFade-enter,&.addCartFade-leave
        opacity 0
  .food-introduce
    padding 18px
    .title
      line-height 14px
      margin-bottom 6px
      font-size 14px
      color #07111b
    .text
      padding 0 8px
      line-height 24px
      color rgb(77,85,93)
      font-size 12px
  .rating
    padding-top 18px
    .title
      line-height 14px
      margin-left 18px
      font-size 14px
      color #07111b
    .rating-cont
      padding 0 18px
      .rating-item
        padding 16px 0
        border-1px(rgba(7,17,27,0.1))
        .user
          position absolute
          top 16px
          right 0
          font-size 0
          .name
            vertical-align top
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .avatar
            border-radius 50%
            margin-left 6px
            line-height 12px
        .time
          margin-bottom 6px
          line-height 12px
          font-size 10px
          color rgb(147,153,159)
        .text
          line-height 16px
          font-size 12px
          color rgb(7,17,27)
          .icon-thumb_up,.icon-thumb_down
            margin-right 4px
            line-height 16px
            font-size 12px
          .icon-thumb_up
            color rgb(0,160,220)
          .icon-thumb_down
            color rgb(147,153,159)
      .no-rating
        padding 16px 0
        font-size 12px
        color rgb(147,153,159)

</style>
