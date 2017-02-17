var discardChange = function(old, uid){
	$("#rash-view-" + old + " .span_comment").each(function(){
		var id = $(this).attr("id").split("-")[0];
		if(id == uid){
			$(this).contents().unwrap();
		}
	});
};

function linkToScope(el){
	var $scope = angular.element(el).scope();
	$scope.compile(el);
}

function isOrContains(node) {
	var container = "rash-view-";
    while (node) {
		if(node.id != undefined){
        	if (node.id.split(/[0-9]/)[0] === container) {
            	return true;
        	}
		}
      	node = node.parentNode;
    }
    return false;
}

function isFootnotesBiblio(node) {
    while (node) {
        if ($(node.parentNode).attr("role") === "doc-footnotes" || $(node.parentNode).attr("role") === "doc-bibliography") {
            return true;
        }
      	node = node.parentNode;
    }
    return false;
}

function isHeader(node) {
    while (node) {
		if(node.id != undefined){
        	if (node.parentNode.nodeName === "HEADER") {
            	return true;
        	}
		}
      	node = node.parentNode;
    }
	return false;
}

function toggleSettingsList(){
	if($('#i-miei-articoli').height() !== 0 && $('#settings').height() === 0){
		$('#mypapers').click();
	}
	if($('#lista-conferenze').height() !== 0 && $('#settings').height() === 0){
		$('#userconference').click();
	}
}

function checkAllowedSelection(root, node, ancestor){
	if(window.getSelection().toString()!==""){
		if(isOrContains(node) && !isHeader(node) && !isFootnotesBiblio(node) && (ancestor.nodeName === "SPAN" || ancestor.nodeName === "H1" || ancestor.nodeName === "P" || ancestor.nodeName === "EM" || ancestor.nodeName === "CODE" || ancestor.nodeName === "STRONG" || ancestor.nodeName === "FIGCAPTION" || ancestor.nodeType===3)){
			if( ((root.endContainer.parentNode.nodeName == "A" && root.endOffset < root.endContainer.length) || (root.startContainer.parentNode.nodeName == "A" && root.startOffset > 0)) ||
				((root.endContainer.parentNode.nodeName == "CODE" && root.endOffset < root.endContainer.length) || (root.startContainer.parentNode.nodeName == "CODE" && root.startOffset > 0)) ||
				((root.endContainer.parentNode.nodeName == "STRONG" && root.endOffset < root.endContainer.length) || (root.startContainer.parentNode.nodeName == "STRONG" && root.startOffset > 0))
			) return -2; //selection not allowed
			else return 1; //ok
		}
		return -2; //selection not allowed

	}
	return -1; //empty selection
}

function hideOldShowCurrent(old,current){
	$("#rash-view-" + old).hide();
	$("#rash-view-" + current).show();
	$("#closetab" + old + ".close-tab").hide();
	$("#closetab" + current + ".close-tab").show();
}

function activateAnnotatorView(tab){
	$("#rash-view-" + tab + " a").css("pointer-events", "none");
	$("#rash-view-" + tab + " header").css("background-color", "#ffb9b9");
	$("#rash-view-" + tab + " section[role=doc-bibliography]").css("background-color", "#ffb9b9");
	$("#rash-view-" + tab + " section[role=doc-footnotes]").css("background-color", "#ffb9b9");
	$("#rash-view-" + tab + " header").css("cursor", "not-allowed");
	$("#rash-view-" + tab + " section[role=doc-bibliography]").css("cursor", "not-allowed");
	$("#rash-view-" + tab + " section[role=doc-footnotes]").css("cursor", "not-allowed");
}

function deactivateAnnotatorView(tab){
	$("#rash-view-" + tab + " a").css("pointer-events", "");
	$("#rash-view-" + tab + " header").css("background-color", "");
	$("#rash-view-" + tab + " section[role=doc-bibliography]").css("background-color", "");
	$("#rash-view-" + tab + " section[role=doc-footnotes]").css("background-color", "");
	$("#rash-view-" + tab + " header").css("cursor", "");
	$("#rash-view-" + tab + " section[role=doc-bibliography]").css("cursor", "");
	$("#rash-view-" + tab + " section[role=doc-footnotes]").css("cursor", "");
}

function handleLockUnlock(api, article, scope, API_HUB, Userinfo, saved=false){
	API_HUB.lock_unlock(api, article)
	.then(function success(){
		Userinfo.annotator = !Userinfo.annotator;
		scope.annotator = !scope.annotator;
		if(saved) {
			scope.messageToast("Congratulations, your review has been saved!", 2);
		} else {
			scope.readerAnnotatorToast();
		}
		if(Userinfo.annotator){
			activateAnnotatorView(scope.selectedIndex);
		} else {
			deactivateAnnotatorView(scope.selectedIndex);
		}
	}, function error(error){
		if(error.status == 400)
		scope.messageToast("You can't unlock the article", 1);
		else if(error.status == 401)
		scope.messageToast("You can't make annotation here", 1);
		else if(error.status == 404)
			console.log("article not found");
	});
};

function handle_action_buttons_view(scope, Userinfo, index, name){
	var chair_view = false;
	if(index != undefined) url = $("#rash-view-" + index).attr("name");
	else {
		url = name;
		index = scope.selectedIndex;
	}
	for(obj of Userinfo.chair){
		for(submission of obj.submissions){
			if(submission == url){
				if (url in Userinfo.reviewer && $("#rev"+Userinfo.comment_id+url.split(".html")[0]).length == 0){
					scope.ra = true;
					scope.ch = false;
				}
				else{
					var elem = $("#rash-view-" + index + " .ld-decision");
					scope.ra = false;
					scope.ch = true;
					chair_view = true;
					if(elem.length > 0){
						scope.decided = true;
						var decision = JSON.parse($(elem).text())
						if(decision[0]["article"]["eval"]["status"] == "pso:accepted-for-publication")
							scope.accepted = true;
							else
							scope.accepted = false;
					}
					else{
						scope.decided = false;
						var i = 0;
						$("#rash-view-"+ index + " .ld-review").each(function(){
							i++;
						});
						if(Userinfo.number_reviewers[url] == i)
							scope.not_all_rev = false;
						else
							scope.not_all_rev = true;
					}
				}
			}
		}
	}
	var aut = false;
	for (current of Userinfo.author){
		if(current == $("#rash-view-" + index).attr("title"))
			aut = true;
	}
	if(!chair_view || aut){
		var elem = $("#rash-view-" + index + " .ld-decision");
		if(elem.length > 0){
			scope.ra = false;
			scope.ch = true;
			scope.decided = true;
			var decision = JSON.parse($(elem).text())
			if(decision[0]["article"]["eval"]["status"] == "pso:accepted-for-publication")
				scope.accepted = true;
				else
				scope.accepted = false;
		}
		else{
			scope.ra = true;
			scope.ch = false;
		}
	}
}