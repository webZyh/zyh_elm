<template>
    <div class="goods">
      <div class="menu-wrap" v-el:menu-wrap>
        <ul>
          <li v-for="item in goods" class="menu-item" :class="{'active': currentIndex === $index }" @click="menuClick($index,$event)">
            <span class="text border-1px">
              <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrap" v-el:foods-wrap>
        <ul>
          <li v-for="item in goods" class="food-list fond-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
                <div class="icon" >
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="cont">
                  <h2 class="name">{{food.name}}</h2>
                  <div class="description">{{food.description}}</div>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now-price">￥{{food.price}}</span><span v-show="food.oldPrice" class="old-price">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cart-control-wrap">
                    <v-cartcontrol :food="food"></v-cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--  v-ref:shopcart 父组件访问子组件的方法-->
      <v-shopcart v-ref:shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></v-shopcart>
    </div>
    <v-food :food="selectedFood" v-ref:food></v-food>
</template>

<script>
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart.vue';
  import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
  import food from 'components/food/food.vue'
    const ERR_NO = 0;
    export default {
      name: "goods",
      props: {
        seller:{
          type : Object
        }
      },
      data(){
        return{
          goods : [],
          foodListHeight : [],
          scrollY : 0,
          selectedFood:{ }    //点击单个的food，存储该food相关数据
        }
      },
      computed:{
        currentIndex(){
          for(let i=0; i<this.foodListHeight.length; i++){
            let height1 = this.foodListHeight[i];
            let height2 = this.foodListHeight[i+1];
            if( !height2 || (this.scrollY >= height1 && this.scrollY < height2) ){
              return i;
            }
          }
          return 0;
        },
        selectFoods(){
          let foods = [];
          this.goods.forEach((good)=>{
            good.foods.forEach((food)=>{
              if(food.count){
                foods.push(food);
              }
            })
          })
          return foods;
        }
      },
      created(){
        this.classMap = ["decrease","discount","guarantee","invoice","special"];
        this.$http.get('/api/goods').then((res) => {
          res = res.body;
          if(res.errno === ERR_NO){
            this.goods = res.data;
            this.$nextTick(()=>{
              this._initScroll();
              this._calculateHeight();
            })
          }
        })
      },
      methods: {
        _initScroll(){
          this.menuScroll = new BScroll(this.$els.menuWrap,{
            click: true   //使web端能正常点击
          });
          this.foodsScroll = new BScroll(this.$els.foodsWrap,{
            probeType: 3,
            click: true
          });
          //console.log(this.foodsScroll);
          this.foodsScroll.on('scroll',(pos)=>{
            //console.log(pos.y);
            this.scrollY = Math.abs(Math.round(pos.y));
            //console.log(scrollY);
          })
        },
        _calculateHeight(){
          let aFoodList = this.$els.foodsWrap.getElementsByClassName('fond-list-hook');
          let height = 0;
          this.foodListHeight.push(height);
          for(let i=0; i<aFoodList.length; i++){
            let item = aFoodList[i];
            height += item.clientHeight;
            this.foodListHeight.push(height);
            //console.log(this.foodListHeight);
          }
        },
        menuClick(index,event){
          if(!event._constructed){  //防止pc端的双次点击
            return;
          }
          let aFoodList = this.$els.foodsWrap.getElementsByClassName('fond-list-hook');
          let ele = aFoodList[index];
          this.foodsScroll.scrollToElement(ele,100);
        },
        selectFood(food,$event){
          if(!event._constructed){  //防止pc端的双次点击
            return;
          }
          this.selectedFood = food;
          this.$refs.food.show();
        },
        _drop(target){
          //优化体验，异步执行下落动画
          this.$nextTick(()=>{
            //***父组件访问子组件的方法
            this.$refs.shopcart.drop(target);
          })
        }
      },
      components:{
        "v-shopcart":shopcart,
        "v-cartcontrol": cartcontrol,
        "v-food": food
      },
      events:{
        //接收子组件的事件,target就是dom对象
        'cart.add'(target) {
          this._drop(target);
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  @import "../../common/stylus/base.styl"
.goods
  display flex
  position absolute
  top 174px
  bottom 48px
  width 100%
  overflow hidden
  .menu-wrap
    flex 0 0 80px
    background-color #f3f5f7
    width 80px
    .menu-item
      display table
      padding 0 12px
      width 56px
      height 54px
      line-height 14px
      &.active
        position relative
        z-index 10
        margin-top -1px
        font-size 12px
        background #fff
        .text
          font-weight 700
          border-none()
      .text
        display table-cell
        vertical-align middle
        border-1px(rgba(7,17,27,0.2))
        width 56px
        font-size 12px
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image("decrease_3")
          &.discount
            bg-image("discount_3")
          &.guarantee
            bg-image("guarantee_3")
          &.invoice
            bg-image("invoice_3")
          &.special
            bg-image("special_3")
  .foods-wrap
    flex 1
    .title
      height 26px
      line-height 26px
      background #f3f5f7
      border-left 2px solid #d9dde1
      padding-left 14px
      color rgb(147,153,159)
      font-size 12px
    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7,17,27,0.1))
      &:last-child
        border-none()
        margin-bottom 0
      .icon
        width 57px
      .cont
        flex 1
        margin-left 10px
        .name
          margin 2px 0 8px 0
          line-height 14px
          font-size 14px
          color rgb(7,17,27)
        .description , .extra
          color rgb(147,153,159)
          line-height 10px
          font-size 10px
        .description
          margin 8px 0
          line-height 12px
        .extra
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

        .cart-control-wrap
          position absolute
          right 0
          bottom 12px

</style>
