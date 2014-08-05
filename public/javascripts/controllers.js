todoControllers.controller('TodoListCtrl', ['$scope', '$q', 'TodoService',  function($scope, $q, TodoService){
  $scope.todos = [];
  TodoService.getTodos().then(function(result) {
    $scope.todos = result.data;
  }, function(reason) {
    console.log('something went horribly wrong.', reason)
  })

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

todoControllers.controller('SessionController', ['$scope', '$q','$window', '$location', 'UserService', 'SessionService',  function($scope, $q, $window, $location, UserService, SessionService){
  $scope.login = function() {
    var data = {};
    data.email = $scope.user.email;
    data.password = $scope.user.password;

    UserService.login(data).then(function(result) {
      SessionService.isLoggedIn = true;
      $window.sessionStorage.token = result.data;
      $location.path("/todos");
    },
    function (result) {
      console.log('user unauthenticated', result);
    });
  }

  $scope.logout = function() {
    SessionService.isLoggedIn = false;
    delete $window.sessionStorage.token;
    $location.path("/");
  }
}])