function reverse(index){

	rash_selector = "#rash-view-" + index;	//rimozione header

	$(rash_selector + " header").remove();

	//rimozione classe container-fluid a tutte le sezioni
	$(rash_selector + " section").removeAttr("class");

	//rimozione figure X table X ecc...
	$(rash_selector + " strong.cgen").remove();

	//rimozione riferimento references
	$(rash_selector + " a.cgen").each(function(){
		var title = $(this).attr("title");
		if(title != undefined){
			$(this).removeAttr("title");
		}
		$(this).removeAttr("class");
		$(this).text(" ");
	});

	//rimozione riferimento ai footnotes
	$(rash_selector + " sup.cgen a").each(function(){
		if($(this).text() == '[back]'){
			$(this).remove();
		} else {
			$(this).unwrap();
			$(this).removeAttr("name");
			$(this).removeAttr("title");
			var href_modified = $(this).attr("href");
			var href = href_modified.split("-rash-view-");
			$(this).attr("href", href[0]);
			$(this).text(" ");
		}
	});

	//rimozione h1 footnotes
	$(rash_selector + " section[role=doc-footnotes] h1").remove();

	//modifica id delle sezioni footnote
	$(rash_selector + " section[role=doc-footnotes] section[role=doc-footnote]").each(function(){
		var id_modified = $(this).attr("id");
		var id = id_modified.split("-rash-view-");
		$(this).attr("id", id[0]);
	});

	//rimozione <a> del back
	$(rash_selector + " section[role=doc-footnotes] section[role=doc-footnote] p a:nth-child(2)").remove();

	//rimozione tag tbody
	$(rash_selector + " table tbody tr").unwrap();

	//ol -> ul
	$(rash_selector + " section[role=doc-bibliography] ol").replaceWith(function(){
    	return "<ul>" + $(this).html() + "</ul>";
	});

	//h2,h3,h4,h5,h6 -> h1
	$(rash_selector + ' section h2, ' + rash_selector + ' section h3, ' + rash_selector + ' section h4, ' + rash_selector + ' section h5, ' + rash_selector +' section h6').replaceWith(function(){
    	return "<h1>" + $(this).html() + "</h1>";
	});

}

function addHHB(rash){
	rash = rash.split("<section");
	var len = rash.length;
	var final_rash = "<html><head>" + rash[0] + "</head><body>";
	for(var i = 1; i < len; i++){
		final_rash = final_rash + "<section" + rash[i];
	}
	final_rash = final_rash +"</body></html>";
	return final_rash
}
