//接口文件

let url = {
	hotLists: '/index/hotLists', //推荐列表
	banner:'/index/banner', //轮播图
	topList:'/category/topList', //一级分类
	subList:'/category/subList', //二级分类-普通分类
	rank:'/category/rank', //二级分类-综合排行
	searchList:'/search/list', //商品列表
	details:'/goods/details', //商品详情
	deal:'/goods/deal', //本店成交数据
	addCart:'/cart/add',//增加库存商品数量
	cartLists:'/cart/list', //获取购物车列表数据
	cartReduce:'/cart/reduce',//减少库存商品数量
	cartRemove:'/cart/remove' ,//删除购物车商品
	cartMremove:'/cart/mrremove',//删除多个购物车商品
}

let host = 'http://rap2api.taobao.org/app/mock/7058'

for (let key in url) {
	if (url.hasOwnProperty(key)) { //hasOwnProperty判断某个对象是否含有指定的属性
		url[key] = host + url[key]
	}
}



export default url