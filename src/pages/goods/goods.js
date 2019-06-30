
import './goods_common.css'
import './goods_custom.css'
import './goods.css'
import './goods_theme.css'
import './goods_mars.css'
import './goods_sku.css'
import './goods_transition.css'


import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'
import qs from 'qs'
import Swipe from 'components/Swipe.vue'

let {id} = qs.parse(location.search.substr(1))
let detailTab = ['商品详情','本店成交']


new Vue({
    el:'#app',
    data:{
        id,
        details:null,
        detailTab,
        tabIndex:0,
        dealLists:null,
        bannerLists:null,
        skuType:1,  //规格选择
        showSku:false,
        skuNum:1,
        isAddCart:false,
        showAddMessage:false
    },
    created(){
        this.getDetails()
    },
    methods:{
        getDetails(){
            axios.get(url.details,{id}).then(res=>{
                this.details = res.data.data
                this.bannerLists = []
                this.details.imgs.forEach(item=>{
                    this.bannerLists.push({
                        clickUrl:'',
                        img:item
                    })
                })
            })
        },
        changeTab(index){ //商品详情和本店成交tab切换
            this.tabIndex = index
            if(index){
                this.getDeal()
            }
        },
        getDeal(){ //获取本店成交数据
            axios.get(url.deal,{id}).then(res=>{
                this.dealLists = res.data.data.lists
            })
        },
        chooseSku(type){ //点击加入购物车弹出层功能
            this.skuType = type
            this.showSku = true
        },
        changeSkuNum(num){  //购买数量加减按钮功能
            if(num<0 && this.skuNum === 1) return
            this.skuNum += num
        },
        addCart(){ //弹出层里点击加入购物车功能
            axios.post(url.addCart,{
                id,
                number:this.skuNum
            }).then(res=>{
                if(res.data.status === 200){
                    this.showSku = false
                    this.isAddCart = true
                    this.showAddMessage = true

                    setTimeout(()=>{
                        this.showAddMessage = false
                    },1000)
                }
            })
        }
    },
    components:{
		Swipe
    },
    watch:{
        showSku(val,oldval){
            //下面判断点击弹出层的时候，body和html的高度禁掉
            document.body.style.overflow = val ? 'hidden' : 'auto'
            document.querySelector('html').style.overflow = val ? 'hidden' : 'auto'
            document.body.style.height = val ? '100%' : 'auto'
            document.querySelector('html').style.height = val ? '100%' : 'auto'

            // document.documentElement.style.overflow = val ? 'hidden' : 'auto'
            // document.querySelector('body').style.overflow = val ? 'hidden' : 'auto'
            // document.documentElement.style.height = val ? '100%' : 'auto'
            // document.querySelector('body').style.height = val ? '100%' : 'auto'
        }
    },
    mixins:[mixin]
})