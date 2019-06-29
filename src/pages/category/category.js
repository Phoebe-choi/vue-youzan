import 'css/common.css'
import './category.css'

import Vue from 'vue'
import axios from 'axios'

import url from 'js/api.js'
import mixin from 'js/mixin.js' //导入公共文件 mixin.js

new Vue({
    el:'#app',
    data:{
        topLists:null,
        topIndex:0,
        subData:null,
        rankData:null,
        // rankDataPic:[]
    },
    created(){
        this.getTopList()
        this.getSubList(0)
    },
    methods:{
        getTopList(){
            axios.get(url.topList).then(res=>{
                this.topLists = res.data.lists
            }).catch(res=>{

            })
        },
        getSubList(index,id){ 
            this.topIndex = index
            if(index === 0){
                this.getRank()
            }else{
                axios.get(url.subList).then(res=>{
                    this.subData = res.data.data
                })
            }
        },
        getRank(){ //分类页数据渲染
            axios.get(url.rank).then(res=>{
                this.rankData = res.data.data
            })
        },
        toSearch(list){ //分类页面二级分类热门品牌、热门分类的跳转
            location.href = `search.html?keyword=${list.name}&id=${list.id}`
        }
    },
    mixins:[mixin] //导入公共文件 mixin.js 的内容
})