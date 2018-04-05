<template>
    <div class="shop-cart">
      <div class="cont" @click="toggleCart()">
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
        <div class="cont-right" @click.stop.prevent="payMoney()">
          <div class="pay" :class="statusClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container">
        <div transition="drop" v-for="ball in balls" v-show="ball.show" class="ball">
          <div class="inner inner-hook"></div>
        </div>
      </div>
      <div class="fold-wrap" v-show="showCart" transition="fold">
        <div class="fold-header">
          <span class="shop">购物车</span>
          <span class="empty" @click="empty()">清空</span>
        </div>
        <div class="fold-cont" v-el:fold-cont>
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price* food.count}}</span>
              </div>
              <div class="cart-control-wrap">
                <v-cart-control :food="food"></v-cart-control>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mask" @click="hideCart()" v-show="showCart" transition="fade"></div>
</template>

<script>
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
    export default {
      name: "shopcart",
      data(){
        return {
          balls:[
            {
              show:false
            },
            {
              show:false
            },
            {
              show:false
            },
            {
              show:false
            },
            {
              show:false
            }
          ],
          dropBalls:[],
          fold: true    //折叠
        }
      },
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
        },
        showCart(){
          if(!this.totalCount){
            this.fold = true;
            return false;
          }
          let show = !this.fold;
          //使用BScroll
          if(show){
            this.$nextTick(()=>{
              if(!this.foldScroll){
                this.foldScroll = new BScroll(this.$els.foldCont ,{
                  click: true
                })
              }else{
                this.foldScroll.refresh();
              }
            })
          }
          return show;
        }
      },
      methods:{
        //***拿到父组件传过来的DOM对象
        drop(el){
          //console.log(el);
          for(let i=0; i<this.balls.length; i++){
            let ball = this.balls[i];
            if(!ball.show){
              ball.show = true;
              ball.el = el;
              this.dropBalls.push(ball);
              return;
            }
          }
        },
        toggleCart(){
          if(!this.totalCount){
            return;
          }
          this.fold = !this.fold;
        },
        empty(){
          this.selectFoods.forEach((food)=>{
            food.count = 0;
          });
        },
        hideCart(){
          this.fold = true;
        },
        payMoney(){
          if(this.totalPrice<this.minPrice ){
            return false;
          }
          alert(`支付${this.totalPrice}元`)
        }
      },
      components:{
        "v-cart-control": cartcontrol
      },
      transitions:{
        drop:{
          beforeEnter (el) {
            let count = this.balls.length;
            while(count--){
              let ball = this.balls[count];
              if(ball.show){
                let rect = ball.el.getBoundingClientRect();
                let x = rect.left -32;
                let y = -(window.innerHeight - rect.top - 22);
                //console.log(x,y);
                el.style.display = '';
                el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                el.style.transform = `translate3d(0,${y}px,0)`;
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                inner.style.transform = `translate3d(${x}px,0,0)`;
              }
            }
          },
          enter (el) {
            //触发重绘
            let rf = el.offsetHeight;
            this.$nextTick(()=>{
              el.style.webkitTransform = 'translate3d(0,0,0)';
              el.style.transform = 'translate3d(0,0,0)';
              let inner = el.getElementsByClassName("inner-hook")[0];
              inner.style.webkitTransform = 'translate3d(0,0,0)';
              inner.style.transform = 'translate3d(0,0,0)';
            })
          },
          afterEnter (el) {
            let ball = this.dropBalls.shift();
            if(ball){
              ball.show = false;
              el.style.display = 'none';
            }
          }
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/index.styl"
.shop-cart
  position fixed
  left 0
  bottom 0
  z-index 50
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
  .ball-container
    .ball
      position fixed
      left 32px
      bottom 22px
      z-index 200
      &.drop-transition
        transition all 0.4s cubic-bezier(0.49,0.29, 0.75 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0,160,220)
          transition all 0.4s linear
  .fold-wrap
    position absolute
    left 0
    top 0
    width 100%
    z-index -1
    transition all 0.5s
    &.fold-transition
      transform translate3d(0, -100% ,0);
    &.fold-enter,&.fold-leave
      transform translate3d(0, 0 ,0);
    .fold-header
      padding 0 18px
      height 40px
      line-height 40px
      background #f3f5f7
      border-bottom 1px solid rgba(7,17,27,0.1)
      .shop
        float left
        font-size 14px
        color rgb(7,17,27)
      .empty
        float right
        font-size 12px
        color: rgb(0,160,220)

    .fold-cont
      padding 0 18px
      background #fff
      overflow hidden
      max-height 217px
      .food
        padding 12px 0
        border-1px(rgba(7,17,27,0.1))
        .name
          line-height 24px
          color rgb(7,17,27)
          font-size 14px
        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          font-size 14px
          font-weight 700
          color rgb(240,20,20)
        .cart-control-wrap
          position absolute
          right 0
          bottom 7px
.mask
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 49
  transition all 0.4s
  backdrop-filter blur(10px)
  &.fade-transition
    opacity 1
    background rgba(7,17,27,0.8)
  &.fade-enter,&.fade-leave
    opacity 0
    background rgba(7,17,27,0)
</style>
