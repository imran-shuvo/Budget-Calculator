var budgetController = (function(){
    var x = 45;
    add = function(a){
        return a+x;
    }
    return {
        publicTest:function(b){
            return add(b);
        }
    }

}());

var uiController = (function(){


    //some code



}());

var controller = (function(budgetcrtl,ulcrtl){


    var z = budgetcrtl.publicTest(10);

    return {
        anotherPublic:function(){
            console.log(z);
        }
    }



}(budgetController,uiController));
