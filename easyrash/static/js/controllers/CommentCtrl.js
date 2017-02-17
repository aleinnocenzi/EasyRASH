angular.module('easyRash.controllers').controller('CommentCtrl', CommentCtrl);

CommentCtrl.$inject = ['$scope','$mdDialog','Article','Comment','Userinfo'];

var n_comment = 0;
var dt = new Date();

function CommentCtrl($scope,$mdDialog,Article,Comment,Userinfo){

	article_scope = Article.get('UserInterfaceCtrl');
	selectedIndex = Article.get('UserInterfaceCtrl').selectedIndex;
	comment_modal_mode = Article.get('UserInterfaceCtrl').comment_modal_mode;

	$scope.selected = Comment.selected;
	$scope.new = true;

	var populateReaderModal = function(){
		for(current of Comment.saved){
			if(current.id == Comment.current_id){
				$scope.r_author = current.author.split(':')[1];
				$scope.r_comment = current.comment;
			}
		}
	};

	var populateAnnotatorModal = function(){
		for(current of Comment.unsaved){
			if(current.id == Comment.current_id){
				$scope.c_comment = current.comment;
				if($scope.c_comment == "")
					$scope.c_comment = undefined;
				$scope.new = false;
			}
		}
	};

	if(comment_modal_mode == 1){
		populateReaderModal();
	} else if(comment_modal_mode == 2) {
		populateAnnotatorModal();
	}

	$scope.done = function(){
		if($scope.new){
			$scope.create();
		} else {
			$scope.modify();
		}
		Comment.block_multiple = true;
	};

	$scope.create = function(){
		if($scope.c_comment != undefined){
			var article = $("#rash-view-"+selectedIndex).attr("name");
			var selection = $("#selected-text h3").html().slice(1, -1);
			var short_id = Userinfo.comment_id;
			var comment_id = short_id + "-" + n_comment + "-" + article.split(".html")[0];
			var range = Comment.range;
			var span = document.createElement("span");
			$(span)	.addClass("span_comment")
					.addClass("comment-" + comment_id)
					.attr("id", comment_id)
					.attr("ng-click", "showComment('"+ comment_id +"')");
			if(range.startContainer == range.endContainer && range.startOffset == 0 && range.endOffset == range.endContainer.length && ((range.startContainer.parentNode.nodeName !== "P") && (range.startContainer.parentNode.nodeName !== "FIGCAPTION") && (range.startContainer.parentNode.nodeName !== "SPAN")) ){
				$(span).append(range.startContainer.parentNode);
			} else {
				$(span).append(range.extractContents());
			}
			range.insertNode(span);
			linkToScope(span);

			var comm = {
				id: comment_id,
				text: selection,
				author: Userinfo.email,
				comment: $scope.c_comment,
				date: dt.toUTCString()
			};
			Comment.unsaved.push(comm);
			n_comment++;
			$scope.close();
		}
	};

	$scope.modify = function(){
		if($scope.c_comment == "") $scope.c_comment = undefined;
		if($scope.c_comment != undefined){
			for(current of Comment.unsaved){
				if(current.id == Comment.current_id){
					current.comment = $scope.c_comment;
					current.date = dt.toUTCString();
				}
			}
			$scope.close();
		}
	};

	$scope.delete = function(){
		var index = 0;
		for(current of Comment.unsaved){
			if(current.id == Comment.current_id){
				Comment.unsaved.splice(index, 1);
				$(".comment-" + Comment.current_id).contents().unwrap();
			}
			index++;
		}
		Comment.block_multiple = true;
		$scope.close();
	};

	$scope.close = function(){
		Comment.block_multiple = true;
		$mdDialog.cancel();
	};
}
