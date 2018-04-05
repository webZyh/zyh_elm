<template>
  <div class="cart-control">
    <div class="decrease" v-show="food.count>0" @click.stop.prevent="reduceCount($event)" transition="move">
      <span class="inner icon-remove_circle_outline"></span>
    </div>
    <div class="count" v-show="food.count>0">{{food.count}}</div>
    <div class="increase icon-add_circle" @click.stop.prevent="addCount($event)"></div>
  </div>
</template>

<script>
  import Vue from "vue"
    export default {
      name: "cartcontrol",
      props:{
          food: {
            type:Object
          }
      },
      created(){
        //console.log(this.food);
      },
      methods:{
        addCount(event){
          if(!event._constructed){  //防止pc端的双次点击
            return;
          }
          if(!this.food.count){
            Vue.set(this.food,'count',1);   //动态给传入组件的对象添加属性
          }else{
            this.food.count++;
          }
          /*派发一个事件，将DOM对象event.target作为这个事件的参数*/
          this.$dispatch('cart.add', event.target);
        },
        reduceCount(event){
          if(!event._constructed){  //防止pc端的双次点击
            return;
          }
          if(this.food.count){
            this.food.count--;
          }
        }
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cart-control
  font-size 0
  .decrease
    display inline-block
    padding 6px
    transition all 0.4s linear
    &.move-transition
      opacity 1
      transform translate3d(0,0,0)
      .inner
        display inline-block
        line-height 24px
        font-size 24px
        color rgb(0,160,220)
        transition all 0.4s linear
        transform rotate(0)
    &.move-enter, &.move-leave
      opacity 0
      transform: translate3d(24px,0,0)
      .inner
        transform rotate( 180deg )
  .increase
    display inline-block
    padding 6px
    line-height 24px
    font-size 24px
    color rgb(0,160,220)
  .count
    display inline-block
    vertical-align top
    padding-top 6px
    line-height 24px
    width 12px
    text-align center
    color rgb(147,153,159)
    font-size 10px
</style>
