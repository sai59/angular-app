var todoApp = angular.module('todoApp',['todoControllers', 'todoServices', 'ngRoute']);

var todoControllers = angular.module('todoControllers', []);
var todoServices = angular.module('todoServices', []);

todoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/todos', {
    templateUrl: 'partials/todos.html',
    controller: 'TodoListCtrl'
  })
  .otherwise({
    redirectTo: '/'
  })
}]);
