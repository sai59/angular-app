var todoServices = angular.module('todoServices',[]);

todoServices.factory('todoService', ['$http', '$q', function($http, $q){
  return {

    getTodos: function(){
      return $http.get('insiders/todos')
        .then(function(response){
          return response.data;
        },function(response){
          return "invalid response";
        });
    },

    addTodo: function(todo){
      return $http.post('insiders/todos/new', todo)
        .then(function(response){
          return response.data;
        },function(response){
          return "invalid response";
        });
    }

  }
}]);