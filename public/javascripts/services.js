todoServices.factory('TodoService', ['$http', '$q', function($http, $q) {
  return {
    getTodos: function() {
      return $http.get('insiders/todos');
    },

    createTodo: function(params) {
      return $http.post('insiders/todos/new', params).then(function(response) { return response.data; }, function() { return response.data; });
    }
  }
}]);

todoServices.factory('SessionService', [function() {
  var session = {
    isLoggedIn: null
  };
  return session;
}])

todoServices.factory('UserService', ['$http', '$q', function($http, $q) {
  return {
    login: function(params) {
      return $http.post('/auth/login', params);
    },
    fbtoken: function(data) {
      return $http.get('insiders/facebook_long_lived_token', {
        params: data
      });
    },
    save_gplus_user_id: function(data) {
      return $http.get('insiders/save_gplus_user_id', {
        params: data
      });
    }
  }
}])

todoServices.factory('GplusService', ['UserService', 'SessionService', '$q', '$rootScope', function(UserService, SessionService, $q, $rootScope) {
  var obj = {};

  obj.processAuth = function(authResult, user) {
    // Do a check if authentication has been successful.
    if(authResult.access_token) {
      console.log(authResult);
      $rootScope.gplus_client_id = authResult.client_id;
      $rootScope.gplus_session_state = authResult.session_state;
      $rootScope.gplus_user_id = user.id;
      var data ={
        id: user.id,
        provider: 'gplus'
      }
      UserService.login(data).then(function(result) {
        SessionService.isLoggedIn = true;
        $window.sessionStorage.token = result.data;
        $location.path("/todos");
      }, function(reason) {
        console.log('something went horribly wrong.', reason)
      });
    } else if(authResult['error']) {
    }
  };

  obj.signInCallback = function(authResult) {
    gapi.client.load('plus','v1', function(){
      var request = gapi.client.plus.people.get({
        'userId': 'me',
        'fields': 'id'
      });
      request.execute(function(user) {
        obj.processAuth(authResult, user);
      });
    });
  }

  // Render the share button.
  obj.renderShareButton = function(todo) {
    angular.element(document.querySelector('[id^="googlePlusBtn"]')).unbind('click');
    angular.element(document.querySelector('[id^="googlePlusBtn"]')).remove();
    angular.element(document.querySelector('#dummygplusBtn')).after("<div id='googlePlusBtn"+todo.id+"' style='display:none'></div>");
    angular.element(document.querySelector('[id^="googlePlusBtn"]')).bind('click');
    var options = {
       contenturl: 'http://todo-social.herokuapp.com/todos/'+todo.id,
       contentdeeplinkid: '/pages',
       clientid: '1045194091732-aasm5rpi68npeona5srgb01q7o56r0ob.apps.googleusercontent.com',
       cookiepolicy: 'single_host_origin',
       prefilltext: todo.title,
       calltoactionlabel: 'VIEW',
       calltoactionurl: 'http://todo-social.herokuapp.com/todos/'+todo.id,
       calltoactiondeeplinkid: '/pages/create',
       callback: obj.signInCallback
     };
    gapi.interactivepost.render('googlePlusBtn'+todo.id, options);
    window.setTimeout(function(){window.document.getElementById('googlePlusBtn'+todo.id).click();}, 1000);
  }

  // Render the Login button.
  obj.renderGPlusLoginButton = function() {
    angular.element(document.querySelector('[id^="gPlusLoginBtn"]')).remove();
    angular.element(document.querySelector('#dummyGplusLoginBtn')).after("<div id='gPlusLoginBtnContainer' "+
      "style='display:none'><div id='gPlusLoginBtn'></div></div>");
    var options = {
       clientid: '1045194091732-aasm5rpi68npeona5srgb01q7o56r0ob.apps.googleusercontent.com',
       cookiepolicy: 'single_host_origin',
       callback: obj.signInCallback
     };
    gapi.signin.render('gPlusLoginBtn', options);
    window.setTimeout(function(){
      window.document.getElementById('gPlusLoginBtn').firstChild.click();
    }, 1000);
  }

  obj.gPlusCheckLoginStateAndRender = function(action, todo) {
    if($rootScope.gplus_session_state) {
      gapi.auth.checkSessionState({
        client_id: $rootScope.gplus_client_id,
        session_state: $rootScope.gplus_session_state
      }, function(status) {
        if(status) {
          if(action == 'share') {
            obj.renderShareButton(todo);
          } else {
            obj.renderGPlusLoginButton();
          }
        } else {
          gapi.auth.signOut();
          if(action == 'share') {
            obj.renderShareButton(todo);
          } else {
            obj.renderGPlusLoginButton();
          }
        }
      })
    } else {
      if(action == 'share') {
        obj.renderShareButton(todo);
      } else {
        obj.renderGPlusLoginButton();
      }
    }
  }

  return obj;
}])

todoServices.factory('FbService', ['UserService', 'SessionService', '$q', '$rootScope', function(UserService, SessionService, $q, $rootScope) {
  var obj = {};

  obj.fbShare = function(action, todo) {
    FB.login(function(response){
      if (response.status === 'connected') {
        console.log(response);
        if(action == 'login') {
          var data = {
            id: response.authResponse.userID,
            provider: 'fb'
          }
          UserService.login(data).then(function(result) {
            SessionService.isLoggedIn = true;
            $window.sessionStorage.token = result.data;
            $location.path("/todos");
          }, function(reason) {
            console.log('something went horribly wrong.', reason)
          });
        } else {
          var data = {
            token: response.authResponse.accessToken
          }
          UserService.fbtoken(data).then(function(result) {
            console.log(result);
          }, function(reason) {
            console.log('something went horribly wrong.', reason)
          });
          FB.ui({
            method : 'share',
            href: 'http://todo-social.herokuapp.com/todos/'+todo.id,
          }, function(response) {
            console.log(response);
            if (response && !response.error_code) {
              console.log(response.post_id);
            } else {
              // alert('Error while posting.');
            }
          });
        }
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

  obj.fbCheckLoginStateAndRender = function(action, todo) {
    FB.getLoginStatus(function(response) {
      if(response.status === 'connected') {
        FB.api('/me', function(response) {
          if(response.error) {
            obj.fbShare(action, todo);
          } else {
            obj.fbShare(action, todo);
          }
        });
      } else {
        obj.fbShare(action, todo);
      }
    });
  }

  return obj;
}]);

todoServices.factory('TokenInterceptor', ['$q', '$window', 'SessionService', function($q, $window, SessionService) {
  return {
    request : function(config) {
      config.headers = config.headers || {};
      if($window.sessionStorage.token) {
        config.headers.Authorization = $window.sessionStorage.token;
      }
      return config;
    },

    response : function(response) {
      return response || $q.when(response);
    }
  };
}]);