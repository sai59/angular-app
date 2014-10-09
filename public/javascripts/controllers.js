todoControllers.controller('TodoListCtrl', ['$scope', '$http', '$state', '$stateParams', '$q', 'TodoService', 'UserService', function($scope, $http, $state, $stateParams, $q, TodoService, UserService){
  $scope.todos = [];
  TodoService.getTodos().then(function(result) {
    $scope.todos = result.data;
  }, function(reason) {
    console.log('something went horribly wrong.', reason)
  })

  $scope.createtodo =  function() {
    if ($scope.createTodoForm.$invalid) {
    return;
  }
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
      $state.transitionTo('home.todos.create', $state.$current.params, { reload: true, inherit: true, notify: true });
    }, function(result) {
     console.log("todo not created", result);
    });
  }
  
  $scope.updateTodo =  function(todo) {
    var data = {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      image_url: todo.image_url
    }

    TodoService.updateTodo(data).then(function(result) {
      $state.transitionTo('home.todos', $state.$current.params, { reload: true, inherit: true, notify: true });
    }, function(result) {
     console.log("todo not updated", result);
    });
  }
  
  $scope.deleteTodo =  function(tId, index) {
    if (confirm('Are you sure you want to delete?')) {
      $http.get('insiders/todos/'+tId+'/delete').then(function(result) {
        $state.transitionTo('home.todos', $state.$current.params, { reload: true, inherit: true, notify: true });
      });
    }
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

    UserService.login(data);
  }

  $scope.logout = function() {
    SessionService.isLoggedIn = false;
    delete $window.sessionStorage.token;
    $location.path("/");
  }

  $scope.gPlusLogin = function(action) {
    GplusService.gPlusCheckLoginStateAndRender(action, null);
  }

  $scope.fbLogin = function(action) {
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

  $scope.gPlusShare = function(action, todo) {
    GplusService.gPlusCheckLoginStateAndRender(action, todo);
  }

  $scope.fbShare = function(action, todo) {
    FbService.fbCheckLoginStateAndRender(action, todo);
  }

}])

todoControllers.controller('ProfileCtrl', ['$scope', 'GplusService', 'FbService',  function($scope, GplusService, FbService){
  $scope.gPlusProfileLink = function(action) {
    GplusService.gPlusCheckLoginStateAndRender(action, null);
  }

  $scope.fbProfileLink = function(action) {
    FbService.fbCheckLoginStateAndRender(action, null)
  }
}])