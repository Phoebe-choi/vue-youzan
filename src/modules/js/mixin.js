import Foot from 'components/Foot.vue'

let mixin = {
    filters:{ //价格过滤，待完善
        currency(price){
            let priceStr = '' + price
            if(priceStr.indexOf('.') > -1){
                let arr = priceStr.split('.')
                return arr[0] + '.' + (arr[1] + '0').substr(0,2)
            }else{
                return price + '.00'
            }
        } 
    },
    components:{
        Foot
    }
}

export default mixin