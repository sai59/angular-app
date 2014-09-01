var todoApp = angular.module('todoApp',['todoControllers', 'todoServices', 'todoFilters', 'ui.router']);
var todoControllers = angular.module('todoControllers', []);
var todoServices = angular.module('todoServices', []);
var todoFilters = angular.module('todoFilters', []);

todoApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'partials/login.html',
    controller: 'SessionController'
  })
  .state('todos', {
    url: '/todos',
    templateUrl: 'partials/todos.html',
    controller: 'TodoListCtrl'
  })
  .state('todos.create', {
    url:'/create',
    templateUrl: 'partials/todos.create.html',
    controller: 'TodoListCtrl'
  })
  .state('todos.show', {
      url:'/show/:todoId',
      templateUrl: 'partials/todos.show.html',
      resolve: {
        todo: function($http, $stateParams) {
          return $http.get('insiders/todos/'+$stateParams.todoId)
        }
      },
    controller: function($scope, todo) {
      $scope.todo = todo.data.description;
    }
  })
}]);

todoApp.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('TokenInterceptor');
}]);

todoApp.run(['$rootScope', '$location', '$state', '$window', 'SessionService', function($rootScope, $location, $state, $window, SessionService) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toStateParams) {
    if(!SessionService.isLoggedIn && !$window.sessionStorage.token) {
      $location.path("/login");
    }
  });
}]);