import 'css/common.css'
import './search.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import qs from 'qs'

let {keyword,id} = qs.parse(location.search.substr(1))
import mixin from 'js/mixin.js'
import Velocity from 'velocity-animate'

new Vue({
    el:'.container',
    data:{
        searchList:null,
        keyword,
		allLoaded:false,
        pageNum:1,
        pageSize:6,
        loading:false,       
        isShow:false
    },
    created(){
        this.getSearchList()
    },
    methods:{
        // getSearchList(){
        //     if(this.allLoaded) return
		// 	this.loading = true            
        //     axios.get(url.searchList,{
        //         keyword,
        //         id,
        //         pageNum: this.pageNum,
		// 		pageSize: this.pageSize
        //     }).then(res=>{
        //         let curLists = res.data.lists
        //         if(curLists.length < this.pageSize){
		// 			this.allLoaded = true
        //         }
        //         if(this.searchList){
		// 			this.searchList = this.searchList.concat(curLists)
		// 		}else{
		// 			//第一次请求数据
        //             this.searchList = curLists
        //         }
        //         this.loading = false
		// 		this.pageNum++
        //     })
        // },
        getSearchList(){
            axios.get(url.searchList,{
                keyword,
                id,
            }).then(res=>{
               this.searchList = res.data.lists
            })
        },
        move(){
            if(document.documentElement.scrollTop > 100){
                this.isShow = true
            }else{
                this.isShow = false
            }
        },
        toTop(){
            Velocity(document.documentElement,'scroll',{duration:1000})
        }
    },
    mixins:[mixin]
})