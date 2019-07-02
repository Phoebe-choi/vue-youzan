import './cart_base.css'
import './cart_trade.css'
import './cart.css'


import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'
import Volecity from 'velocity-animate'
import Cart from 'js/cartService.js'
import fetch from 'js/fetch.js'


// import Mock from 'mockjs'
// let Random = Mock.Random

// let data = Mock.mock({
//     'cartList|3':[{
//         'goodsList|1-2':[{
//             id:Random.int(10000,100000),
//             image:Mock.mock('@img(90*90,@color)')
//         }]
//     }]
// }) 

new Vue({
    el:'.container',
    data:{
        lists:null,
        total:0,
        editingShop:null,
        editingShopIndex:-1,
        removePopup:false,
        removeData:null,
        removeMsg: ''
    },
    computed:{
        allSelected:{
            get(){
                if(this.lists&&this.lists.length){ //选中商品或店铺操作总全选
                    return this.lists.every(shop=>{
                        return shop.checked
                    })
                }
                return true
            },
            set(newVal){ //console.log(newVal) //true or false
                this.lists.forEach(shop=>{ //遍历商品和店铺，判断是否选中商品和店铺从而操作总全选状态
                    shop.checked = newVal
                    shop.goodsList.forEach(good=>{
                        good.checked = newVal
                    })
                })
            }
        },
        allRemoveSelected:{
            get(){
                if(this.editingShop) {
                    return this.editingShop.removeChecked
                }
                return false
            },
            set(newVal){
                if(this.editingShop) {
                    this.editingShop.removeChecked = newVal
                    this.editingShop.goodsList.forEach(good => {
                      good.removeChecked = newVal
                    })
                }
            }
        },
        selectLists(){ //合计总价：获取店铺下的商品的价格
            if(this.lists&&this.lists.length){
                let arr = []
                let total = 0
                this.lists.forEach(shop=>{
                    shop.goodsList.forEach(good=>{ 
                        if(good.checked){ //判断选中的商品
                            arr.push(good)
                            total += good.price * good.number
                        }
                    })
                })
                this.total = total
                return arr
            }
            return []
        },
        removeLists(){
            if(this.editingShop) {
                let arr = []
                this.editingShop.goodsList.forEach(good => {
                  if(good.removeChecked) {
                    arr.push(good)
                  }
                })
                return arr
              }
              return []
        },
    },
    created(){
        this.getList()
    },
    methods:{
        getList(){
            axios.get(url.cartLists).then(res=>{
                //遍历后台数据push一个判断是否选中状态的字段,先处理数据后再赋值
                let lists = res.data.cartList
                lists.forEach(shop => {
                    shop.checked = true
                    shop.editing = false
                    shop.editingMsg = '编辑'
                    shop.removeChecked = false
                    shop.goodsList.forEach(good=>{
                        good.checked = true
                        good.removeChecked = false
                    })  
                })
                this.lists = lists
            })
        },
        selectGood(shop,good){
            let attr = this.editingShop ? 'removeChecked' : 'checked'
            good[attr] = !good[attr] //商品切换选中与未选中功能
            shop[attr] = shop.goodsList.every(good=>{ //判断点击商品未选与已选下店铺的状态效果
                return good[attr]
            })
        },
        selectShop(shop){
            shop.checked = !shop.checked //店铺切换选中与未选中功能
            shop.goodsList.forEach(good=>{ //判断点击店铺未选与已选下商品的状态效果
                good.checked = shop.checked 
            })
        },
        selectAll(){ //总全选切换已选与未选状态
            let attr = this.editingShop ? 'allRemoveSelected' : 'allSelected'
            this[attr] = !this[attr]
        },
        edit(shop,shopIndex){ //点击编辑按钮判断当前店铺和其他店铺的状态
            shop.editing = !shop.editing //正常状态和编辑状态的切换
            shop.editingMsg = shop.editing ? '完成' : '编辑' //判断是否在编辑状态，如果在编辑状态显示“完成”，否则反之
            this.lists.forEach((item,i)=>{
                if(shopIndex !== i){
                    item.editing = false
                    item.editingMsg = shop.editing ? '' : '编辑' //店铺状态在编辑中，其他店铺则显示为空
                }
            })
            this.editingShop = shop.editing ? shop : null //点击编辑底部栏状态
            this.editingShopIndex = shop.editing ? shopIndex : -1
        },
        reduce(good){//库存减少商品数量
            // if(good.number === 1) return
            // axios.post(url.cartReduce,{
            //     id:good.id,
            //     number:1  
            // }).then(res=>{
            //     good.number--
            // })
            Cart.reduce(good.id).then(res => { //封装后写法
                good.number--
            })
        },
        add(good){  //库存增加商品数量
            // axios.post(url.addCart,{
            //     id:good.id,
            //     number:1  //一件
            // }).then(res=>{
            //     good.number++
            // })
            Cart.add(good.id).then(res => {
                good.number++
            })
        },
        remove(shop,shopIndex,good,goodIndex){ //删除商品
            this.removePopup = true
            this.removeData = {shop,shopIndex,good,goodIndex}
            this.removeMsg = '确定要删除该商品吗？'
        },
        removeList() {
            this.removePopup = true
            this.removeMsg = `确定将所选 ${this.removeLists.length} 个商品删除？`
        },
        removeConfirm() { //弹框确认删除
            if(this.removeMsg === '确定要删除该商品吗？'){
              let {shop,shopIndex,good,goodIndex} = this.removeData
              fetch(url.cartRemove,{
                id: good.id
              }).then(res => {
                shop.goodsList.splice(goodIndex, 1)
                if(!shop.goodsList.length) { //商品全部删除后店铺也一并删除
                  this.lists.splice(shopIndex, 1)
                  this.removeShop()
                }
                this.removePopup  = false
                // this.$refs[`goods-${shopIndex}-${goodIndex}`][0].style.left = '0px'
              })
            }else {
              let ids = []
              this.removeLists.forEach(good => {
                ids.push(good.id)
              })
              axios.post(url.cartMremove, {
                ids
              }).then(res => {
                let arr = []
                this.editingShop.goodsList.forEach(good => {
                  let index = this.removeLists.findIndex(item => {
                    return item.id == good.id
                  })
                  if(index === -1) {
                    arr.push(good)
                  }
                })
                if(arr.length) {
                  this.editingShop.goodsList = arr
                } else {
                  this.lists.splice(this.editingShopIndex, 1)
                  this.removeShop()
                }
                this.removePopup  = false
              })
            }
        },
        removeShop() {//在编辑状态下移除店铺后其他店铺需要恢复正常状态(显示'编辑'字段，而非空白)
            this.editingShop = null
            this.editingShopIndex = -1
            this.lists.forEach(shop => {
              shop.editing = false
              shop.editingMsg = '编辑'
            })
        },
        start(e,good){ //左滑删除按钮显示，开始
            good.startX = e.changedTouches[0].clientX
        },
        end(e,shopIndex,good,goodIndex){//左滑删除按钮显示，结束
            let endX = e.changedTouches[0].clientX
            let left = '0'
            if(good.startX - endX > 100) {
              left = '-60px'
            }
            if(endX - good.startX > 100) {
              left = '0px'
            }
            // console.log(this.$refs[`goods-${shopIndex}-${goodIndex}`])
            Volecity(this.$refs[`goods-${shopIndex}-${goodIndex}`], { //左滑删除过渡动效
              left
            })
        },
    },
    mixins:[mixin]
})
