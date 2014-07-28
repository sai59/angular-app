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
    }
  }
}])

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