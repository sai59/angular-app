todoControllers.controller('TodoListCtrl', ['$scope', '$q', 'TodoService',  function($scope, $q, TodoService){
  $scope.todos = null;
  TodoService.getTodos().then(function(result) {
    $scope.todos = result.data;
  }, function(reason) {
    console.log('something went horribly wrong.', reason)
  });

  $scope.createTodo =  function() {
    var data = {description: $scope.description}
    TodoService.createTodo(data).then(function(result) {
      $scope.todos.push(result);
      $scope.description = '';
    }, function(result) {
     console.log("todo not created", result);
    });
  }

}])
