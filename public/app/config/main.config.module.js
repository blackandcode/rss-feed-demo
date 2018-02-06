import angular from 'angular'
import uiRouter from '@uirouter/angularjs';

const app = angular.module('app', [uiRouter]);

app.config(config);

config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$provide'];

function config($stateProvider, $urlRouterProvider, $locationProvider, $provide) {

$urlRouterProvider.otherwise('/');

$provide.decorator('$log', ['$sniffer', function($delegate) {
	$delegate.history = false;
	return $delegate;
}]);

$stateProvider
	.state('login', {
		url: '/login',
		template: require('../authenticate/login.html'),
		controller: "LoginController"
	})
	.state('feeds', {
		url: '/feeds',
		template: require('../feeds/feeds.html'),
		controller: "FeedController"
	})

}