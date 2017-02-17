angular.module('easyRash.controllers').controller('MessageToastCtrl', MessageToastCtrl);

MessageToastCtrl.$inject = ['$scope','$mdToast','Message'];

function MessageToastCtrl($scope,$mdToast,Message){

	$scope.message = Message.string;
	
	$scope.close = function(){
		$mdToast.hide();
	};
}