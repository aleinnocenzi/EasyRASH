angular.module('easyRash.controllers').controller('SaveCtrl', SaveCtrl);

SaveCtrl.$inject = ['$scope','$mdDialog','API_HUB','Article','Comment','Userinfo'];

var dt = new Date();

function SaveCtrl($scope,$mdDialog,API_HUB,Article,Comment,Userinfo){
  article_scope = Article.get('UserInterfaceCtrl');
  selectedIndex = Article.get('UserInterfaceCtrl').selectedIndex;
  $scope.comment_list = Comment.unsaved;
  $scope.status = "accepted-for-publication";
  $scope.rating = 3;
  var article = $("#rash-view-"+selectedIndex).attr("name");

  $scope.save = function(){
    var populate_json = [{
      "@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
      "@type": "review",
      "@id": Userinfo.comment_id,
      "article": {
        "@id": article,
        "eval": {
          "@id": Userinfo.comment_id+"-eval",
          "@type": $scope.rating,//vote,
          "status": "pso:"+$scope.status,// + stato,
          "author": "mailto:" + Userinfo.email,
          "general_comment": $scope.comment_obj,
          "date": dt.toUTCString()
        }
      },
      comments: []
    },
    {
      "@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
      "@type": "person",
      "@id": "mailto:" + Userinfo.email,
      "name": Userinfo.name,
      "as": {
        "@id": Userinfo.comment_id,
        "@type": "role",
        "role_type": "pro:reviewer",
        "in": ""
    }
  }]

  for(current of Comment.unsaved){
    var comment = {
      "@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
      "@type": "comment",
      "@id": current.id,
      "text": current.comment,
      "selection": current.text,
      "ref": current.id,
      "author": "mailto:" + current.author,
      "date": current.date
    }
    populate_json.push(comment)
    populate_json[0].comments.push(current.id);
  }
    var jsonLd = JSON.stringify(populate_json);
    var script = document.createElement("script");
    $(script).append(jsonLd);
    $(script).attr("type", "application/ld+json")
             .attr("id", "rev"+Userinfo.comment_id+article.split(".html")[0])
             .addClass("ld-review");
    var rash_id = selectedIndex;
    //$("#rash-view-"+rash_id).append(script);
    $("#rash-view-"+rash_id+" section[role=doc-abstract]").before(script);
    deactivateAnnotatorView(selectedIndex);
    reverse(selectedIndex);
    var articleToSave =  $('#rash-view-'+selectedIndex).html();
    var new_rash = addHHB(articleToSave);
    API_HUB.save(article, new_rash);
    handleLockUnlock("unlock", article, article_scope, API_HUB, Userinfo, true);
    article_scope.removeRASH(selectedIndex, true);
    $mdDialog.cancel();
  };

  $scope.close = function(){
		$mdDialog.cancel();
	};

}
