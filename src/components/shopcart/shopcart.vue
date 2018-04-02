<template>
    <div class="shopcart">
      <div class="cont">
        <div class="cont-left" :class="statusClass">
          <div class="logo-wrap clearfix">
            <div class="logo" :class="{ highlight : totalCount>0}">
              <i class="icon-shopping_cart" :class="{ highlight : totalCount>0}"></i>
            </div>
            <div class="foods-count" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{ highlight : totalPrice>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="cont-right">
          <div class="pay" :class="statusClass">{{payDesc}}</div>
        </div>
      </div>
    </div>
</template>

<script>
    export default {
      name: "shopcart",
      props:{
        selectFoods:{   //在商品组件中选择的商品
          type: Array,
          default(){
            return[
              {
                price:0,
                count:0
              }
            ]
          }
        },
        deliveryPrice:{   //起送价格
          type:Number,
          default: 0
        },
        minPrice:{      //最少起送价格
          type:Number,
          default: 0
        }
      },
      created(){
        this.$nextTick(()=>{

        })
      },
      computed:{
        totalPrice(){
          let totalprice = 0;
          this.selectFoods.forEach((item)=>{
            totalprice += item.price* item.count
          })
          return totalprice;
        },
        totalCount(){
          let totalcount = 0;
          this.selectFoods.forEach((item)=>{
            totalcount += item.count;
          })
          return totalcount;
        },
        payDesc(){
          if(this.totalPrice === 0){
            return ` ￥${this.minPrice}起送 `;
          }else if(this.totalPrice < this.minPrice){
            let diff = this.minPrice - this.totalPrice;
            return `还差${diff}元起送`;
          }else{
            return '去结算';
          }
        },
        statusClass(){
          if(this.totalPrice === 0){
            return false
          }else if(this.totalPrice < this.minPrice){
            return "not-enough"
          }else{
            return "enough"
          }
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.shopcart
  position fixed
  left 0
  bottom 0
  width 100%
  height 48px
  .cont
    display flex
    width 100%
    height 100%
    background #141d27
    .cont-left
      flex 1
      font-size 0
      background #141d27
      &.not-enough
        background #08121c
      &.enough
        background #07111b
      .logo-wrap
        position relative
        top -10px
        display inline-block
        vertical-align top
        padding 6px 6px 8px 6px
        margin 0 12px
        width 56px
        height 58px
        box-sizing border-box
        border-radius 50%
        .logo
          text-align center
          border-radius 50%
          width 100%
          height 100%
          background #2b343c
          &.highlight
            background-color rgb(0,160,220)
          .icon-shopping_cart
            line-height 44px
            font-size 24px
            color #80858a
            &.highlight
              color #fff
        .foods-count
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          border-radius 16px
          line-height 16px
          text-align center
          background-color rgb(240,20,20)
          box-shadow 0 4px 8px 0 rgba(0,0,0,0.4)
          color #fff
          font-size 9px
      .price
        display inline-block
        vertical-align top
        line-height 24px
        margin-top 12px
        padding-right 12px
        box-sizing border-box
        border-right 1px solid rgba(255,255,255,0.1)
        font-size 16px
        font-weight 700
        color rgba(255,255,255,0.4)
        &.highlight
          color #fff
      .desc
        display inline-block
        vertical-align top
        margin-left 12px
        line-height 48px
        font-size 10px
        color rgba(255,255,255,0.4)
    .cont-right
      flex 0 0 105px
      width 105px
      text-align center
      .pay
        line-height 48px
        width 100%
        height 100%
        background #2b333b
        font-size 12px
        color rgba(255,255,255,0.4)
        &.enough
          background #00b43c
          color #fff
</style>
