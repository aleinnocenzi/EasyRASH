angular.module('easyRash.controllers').controller('UserModalCtrl', UserModalCtrl);

UserModalCtrl.$inject = ['$scope','$mdDialog','API_HUB','Userinfo','Comment'];

function UserModalCtrl($scope,$mdDialog,API_HUB,Userinfo,Comment){

	$scope.name = Userinfo.name;
	$scope.email = Userinfo.email;
	$scope.author = Userinfo.author;
	$scope.chair = Userinfo.chair;
	$scope.reviewer = Userinfo.reviewer;

	$scope.reset = function(){
		if($scope.new_pwd === $scope.confirm_new_pwd){
			API_HUB.resetPassword($scope.old_pwd, $scope.new_pwd);
		} else console.log("le nuove password non corrispondono");
	}

	$scope.close = function(){
		$mdDialog.cancel();
	}
}