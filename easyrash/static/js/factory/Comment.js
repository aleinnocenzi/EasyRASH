angular.module('easyRash.factories').factory('Comment', function(){
	return {
		selected: undefined,
		range: undefined,
		current_id: undefined,
		unsaved: [],
		saved: [],
		block_multiple: true
	}
});
