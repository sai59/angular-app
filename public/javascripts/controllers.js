todoControllers.controller('TodoListCtrl', ['$scope', '$state', '$q', 'TodoService', 'UserService',  function($scope, $state, $q, TodoService, UserService){
  $scope.todos = [];
  TodoService.getTodos().then(function(result) {
    $scope.todos = result.data;
  }, function(reason) {
    console.log('something went horribly wrong.', reason)
  })

  $scope.createTodo =  function() {
    var data = {
      title: $scope.title,
      description: $scope.description,
      image_url: $scope.image_url
    }
    TodoService.createTodo(data).then(function(result) {
      $scope.todos.push(result);
      $scope.title = '';
      $scope.description = '';
      $scope.image_url = '';
      $state.transitionTo('todos.create', $state.$current.params, { reload: true, inherit: true, notify: true });
    }, function(result) {
     console.log("todo not created", result);
    });
  }

}])

todoControllers.controller('SessionController', ['$scope', '$q','$window', '$location', 'UserService', 'SessionService', 'GplusService', 'FbService', function($scope, $q, $window, $location, UserService, SessionService, GplusService, FbService){
  $scope.login = function(form) {
    if ($scope.loginForm.$invalid) {
    return;
  }
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

  $scope.gPlusCheck = function(action) {
    GplusService.gPlusCheckLoginStateAndRender(action, null);
  }

  $scope.fbCheck = function(action) {
    FbService.fbCheckLoginStateAndRender(action, null)
  }

}])

todoControllers.controller('TodoShowCtrl', ['$scope', '$http', '$stateParams', '$rootScope', 'GplusService', 'FbService',  function($scope, $http, $stateParams, $rootScope, GplusService, FbService){
  $scope.todo = { };
  $http.get('insiders/todos/'+$stateParams.todoId).then(function(result) {
    $scope.todo = result.data;
  }, function(reason) {
    console.log('something went horribly wrong.', reason)
  });

  $scope.gPlusCheck = function(action, todo) {
    GplusService.gPlusCheckLoginStateAndRender(action, todo);
  }

  $scope.fbCheck = function(action, todo) {
    FbService.fbCheckLoginStateAndRender(action, todo);
  }

}])
