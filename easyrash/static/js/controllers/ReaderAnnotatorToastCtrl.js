angular.module('easyRash.controllers').controller('ReaderAnnotatorToastCtrl', ReaderAnnotatorToastCtrl);

ReaderAnnotatorToastCtrl.$inject = ['$scope','$mdToast','Userinfo'];

function ReaderAnnotatorToastCtrl($scope,$mdToast,Userinfo){

	if(!Userinfo.annotator) $scope.usermode = 'reader';
	else $scope.usermode = 'annotator';

	$scope.close = function(){
		$mdToast.hide();
	};
}