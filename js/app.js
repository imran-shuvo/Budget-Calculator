//budget controller

var budgetController = (function(){

   var  Expense = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
   var  Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    Expense.prototype.calcPercentage = function(totalInc){

        if(totalInc>0)
        {
            this.percentage = Math.round((this.value / totalInc)*100);
        }
        else
            this.percentage  = -1;

    };
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }

    var calculateTotal = function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum+=cur.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems:
        {
            exp:[],
            inc:[]
        },
        totals:
        {
            exp:0,
            inc:0,
            budget:0,
            percentage:-1
        }
    }

    return {
        //add new item to the ex or inc
        addItem:function(type,des,value)
        {
            var newItem,id,index;

            ///id = lastId+1;
            
            index = data.allItems[type].length-1;
            if(index>=0)
                id = data.allItems[type][index].id+1;
            else
                id = 0;

            if(type==='exp'){
                newItem = new Expense(id,des,value);
            }
            else
            {
                newItem = new Income(id,des,value);
            }
            data.allItems[type].push(newItem);
            
            return newItem ;

        },
        deleteItem: function(type,id){
            var ids,index;
            ids = data.allItems[type].map(function(current){
                return current.id;

            });

            index = ids.indexOf(id);
            if(index!== -1)
            {
                data.allItems[type].splice(index,1);
            }
            

        },

        //calculate budget here
        calculateBudget: function(){
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            if(data.totals.inc > 0)
            {
                data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
                console.log(data.percentage);

            }    
            else
                data.percentage = -1;
        },
        //calculate percentage
        calculatePercentages: function(){

            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);

            });

        },
        getPercentages: function(){
            allPer = data.allItems.exp.map(function(cur){
                    return cur.getPercentage();
            })
            return allPer;

        },
        //get budget data here
        getBudget: function(){
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,


            }
        },
        testing :function(){
            console.log(data);
        }
    }

    
   

}());


//UI controller
var uiController = (function(){

    DOMstrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        expenseContainer:'.expenses__list',
        incomeContainer:'.income__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        exPerceLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    }
    var formatNum = function(type,num){
        var splitNum,int,dec;
          num = Math.abs(num);
          num = num.toFixed(2);
          splitNum = num.split('.');
          int = splitNum[0];
          dec = splitNum[1];
          if(int.length>3)
          {
              int = int.substr(0,int.length-3) + ','+int.substr(int.length-3,3);
          }

          return  (type==='exp'?'-':'+')+' '+int+'.'+dec;

    };
    
    return {
        
            //UI get input data

        getInput:function()
        {
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value :parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        //list item to show

        addListItem:function(obj,type){
            var html,newHtml,element;
             if(type==='inc')
             {
                 element = DOMstrings.incomeContainer;
                 html ='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value"> %value%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

             }
             else{
                 element = DOMstrings.expenseContainer;
                 html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

             }

             newHtml = html.replace('%id%',obj.id);
             newHtml = newHtml.replace('%description%',obj.description);
             newHtml = newHtml.replace('%value%',formatNum(type,obj.value)); 
             document.querySelector(element).insertAdjacentHTML('beforeend',newHtml); 



        },
        deleteListItem: function(selectorId){

            el = document.getElementById(selectorId);
            el.parentNode.removeChild(el);

        },
        clearField:function(){
            //clear the input field

                var fields,arrFields;
                fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue );
                //convert list to array

                arrFields = Array.prototype.slice.call(fields);
                arrFields.forEach(function(current,index,array){
                        current.value = "";
                });
                arrFields[0].focus();


        },

        displayBudget:function(obj){
            var type;
             obj.budget>0 ? type = 'inc':type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNum(type,obj.budget);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNum(type,obj.totalInc);
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNum(type,obj.totalExp);
            
            
            if(obj.percentage > 0)
              document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            else
              document.querySelector(DOMstrings.percentageLabel).textContent = '---';

        },

        displayPercentage: function(percentages){

            fields = document.querySelectorAll(DOMstrings.exPerceLabel);

            NodeListForEach = function(list,callback){
                for(var i=0;i<fields.length;i++)
                {
                    callback(list[i],i);
                }
            };


            NodeListForEach(fields,function(current,index){
                if(percentages[index] > 0)
                    current.textContent = percentages[index] + '%';
                else
                    current.textContent = '---';

            });



        },
        displayDate:function(){
            var year,month,date,months;
            months = ["january","february","march","april","may","june","july","august","september","october","november","december"]

            date = new Date();
            year = date.getFullYear();
            month = date.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent =months[month]+' '+year;



        },
       

        getDomStrings:function()
        {
            return DOMstrings;
        }
    }

    //some code



}());



//controller to control ul and budget

var controller = (function(budgetcrtl,ulcrtl){

    //all event are here


    var setUpEventLearner=function(){
        DOMstrings =ulcrtl.getDomStrings();
        document.querySelector(DOMstrings.inputBtn).addEventListener('click',crtlAddItem);

        document.addEventListener('keypress',function(event){
            if(event.keyCode==13||event.which===13)
            {
                crtlAddItem();
            }
                
    
        });

        document.querySelector(DOMstrings.container).addEventListener('click',ctrlDeleteItem);

    };
   //budget update here
    
    var budgetUpdate = function(){
        budgetcrtl.calculateBudget();
        budget = budgetcrtl.getBudget();
        ulcrtl.displayBudget(budget);
        
        //some here;
    }
    var updatePercentage = function(){
        budgetcrtl.calculatePercentages();
       var percentage =  budgetcrtl.getPercentages();
       uiController.displayPercentage(percentage);


    };
 // add item data 
    crtlAddItem = function(){
        var inputData= ulcrtl.getInput();
        if(inputData.description != "" && inputData.value > 0 && !isNaN(inputData.value))
        {
            var newItem = budgetController.addItem(inputData.type,inputData.description,inputData.value);
            // budgetController.testing();
            uiController.addListItem(newItem,inputData.type);
            uiController.clearField();
            budgetUpdate();
            updatePercentage();
        }

       
    }
    //delete an item
    ctrlDeleteItem = function(event){
        var itemId;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId)
        {
            var splitId,type,id;
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);
            budgetcrtl.deleteItem(type,id);
            ulcrtl.deleteListItem(itemId);
            budgetUpdate();
            updatePercentage();
            

            

            
        }
        
    }

  
    return {
        init:function(){
         ulcrtl.displayBudget({
                budget: 0,
                percentage: -1,
                totalInc : 0,
                totalExp :0

            });
        uiController.displayDate();
        setUpEventLearner();
        }
    }


}(budgetController,uiController));

controller.init(); 