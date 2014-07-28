var todoApp = angular.module('todoApp',['todoControllers', 'todoServices', 'todoFilters', 'ngRoute']);

var todoControllers = angular.module('todoControllers', []);
var todoServices = angular.module('todoServices', []);
var todoFilters = angular.module('todoFilters', []);

todoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'SessionController'
  })
  .when('/todos', {
    templateUrl: 'partials/todos.html',
    controller: 'TodoListCtrl'
  })
  .otherwise({
    redirectTo: '/'
  })
}]);

todoApp.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
}]);

todoApp.run(['$rootScope', '$location', '$window', 'SessionService', function($rootScope, $location, $window, SessionService) {
  $rootScope.$on("$routeChangeStart", function() {
    if(!SessionService.isLoggedIn && !$window.sessionStorage.token) {
      $location.path("/login");
    }
  });
}]);