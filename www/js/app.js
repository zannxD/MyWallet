// Ionic Starter App1

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','ngMessages', 'ionic-datepicker'])

.run(function($ionicPlatform,$cordovaSQLite) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
      
      
          //define db variable
    var db;
    
   if (window.cordova) {
      db = $cordovaSQLite.openDB({ name: "my.db" }); //device
    }else{
      db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
    }
      
       $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS main2 (id  INTEGER PRIMARY KEY ,date DATE ,e_category TEXT,note TEXT, account TEXT, type text, amount INTEGER)", [])
       .then(function(res) {
      console.log("created ");
    }, function (err) {
      console.error(err);
    });
      
      
  });
})



.config(function($stateProvider, $urlRouterProvider, ionicDatePickerProvider){
    $stateProvider
    .state('tabs', {
    url:'/tab', 
        abstract: true,
        templateUrl: 'templates/tabs.html'
        
    
    
    })
    
    .state('tabs.list', {
        url: '/list',
        views: {
            'list-tab' :{
                templateUrl: 'templates/list.html',
                controller: 'ListController as list'
            }
        
        
        
        }
    
    
    })
    
   
    
    
    $urlRouterProvider.otherwise('/tab/list');
  
  
    //config datepciker
  
  var datePickerObj = {
      inputDate: new Date(),
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd-MMMMyyyy',
      closeOnSelect: false,
      disableWeekdays: [6],
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
    })




 

//Directives for validation

.directive('onValidSubmit', ['$parse', '$timeout', function($parse, $timeout) {
    return {
      require: '^form',
      restrict: 'A',
      link: function(scope, element, attrs, form) {
        form.$submitted = false;
        var fn = $parse(attrs.onValidSubmit);
        element.on('submit', function(event) {
          scope.$apply(function() {
            element.addClass('ng-submitted');
            form.$submitted = true;
            if (form.$valid) {
              if (typeof fn === 'function') {
                fn(scope, {$event: event});
              }
            }
          });
        });
      }
    }
 
  }])

//Directives for validation

  .directive('validated', ['$parse', function($parse) {
    return {
      restrict: 'AEC',
      require: '^form',
      link: function(scope, element, attrs, form) {
        var inputs = element.find("*");
        for(var i = 0; i < inputs.length; i++) {
          (function(input){
            var attributes = input.attributes;
            if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
              var field = form[attributes.name.value];
              if (field != void 0) {
                scope.$watch(function() {
                  return form.$submitted + "_" + field.$valid;
                }, function() {
                  if (form.$submitted != true) return;
                  var inp = angular.element(input);
                  if (inp.hasClass('ng-invalid')) {
                    element.removeClass('has-success');
                    element.addClass('has-error');
                  } else {
                    element.removeClass('has-error').addClass('has-success');
                  }
                });
              }
            }
          })(inputs[i]);
        }
      }
    }
  }])


//controllers for functionality

.controller('ListController',function($scope,$http,$cordovaSQLite,$ionicModal,$cordovaDatePicker, ionicDatePicker){

console.log("working");
 

   $http.get('js/data.json').success(function(data){
            $scope.artists = data;
            console.log(data);
       
       
           //delete item  
   $scope.onItemDelete = function(item){
            $scope.artists.splice($scope.artists.indexOf(item),1);
            }
       
$scope.toggleStar = function(item){
                item.star = !item.star;
            }
       
       
        
        });
    
    //define db variable
    var db;
    
   if (window.cordova) {
      db = $cordovaSQLite.openDB({ name: "my.db" }); //device
    }else{
      db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
    }

  $scope.expenseDel = function(id) {
    
    $cordovaSQLite.execute(db, "delete from main2 where id = ?", [id]).then(function(res) {
        
            
    $scope.getExpenseList();
      
    }, function (err) {
      console.error(err);
    });
  };
    
    
    //expense moDAL declaration
       $ionicModal.fromTemplateUrl('templates/expenseModal.html',{
        
        scope : $scope,
        animation : 'slide-in-up'    
        
        }).then(function(modal){
        
            $scope.expenseModal = modal;
        
        });
    
    
    $scope.addExpenseModal = function(){
    
    $scope.expenseModal.show();
     
    
    };
    
    //close expense modal
    $scope.closeExpenseModal = function(){
    
    
        
    $scope.expenseModal.hide();
    }
    
    
    //save expense 
    $scope.saveExpense =  function(expense){
    
    
    console.log(expense);
        
        if(expense.$valid && $scope.validDate){
        
        $cordovaSQLite.execute(db, "insert into main2 (amount,date,e_category,account,note,type) values(?,?,?,?,?,?)", [expense.amount, $scope.expenseDate,expense.cat,expense.choice,expense.note,"EXPENSE"]).then(function(res) {
      console.log("insertId: " + res.insertId);
      $scope.reset();
                
    $scope.getExpenseList();
    }, function (err) {
      console.error(err);
    });
        }
    
    };
    
    
    $scope.expList = [];
    $scope.getExpenseList = function(){
           $cordovaSQLite.execute(db, "select * from main2  where type = 'EXPENSE' order by date desc", []).then(function(res) {
            $scope.expList = [];
      console.log(res);
             
               for(var i = 0; i < res.rows.length; i++){
               console.log(res.rows[i].amount);
               
                $scope.expList.push({
                
                amount : res.rows[i].amount,
                note : res.rows[i].note,    
                date : res.rows[i].date,  
               id : res.rows[i].id 
                });
               } 
             
               
    }, function (err) {
      console.error(err);
    });
        
        
        
        
    };
     
    
    $scope.getExpenseList
    
    $scope.reset = function(){

 

      $scope.expenseDate ="Not Set";
      $scope.closeExpenseModal ();
      $scope.validDate = false;

    };
    
   //$scope.abc();
  
  
      var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
       
       var d = new Date(val);
     
        $scope.expenseDate = d.getFullYear()+"-"+d.getMonth()+"-"+ d.getDate();
       $scope.validDate = true;
      },
             //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup' ,
       showTodayButton: false
        //Optional
    };

    $scope.openDatePicker = function(){
      ionicDatePicker.openDatePicker(ipObj1);
    };
  $scope.expenseDate ="Not Set";
    

});