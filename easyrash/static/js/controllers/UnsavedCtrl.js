angular.module('easyRash.controllers').controller('UnsavedCtrl', UnsavedCtrl);

UnsavedCtrl.$inject = ['$scope','$mdDialog','Comment'];

function UnsavedCtrl($scope,$mdDialog,Comment){

	$scope.comment_list = Comment.unsaved;

	$scope.close = function(){
		$mdDialog.cancel();
	};
}