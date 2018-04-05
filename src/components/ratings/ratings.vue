<template>
    <div class="ratings" v-el:ratings>
      <div class="ratings-cont"  >
        <div class="overview">
          <div class="overview-left">
            <h1 class="score">{{seller.score}}</h1>
            <div class="title">综合评分</div>
            <div class="rank">高于周边商家{{seller.rankRate}}%</div>
          </div>
          <div class="overview-right">
            <div class="score-wrap">
              <span class="title">服务评分</span>
              <v-star :size="36" :score="seller.serviceScore"></v-star>
              <span class="score">{{seller.serviceScore}}</span>
            </div>
            <div class="score-wrap">
              <span class="title">商品评分</span>
              <v-star :size="36" :score="seller.foodScore"></v-star>
              <span class="score">{{seller.foodScore}}</span>
            </div>
            <div class="delivery-wrap">
              <span class="title">送达时间</span>
              <span class="time">{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <v-split></v-split>
        <v-rating-select :ratings="ratings" :select-type="selectType" :only-content="onlyContent" ></v-rating-select>
        <div class="ratings-wrap">
          <ul>
            <li  v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" class="rating-item border-1px">
              <div class="avatar-wrap">
                <img width="28" height="28" :src="rating.avatar" >
              </div>
              <div class="rating-cont">
                <h1 class="name">{{rating.username}}</h1>
                <div class="star-wrap">
                  <v-star :size="24" :score="rating.score"></v-star>
                  <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                </div>
                <p class="text">{{rating.text}}</p>
                <div class="recommend" v-show="rating.recommend.length">
                  <span class="icon-thumb_up"></span>
                  <span v-for="item in rating.recommend" class="item">{{item}}</span>
                </div>
                <div class="time">{{rating.rateTime | formatD}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import star from 'components/star/star';
  import split from 'components/split/split.vue'
  import ratingselect from 'components/ratingselect/ratingselect.vue'

  import {formatDate} from "../../common/js/date";

  const ALL  = 2;
  const ERR_NO = 0;
    export default {
      name: "ratings",
      props:{
          seller:{
            type:Object
          }
      },
      data(){
        return {
          //  ratingselect组件中需要监控的变量
          ratings:[],
          selectType: ALL,
          onlyContent: false
        }
      },
      created(){
        this.$http.get('api/ratings').then((res)=>{
          res = res.body
          if(res.errno === ERR_NO){
            this.ratings = res.data;
            this.$nextTick(()=>{
              this.scroll = new BScroll(this.$els.ratings,{
                click: true
              })
            })
          }
        });
      },
      methods:{
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
      filters:{
        formatD(time){
          let date = new Date(time);
          return formatDate(date,'yyyy-MM-dd hh:mm');
        }
      },
      components:{
        "v-star" : star,
        "v-split": split,
        "v-rating-select": ratingselect
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/index.styl"
.ratings
  position absolute
  top 174px
  bottom 0
  width 100%
  overflow hidden
  .overview
    display flex
    padding 18px 0
    .overview-left
      flex 0 0 138px
      width 138px
      border-right 1px solid rgba(7,17,27,0.1)
      text-align center
      @media only screen and (max-width:320px)
        flex 0 0 110px
        width 110px
      .score
        margin-bottom 6px
        line-height 28px
        color rgb(255,153,0)
        font-size 24px
      .title
        margin-bottom 8px
        line-height 12px
        color rgb(7,17,27)
        font-size 12px
      .rank
        padding-bottom 6px
        line-height 10px
        font-size 10px
        color rgb(147,153,159)
    .overview-right
      flex 1
      padding-left 24px
      @media only screen and (max-width 320px)
        padding-left 6px
      .score-wrap
        margin-bottom 8px
        font-size 0
        .title
          display inline-block
          vertical-align top
          line-height 18px
          font-size 12px
          color rgb(7,17,27)
        .star
          display inline-block
          vertical-align top
          margin 0 12px
        .score
          display inline-block
          vertical-align top
          line-height 18px
          font-size 12px
          color rgb(255,153,0)
      .delivery-wrap
        font-size 0
        .title
          line-height 18px
          margin-right 12px
          font-size 12px
          color rgb(7,17,27)
        .time
          line-height 18px
          font-size 12px
          color rgb(147,153,159)
  .ratings-wrap
    padding 0 18px
    .rating-item
      display: flex
      padding 18px 0
      border-1px(rgba(7,17,27,0.1))
      .avatar-wrap
        flex 0 0 28px
        width 28px
        margin-right 12px
        img
          border-radius 50%
      .rating-cont
        position relative
        flex 1
        .name
          margin-bottom 4px
          line-height 12px
          color rgb(1,17,27)
          font-size 10px
        .star-wrap
          margin-bottom 6px
          font-size 0
          .star
            display inline-block
            vertical-align top
            margin-right 6px
          .delivery
            display inline-block
            vertical-align top
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
        .text
          margin-bottom 8px
          line-height 18px
          font-size 12px
          color rgb(7,17,27)
        .recommend
          line-height 16px
          font-size 0
          .icon-thumb_up, .item
            display inline-block
            margin-right 8px
          .icon-thumb_up
            color rgb(0,160,220)
            font-size 12px
          .item
            border 1px solid rgba(7,17,27,0.1)
            padding 0 6px
            border-radius 2px
            background #fff
            color rgb(147,153,159)
            font-size 9px
        .time
          position absolute
          top 0
          right 0
          line-height 12px
          color rgb(147,153,159)
          font-size 10px
</style>
