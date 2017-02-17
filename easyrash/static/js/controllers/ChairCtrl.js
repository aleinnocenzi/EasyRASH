angular.module('easyRash.controllers').controller('ChairCtrl', ChairCtrl);

ChairCtrl.$inject = ['$scope','$mdDialog','API_HUB','Article','Comment','Userinfo'];

var dt = new Date();

function ChairCtrl($scope,$mdDialog,API_HUB,Article,Comment,Userinfo){
  article_scope = Article.get('UserInterfaceCtrl');
  selectedIndex = Article.get('UserInterfaceCtrl').selectedIndex;
  $scope.comment_list = Comment.unsaved;
  $scope.status = "accepted-for-publication";
  $scope.rating = 3;
  var article = $("#rash-view-"+selectedIndex).attr("name");

  $scope.save = function(){
      var populate_json = [{
        "@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
        "@type": "decision",
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
      },
      {
        "@context": "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb16/context.json",
        "@type": "person",
        "@id": "mailto:" + Userinfo.email,
        "name": Userinfo.name,
        "as": {
          "@id": Userinfo.comment_id,
          "@type": "role",
          "role_type": "pro:chair",
          "in": ""
      }
    }];

    var jsonLd = JSON.stringify(populate_json);
    var script = document.createElement("script");
    $(script).append(jsonLd);
    $(script).attr("type", "application/ld+json")
            .attr("id", "chair"+Userinfo.comment_id+article.split(".html")[0])
            .addClass("ld-decision");
    var rash_id = selectedIndex;
    $("#rash-view-"+rash_id+" section[role=doc-abstract]").before(script);
    reverse(selectedIndex);
    var articleToSave =  $('#rash-view-'+selectedIndex).html();
    var new_rash = addHHB(articleToSave);
    API_HUB.save(article, new_rash);
    article_scope.removeRASH(selectedIndex);
    article_scope.messageToast("Congratulation, your decision has been submitted!", 2)
    $mdDialog.cancel();
  };

  $scope.close = function(){
		$mdDialog.cancel();
	};

}
