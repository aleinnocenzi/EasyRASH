angular.module("easyRash", ['easyRash.controllers','easyRash.directives','easyRash.factories','ngMaterial','ngAnimate'])

	.config(['$interpolateProvider', function($interpolateProvider) {
		$interpolateProvider.startSymbol('{a');
		$interpolateProvider.endSymbol('a}');
	}]);