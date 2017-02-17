angular.module('easyRash.factories').factory('Userinfo', function(){
	return {
		name: undefined,
		sex: undefined,
		email: undefined,
		chair: [],
		author: [],
		reviewer: [],
		number_reviewers: [],
		annotator: false, //false when user is reader, true when user is annotator
		comment_id: undefined
	}
});
