var todoControllers = angular.module('todoControllers',[]);

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
