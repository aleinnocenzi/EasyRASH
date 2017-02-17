angular.module('easyRash.factories').factory('API_HUB', ['$http', 'Userinfo', function($http, Userinfo){

	function logoutSuccess(res){
		window.location.replace('/login');
	}

	function logoutError(err){
		console.log("error logging out");
	}

	function resetSuccess(res){
		$http.get('/api/logout').then(logoutSuccess, logoutError);
	}

	function resetError(err){
		console.log('uncorrect old password');
	}

	return {
		logout: function(){
			$http.get('/api/logout').then(logoutSuccess, logoutError);
		},
		userinfo: function(){
			return $http.get('/api/userinfoadvanced');
		},
		resetPassword: function(old_p, new_p){
			var change_obj = $.param({
				'old_passwd': old_p,
				'passwd': new_p
			});
			var config = {
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
			$http.post('/api/restorePassword', change_obj, config).then(resetSuccess, resetError);
		},
		lock_unlock: function(type, article){
			return $http.get('/api/' + type + '/' + article);
		},
		save: function(title, rashToSave){
			var new_rash = $.param({
				'file_content': rashToSave
			});
			var config = {
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}
			$http.post('/api/saveRash/' + title, new_rash, config);
		}
	}

}]);
