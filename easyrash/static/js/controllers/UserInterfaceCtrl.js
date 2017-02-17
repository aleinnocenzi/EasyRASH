angular.module('easyRash.controllers').controller('UserInterfaceCtrl', UserInterfaceCtrl);

UserInterfaceCtrl.$inject = ['$scope','$http','$timeout','$compile','$mdSidenav','$mdDialog','$mdToast','API_HUB','Userinfo','Article','Message','Comment'];

function UserInterfaceCtrl($scope,$http,$timeout,$compile,$mdSidenav,$mdDialog,$mdToast,API_HUB,Userinfo,Article,Message,Comment){

	Article.store('UserInterfaceCtrl', $scope);

	var tabs = [];
	var change_tab_mode = 0; //0: switch | 1: load | 2:remove
	var break_watch_loop = -1;
	$scope.tabs = tabs;
	$scope.selectedIndex = 0;
	$scope.annotator = false;
	$scope.unsaved_comment = true;
	$scope.decided = false;
	$scope.not_all_rev = true;
	$scope.my = true;

	$timeout(function(){
		$('div#loading').fadeOut(1000);
	}, 2500);

	$scope.$watch(function(){
		return Comment.unsaved.length;
	}, function(newValue, oldValue){
		if(newValue > 0){
			$scope.unsaved_comment = false;
		}
		else if(newValue == 0){
			$scope.unsaved_comment = true;
		}
	});

	$scope.$watch('selectedIndex', function(current, old){
		if(break_watch_loop !== $scope.selectedIndex){
			if(change_tab_mode === 0){ //ho solo switchato tra 2 tab gia aperte
				var choice_on_switch = true;
				if($scope.annotator){
					choice_on_switch = checkConfirm(old);
					if(choice_on_switch){
						deactivateAnnotatorView(old);
						discardChange(old, Userinfo.comment_id);
					}
				}
				if(choice_on_switch){
					handle_action_buttons_view($scope, Userinfo, current, undefined);
					hideOldShowCurrent(old,current);
					Comment.unsaved = [];
				} else {
					$scope.selectedIndex = old;
					break_watch_loop = $scope.selectedIndex;
				}
			} else {
				handle_action_buttons_view($scope, Userinfo, current, undefined);
				hideOldShowCurrent(old,current);
				change_tab_mode = 0;
				Comment.unsaved = [];
			}
		} else {
			break_watch_loop = -1;
		}
	});

	var checkConfirm = function(doc){
		var cancel = true;
		if(Comment.unsaved.length > 0){
			cancel = confirm("Are you sure? You'll lose all your changes!");
		}
		if(cancel){
			var article = $("#rash-view-"+doc).attr("name");
			handleLockUnlock("unlock", article, $scope, API_HUB, Userinfo);
		}
		return cancel;
	};

	window.onbeforeunload = function() {
		if($scope.annotator){
			var article = $("#rash-view-"+$scope.selectedIndex).attr("name");
			$.ajax({
				url: '/api/unlock/' + article,
				async: false
			});
		}
  	};

	$scope.loadRASH = function (title, url) {
		if(window.getSelection().isCollapsed){
			change_tab_mode = 1;
			var choice_on_load = true;
			if($scope.annotator){
				choice_on_load = checkConfirm($scope.selectedIndex);
				if(choice_on_load) discardChange($scope.selectedIndex, Userinfo.comment_id);
			}
			if(choice_on_load){
				if($scope.annotator) deactivateAnnotatorView($scope.selectedIndex);
				var found = false;
				var i = 0;
				for(current of tabs){
					if(current.content === "static/dataset/" + url){
						found = true;
						$scope.selectedIndex = i;
					}
					i++;
				}
				if(!found){
					tabs.push({ title: title, content: "static/dataset/" + url, disabled: false});
					angular.element(document).ready(function() {
						var tabs_length = tabs.length;
						var last_tab_id = "#rash-view-" + (tabs_length-1);
						var last_tab = tabs[tabs_length-1];
						$(last_tab_id).attr('name', url);
						$(last_tab_id).load(last_tab.content, function (data){
							handle_action_buttons_view($scope, Userinfo, undefined, url);
							var reviews = [];
							linkToScope("#rash-view-"+$scope.selectedIndex);
							$("#rash-view-"+$scope.selectedIndex+" .ld-review").each(function(){
								var review = JSON.parse($(this).text());
								for(var i = 2; i < review.length; i++){
									var comm = {
										id: review[i]["@id"],
										text: review[i]["selection"],
										author: review[i]["author"],
										comment: review[i]["text"],
										date: review[i]["date"]
									};
									Comment.saved.push(comm);
								}
							});
						});
					});
				}
			} else {
				change_tab_mode = 0;
			}
		}
	};

	$scope.removeRASH = function (tab, saving=false) {
		change_tab_mode = 2;
		var index = tabs.indexOf(tab);
		var choice_on_remove = true;
		if($scope.annotator && !saving){
			choice_on_remove = checkConfirm(index);
		}
		if(choice_on_remove){
			tabs.splice(index,1);
			var next = index+1;
			var i;
			if($scope.selectedIndex < tabs.length){
				i = next;
			} else {
				i = index-1;
			}
			handle_action_buttons_view($scope, Userinfo, i, undefined);
			hideOldShowCurrent(index,next);
			Comment.unsaved = [];
		} else {
			change_tab_mode = 0;
		}
	};

	$scope.toggleReaderAnnotatorChair = function(){
		var choice_discard = true;
		if($scope.annotator){
			choice_discard = checkConfirm($scope.selectedIndex);
			if(choice_discard) discardChange($scope.selectedIndex, Userinfo.comment_id);
		}
		if(choice_discard){
			var article = $("#rash-view-"+$scope.selectedIndex).attr("name");
			var rev = document.getElementById("rev"+Userinfo.comment_id+article.split(".html")[0]);
 			if(!rev){
				Comment.unsaved = [];
				if(!$scope.annotator){
					api = "lock";
					handleLockUnlock(api, article, $scope, API_HUB, Userinfo);
				}
			}
			else $scope.messageToast("The article was annotated, You can't make annotation anymore!", 1);
		}
	};

	$scope.showAlert = function(ev, action, str, but){
		$mdDialog.show(
			$mdDialog.alert()
				.parent(angular.element(document.body))
				.clickOutsideToClose(true)
				.title(action)
				.textContent(str)
				.ariaLabel(str)
				.ok(but)
				.targetEvent(ev)
		);
	};

	$scope.toggleSidenav = function(){
		$mdSidenav('left').toggle();
	};

  	$scope.closeSidenavSections = function(){
		toggleSettingsList();
  	};

	$scope.readerAnnotatorToast = function() {
		$mdToast.show({
			position: 'top right',
			hideDelay: 2000,
			controller: 'ReaderAnnotatorToastCtrl',
			templateUrl: 'UI-Templates/reader-annotator-toast-template.html'
		});
	};

	$scope.messageToast = function(message, mode) {
		Message.string = message;
		var config = {
			template: undefined,
			delay: 2000
		};

		if(mode == 1) { // error
			config.template = 'UI-Templates/error-toast-template.html'
		} else if(mode == 2) { //success
			config.template = 'UI-Templates/success-toast-template.html'
			config.delay = 3000;
		}
		$mdToast.show({
				position: 'top right',
				hideDelay: config.delay,
				controller: 'MessageToastCtrl',
				templateUrl: config.template
		});
	};

	$scope.userInfoModal = function(ev) {
		$mdDialog.show({
			controller: 'UserModalCtrl',
			templateUrl: 'UI-Templates/user-info-modal-template.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: true
		});
	};

	$scope.readerModal = function(ev) {
		$mdDialog.show({
		  controller: 'CommentCtrl',
		  templateUrl: 'UI-Templates/reader-modal-template.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:false,
		  fullscreen: true
		});
	};

	$scope.commentModal = function(ev) {
		$mdDialog.show({
		  controller: 'CommentCtrl',
		  templateUrl: 'UI-Templates/comment-modal-template.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:false,
		  fullscreen: true
		});
	};

	$scope.unsavedModal = function(ev) {
		$mdDialog.show({
		  controller: 'UnsavedCtrl',
		  templateUrl: 'UI-Templates/unsaved-modal-template.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:true,
		  fullscreen: true
		});
	};

	$scope.saveModal = function(ev) {
    	$mdDialog.show({
			controller: 'SaveCtrl',
			templateUrl: 'UI-Templates/save-modal-template.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false,
			fullscreen: true
    	});
  	};

	$scope.summaryReviewsModal = function(ev) {
		var revs = $("#rash-view-" + $scope.selectedIndex + " .ld-review");
		if(revs.length == 0){
			$scope.messageToast("Error. There aren't reviews for this article yet.", 1);
		} else {
			$mdDialog.show({
				controller: 'SummaryReviewsCtrl',
				templateUrl: 'UI-Templates/summary-reviews-modal-template.html',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true,
				fullscreen: true
			});
		}
  	};

	$scope.chairModal = function(ev) {
		$mdDialog.show({
			controller: 'ChairCtrl',
			templateUrl: 'UI-Templates/decision-modal-template.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:false,
			fullscreen: true
		});
  	};

	$scope.confirmLogout = function(ev) {
	    var confirm = $mdDialog.confirm()
	          .title('Are you sure you want to logout?')
	          .ariaLabel('Are you sure you want to logout?')
	          .targetEvent(ev)
	          .ok('Yes')
	          .cancel('No');

	    $mdDialog.show(confirm).then(function() {
	    	API_HUB.logout();
	    });
  	};

	$scope.comment = function(){
		Comment.current_id = undefined;
		var root = window.getSelection().getRangeAt(0);
		var node = root.startContainer.parentNode;
		var ancestor = root.commonAncestorContainer;
		var allowed = checkAllowedSelection(root, node, ancestor);
		switch(allowed){
			case 1: {
				Comment.selected = window.getSelection().toString();
				Comment.range = root;
				$scope.commentModal();
				break;
			}
			case -1: {
				$scope.messageToast("Select something", 1);
				break;
			}
			case -2: {
				$scope.messageToast("Selection not allowed. Check tutorial for more informations", 1);
				break;
			}
		}
	};

	$scope.showComment = function(c_id){
		if(Comment.block_multiple){
			Comment.block_multiple = false;
				if(window.getSelection().isCollapsed){
					Comment.current_id = c_id;
					if(!$scope.annotator ||  Userinfo.comment_id != c_id.split("-")[0]){
						for(current of Comment.saved){
							if(current.id == Comment.current_id){
								Comment.selected = current.text;
							}
						}
						$scope.comment_modal_mode = 1;//reader
						$scope.readerModal();
					}
					else{
						for(current of Comment.unsaved){
							if(current.id == Comment.current_id){
								Comment.selected = current.text;
							}
						}
						$scope.comment_modal_mode = 2; //annotator
  						$scope.commentModal();
					}
				}
		}
	};

	$scope.compile = function(element){
		$compile(element)($scope);
	};

	var init = function(){
		API_HUB.userinfo().then(function userinfoSuccess(res){
			data = res.data;
			Userinfo.name = data.given_name + ' ' + data.family_name;
			Userinfo.sex = data.sex;
			Userinfo.email = data.email;
			Userinfo.comment_id = data.comment_id;
			Userinfo.number_reviewers = data.number_reviewers;
			Userinfo.reviewer = data.reviewer;
			for(current of data.chair){
				Userinfo.chair.push(current);
			}
			for(current of data.author){
				Userinfo.author.push(current);
			}
			/*for(current of data.reviewer){
				Userinfo.reviewer.push(current);
			}*/
			if(Userinfo.author.length == 0) $scope.my = false;
		}, function userinfoError(err){
			console.log('error getting user information');
		});
	};

	init();
}
