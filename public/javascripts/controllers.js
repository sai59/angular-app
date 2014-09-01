todoControllers.controller('TodoListCtrl', ['$scope', '$state', '$q', 'TodoService', 'UserService',  function($scope, $state, $q, TodoService, UserService){
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
      $state.transitionTo('todos.create', $state.$current.params, { reload: true, inherit: true, notify: true });
    }, function(result) {
     console.log("todo not created", result);
    });
  }

  $scope.share = function(todo) {
    FB.login(function(response){
      if (response.status === 'connected') {
        var data = {
          token: response.authResponse.accessToken
        }
        console.log(response);
        UserService.fbtoken(data).then(function(result) {
          console.log(result);
        }, function(reason) {
          console.log('something went horribly wrong.', reason)
        });
        FB.ui({
          method : 'share',
          href: 'http://tranquil-bastion-3738.herokuapp.com/'
        }, function(response) {
          console.log(response);
          if (response && !response.error_code) {
            console.log(response.post_id);
          } else {
            alert('Error while posting.');
          }
        });
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
      }
    }, {scope: 'publish_actions'});
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
