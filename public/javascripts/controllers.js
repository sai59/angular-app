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

todoControllers.controller('TodoShowCtrl', ['$scope', '$http', '$stateParams', '$rootScope', 'UserService',  function($scope, $http, $stateParams, $rootScope, UserService){
  $scope.todo = { };
  $http.get('insiders/todos/'+$stateParams.todoId).then(function(result) {
    $scope.todo = result.data;
  }, function(reason) {
    console.log('something went horribly wrong.', reason)
  });

  $scope.processAuth = function(authResult) {
    // Do a check if authentication has been successful.
    if(authResult.access_token) {
      console.log(authResult);
      $rootScope.gplus_client_id = authResult.client_id;
      $rootScope.gplus_session_state = authResult.session_state;
      var data = {
        code: authResult.code
      }
      UserService.gplustoken(data).then(function(result) {
        console.log(result);
      }, function(reason) {
        console.log('something went horribly wrong.', reason)
      });
    } else if(authResult['error']) {
    }
  };

  // When callback is received, we need to process authentication.
  $scope.signInCallback = function(authResult) {
    $scope.processAuth(authResult);
  };

  // Render the sign in button.
  $scope.renderShareButton = function() {
    angular.element(document.querySelector('#googlePlusBtn')).unbind('click');
    angular.element(document.querySelector('#googlePlusBtn')).remove();
    angular.element(document.querySelector('#dummygplusBtn')).after("<div id='googlePlusBtn' style='display:none'></div>");
    angular.element(document.querySelector('#googlePlusBtn')).bind('click');
    var options = {
       contenturl: 'http://todo-social.herokuapp.com',
       contentdeeplinkid: '/pages',
       clientid: '1045194091732-aasm5rpi68npeona5srgb01q7o56r0ob.apps.googleusercontent.com',
       cookiepolicy: 'single_host_origin',
       prefilltext: $scope.todo.title,
       calltoactionlabel: 'VIEW',
       calltoactionurl: 'http://todo-social.herokuapp.com',
       calltoactiondeeplinkid: '/pages/create',
       callback: $scope.signInCallback
     };
    gapi.interactivepost.render('googlePlusBtn', options);
    window.setTimeout(function(){window.document.getElementById('googlePlusBtn').click();}, 1000);
  }

  $scope.gpluscheck = function(todo) {
    if($rootScope.gplus_session_state) {
      gapi.auth.checkSessionState({
        client_id: $rootScope.gplus_client_id,
        session_state: $rootScope.gplus_session_state
      }, function(status) {
        if(status) {
          $scope.renderShareButton();
        } else {
          gapi.auth.signOut();
          $scope.renderShareButton();
        }
      })
    } else {
      $scope.renderShareButton();
    }
  }

  $scope.fbshare = function(todo) {
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
          href: 'http://developers.facebook.com/docs',
        }, function(response) {
          console.log(response);
          if (response && !response.error_code) {
            console.log(response.post_id);
          } else {
            // alert('Error while posting.');
          }
        });
      } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        console.log('Please log into this app.');
      } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        console.log('Please log into Facebook.');
      }
    }, {scope: 'publish_actions'});
  }

  $scope.fbcheck = function(todo) {
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected') {
        FB.api('/me', function(response) {
          if(response.error) {
            $scope.fbshare(todo);
          } else {
            $scope.fbshare(todo);
          }
        });
      } else {
        $scope.fbshare(todo);
      }
    });
  }

}])
