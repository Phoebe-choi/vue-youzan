<template>
    <div class="swiper-container">
    <div class="swiper-wrapper">
        <div class="swp-page swiper-slide" v-for="list in lists">
        <a class="js-no-follow" :href="list.clickUrl">
            <img class="goods-main-photo fadeIn" :src="list.img">
        </a>
        </div>
    </div>
    <div class="swiper-pagination"></div>
    </div>
</template>

<style>
.swiper-slide img{
    height: 100%;
    width: 100%;
}
</style>

<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'


export default {
    name: 'swipe',
    props: {
        lists: {
            type:Array,
            required: true
        },
        name: {}
    },
    created(){

    },
    mounted(){
        new Swiper('.swiper-container',{
            loop:true,
            pagination:'.swiper-pagination',
            autoplay: 1000,                 // 自动轮播
        })
    }    
}
</script>
