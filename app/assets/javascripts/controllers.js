//var todoControllers = angular.module('todoControllers', []);
var todoApp = angular.module('todoApp',['todoControllers', 'todoServices']);
var todoControllers = angular.module('todoControllers',[]);
var todoServices = angular.module('todoServices',[]);

todoServices.service('todoService', ['$http', function($http){
  this.getTodos = function(callbackFunc){
    $http.get('insiders/todos').success(function(data){
      callbackFunc(data);
    });
  }

  this.addTodo = function(data, callbackFunc){
    $http.post('insiders/todos/new', data).success(function(data){
      callbackFunc(data);
    });
  }
}]);

todoControllers.controller('TodoListCtrl', ['$scope', 'todoService', function($scope, todoService){
  $scope.todos = null;
  todoService.getTodos(function (data) {
    $scope.todos = data;
  });
  $scope.submit = function() {
    if ($scope.description) {
      var data = {description: $scope.description}
      todoService.addTodo(data, function(dataresponse) {
        $scope.todos.push(dataresponse);
        $scope.description = '';
      });
    }
  }
}]);
