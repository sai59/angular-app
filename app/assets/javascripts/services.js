var todoServices = angular.module('todoServices', []);

todoServices.factory('TodoService', ['$http', '$q', function($http, $q) {
  return {
    getTodos: function() {
      return $http.get('insiders/todos');
    },

    createTodo: function(params) {
      return $http.post('insiders/todos/new', params).then(function(response) { return response.data; }, function() { return response.data; });
    }
  }
}])