var todoApp = angular.module('todoApp',['todoControllers', 'todoServices']);
var todoControllers = angular.module('todoControllers',[]);
var todoServices = angular.module('todoServices',[]);

todoServices.factory('todoService', ['$http', '$q', function($http, $q){
  return {

    getTodos: function(){
      return $http.get('insiders/todos')
        .then(function(response){
          return response.data;
        },function(response){
          return "invalid response";
        });
    },

    addTodo: function(todo){
      return $http.post('insiders/todos/new', todo)
        .then(function(response){
          return response.data;
        },function(response){
          return "invalid response";
        });
    }

  }
}]);

todoControllers.controller('TodoListCtrl', ['$scope', '$q', 'todoService', function($scope, $q, todoService){
  $scope.todos = null;

  todoService.getTodos().then(function(data) {
    $scope.todos = data;
  }, function(error) {
    console.log(error);
  });

  $scope.submit = function() {
    if ($scope.description) {
      var todo = {description: $scope.description}
      todoService.addTodo(todo)
        .then(function(data){
            $scope.todos.push(data);
            $scope.description = '';
          },function(error){
            console.log(error);
          });
    }
  }
}]);
