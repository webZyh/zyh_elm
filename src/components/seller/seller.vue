<template>
    <div class="seller" v-el:seller>
      <div class="seller-cont">
        <div class="overview">
          <h1 class="title">{{seller.name}}</h1>
          <div class="desc border-1px">
            <v-star class="star" :size="36" :score="seller.score"></v-star>
            <span class="text">({{seller.ratingCount}})</span>
            <span class="text">月售{{seller.sellCount}}单</span>
          </div>
          <ul class="info">
            <li class="block">
              <h2 class="text">起送价</h2>
              <div class="cont">
                <span class="num">{{seller.minPrice}}</span><span class="units">元</span>
              </div>
            </li>
            <li class="block">
              <h2 class="text">商家配送</h2>
              <div class="cont">
                <span class="num">{{seller.deliveryPrice}}</span><span class="units">元</span>
              </div>
            </li>
            <li class="block">
              <h2 class="text">平均配送时间</h2>
              <div class="cont">
                <span class="num">{{seller.deliveryTime}}</span><span class="units">分钟</span>
              </div>
            </li>
          </ul>
          <div class="favorite" @click="toggleFavorite($event)">
            <span class="icon-favorite" :class="{'active': favorite}"></span>
            <div class="favorite-text">{{favoriteText}}</div>
          </div>
        </div>
        <v-split></v-split>
        <div class="bulletin" v-show="seller.bulletin">
          <div class="title">公告与活动</div>
          <div class="cont-wrap border-1px">
            <p class="cont">{{seller.bulletin}}</p>
          </div>
          <ul v-if="seller.supports" class="sales">
            <li v-for="item in seller.supports" class="sales-item border-1px">
              <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
              <span class="text">{{seller.supports[$index].description}}</span>
            </li>
          </ul>
        </div>
        <v-split></v-split>
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <div class="pic-wrap" v-el:pic-wrap>
            <ul class="pic-list" v-el:pic-list>
              <li class="pic-item" v-for="pic in seller.pics">
                <img width="120" height="90" :src="pic" alt="">
              </li>
            </ul>
          </div>
        </div>
        <v-split></v-split>
        <div class="infos">
          <div class="title border-1px">商家信息</div>
          <ul>
            <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
  import BScroll from "better-scroll"
  import star from "components/star/star"
  import split from "components/split/split"

  import {saveToLocal,loadFromLocal} from '../../common/js/store'
    export default {
      name: "seller",
      props:{
        seller:{
          type:Object
        }
      },
      data(){
        return{
          //favorite :false
          favorite: (() => {
            return loadFromLocal(this.seller.id, 'favorite', false);
          })()
        }
      },
      computed: {
        favoriteText(){
          return this.favorite? '已收藏': '收藏'
        }
      },
      created(){
        this.classMap = ["decrease","discount","guarantee","invoice","special"];
      },
      watch:{
        'seller'(){       //观测seller属性变化时执行以下方法
          this._initScroll();
          this._initPics();
        }
      },
      ready(){  //dom加载完成会调用该钩子
        this._initScroll();
        this._initPics();
      },
      methods:{
        _initScroll(){
          if(!this.scroll){
            this.scroll = new BScroll(this.$els.seller,{
              click: true
            })
          }else{
            this.scroll.refresh();
          }
        },
        _initPics(){
          //计算pic-list的宽度（ul）
          if(this.seller.pics){
            let picW = 120;
            let margin = 6;
            let ulW = (picW+margin)*this.seller.pics.length - margin ;
            //赋值给ul
            this.$els.picList.style.width = ulW + 'px';

            //调用BScroll
            this.$nextTick(()=>{
              if(!this.picScroll){
                this.picScroll = new BScroll(this.$els.picWrap,{
                  scrollX : true,
                  eventPassthrough: 'vertical'
                })
              }else{
                this.picScroll.refresh();
              }
            })
          }
        },
        toggleFavorite(event){
          if(!event._constructed){
            return
          }
          this.favorite = !this.favorite
          saveToLocal(this.seller.id, 'favorite', this.favorite)
        }
      },
      components:{
        "v-star": star,
        "v-split": split
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index.styl"
.seller
  position absolute
  top 174px
  bottom 0
  width 100%
  overflow hidden
  .overview
    padding 18px
    .title
      line-height 14px
      margin-bottom 8px
      color rgb(7,17,27)
      font-size 14px
    .desc
      font-size 0
      padding-bottom 18px
      border-1px(rgba(7,17,27,0.1))
      .star
        display inline-block
        vertical-align top
        margin-right 8px
      .text
        margin-right 12px
        line-height 18px
        color rgb(77,85,93)
        font-size 10px
    .info
      display flex
      margin-top 18px
      .block
        flex 1
        text-align center
        border-right 1px solid rgba(7,17,27,0.1)
        &:last-child
          border-right none
        .text
          line-height 10px
          color rgb(147,153,159)
          font-size 10px
          margin-bottom 4px
        .num
          line-height 24px
          color rgb(7,17,27)
          font-size 24px
        .units
          font-size 10px
    .favorite
      position absolute
      right 11px
      top 18px
      width 50px
      text-align center
      .icon-favorite
        display block
        margin-bottom 4px
        line-height 24px
        font-size 24px
        color #d4d6d9
        &.active
          color rgb(240,20,20)
      .favorite-text
        line-height 10px
        font-size 10px
        color rgb(77,85,93)
  .bulletin
    padding 18px 18px 0 18px
    .title
      margin-bottom 8px
    .cont-wrap
      padding 0 12px
      padding-bottom 16px
      border-1px(rgba(7,17,27,0.1))
      .cont
        line-height 24px
        color rgb(240,20,20)
        font-size 12px
    .sales
      .sales-item
        padding 16px 12px
        border-1px(rgba(7,17,27,0.1))
        font-size 0
        .icon
          display inline-block
          vertical-align top
          width 16px
          height 16px
          margin-right 6px
          &:last-child
            margin-bottom 0
          background-size 16px 16px
          background-repeat no-repeat
          &.decrease
            bg-image("decrease_4")
          &.discount
            bg-image("discount_4")
          &.guarantee
            bg-image("guarantee_4")
          &.invoice
            bg-image("invoice_4")
          &.special
            bg-image("special_4")
        .text
          line-height 16px
          font-size 12px
          color rgb(7,17,27)
  .pics
    padding 18px
    .title
      margin-bottom 12px
      line-height 14px
      color rgb(7,17,27)
      font-size 14px
    .pic-wrap
      width 100%
      overflow hidden
      white-space nowrap
      .pic-list
        font-size 0
        .pic-item
          display inline-block
          margin-right 6px
          width 120px
          height 90px
          &:last-child
            margin-right 0
  .infos
    padding 18px 18px 0 18px
    color rgb(7,17,27)
    .title
      padding-bottom 12px
      line-height 14px
      border-1px(rgba(7,17,27,0.1))
      font-size 14px
    .info-item
      padding 16px 12px
      line-height 16px
      border-1px(rgba(7,17,27,0.1))
      &:last-child
        border-none()
</style>
