var todoApp = angular.module('todoApp',['todoControllers', 'todoServices', 'todoFilters', 'ui.router']);

var todoControllers = angular.module('todoControllers', []);
var todoServices = angular.module('todoServices', []);
var todoFilters = angular.module('todoFilters', []);

todoApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'partials/login.html',
    controller: 'SessionController'
  })
  .state('home', {
    url: '/home',
    templateUrl: 'partials/home.html'
  })
  .state('home.todos', {
    url: '/todos',
    templateUrl: 'partials/todos.html',
    controller: 'TodoListCtrl'
  })
  .state('home.todos.create', {
    url: '/create',
    templateUrl: 'partials/create.html',
    controller: 'TodoListCtrl'
  })

  $urlRouterProvider.otherwise('/login');
}]);

todoApp.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
}]);

todoApp.run(['$rootScope', '$location', '$window', 'SessionService', function($rootScope, $location, $window, SessionService) {
  $rootScope.$on("$stateChangeStart", function() {
    if(!SessionService.isLoggedIn && !$window.sessionStorage.token) {
      $location.path("/login");
    }
  });
}]);