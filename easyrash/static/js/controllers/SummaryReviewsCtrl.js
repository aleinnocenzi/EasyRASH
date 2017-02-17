angular.module('easyRash.controllers').controller('SummaryReviewsCtrl', SummaryReviewsCtrl);

SummaryReviewsCtrl.$inject = ['$scope','$mdDialog', 'Article'];

function SummaryReviewsCtrl($scope,$mdDialog, Article){

    article_scope = Article.get('UserInterfaceCtrl');
	selectedIndex = Article.get('UserInterfaceCtrl').selectedIndex;
    
    $scope.reviews = [];

    $("#rash-view-" + selectedIndex + " .ld-review").each(function(){
        var review = {
            author: undefined,
            score: undefined,
            judgement: undefined,
            decision_advice: undefined
        };
        
        var rev = JSON.parse($(this).text());
        review.author = rev[0]['article']['eval']['author'].split("mailto:")[1];
        review.score = rev[0]['article']['eval']['@type'];
        review.judgement = rev[0]['article']['eval']['general_comment'];
        if(rev[0]['article']['eval']['status'] == 'pso:accepted-for-publication'){
            review.decision_advice = 1;
        } else {
           review.decision_advice = 0; 
        }
        $scope.reviews.push(review);
    });

	$scope.close = function(){
		$mdDialog.cancel();
	};
}