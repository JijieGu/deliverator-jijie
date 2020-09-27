function itemsToArray(items){
    var arr=[];
    for(var i=0;i<items.length;i++){
        arr[i]=items[i]
       }
    return arr
}
function calcPriceKFC(items){
    var price = 0;

        if(items.includes('wings')){price+=1}  

        if(items.includes('thighs')){price+=2}

        else{console.log('calculation error')}
    
    return price
}

function calcPricePizzaHut(items){
    var price = 0;

 
        if(items.includes('fourCheese')){price+=3}
        if(items.includes('hawaii')){price+=4}
        else{console.log('calculation error')}
    
    return price
    }


module.exports = {
    calcPriceKFC,
    calcPricePizzaHut,
    itemsToArray
}