var todoControllers = angular.module('todoControllers', []);
todoControllers.controller('TodoListCtrl', ['$scope', '$http',
  function($scope, $http){
    $http.get('insiders/todos').success(function(data){
      $scope.todos = data
    });
    $scope.submit = function() {
      if ($scope.description) {
        var data = {description: $scope.description}
        $http.post('insiders/todos/new', data).success(function(data){
          $scope.todos.push(data);
          $scope.description = '';
        });
      }
    }
  }])
