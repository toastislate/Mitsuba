if (localStorage.getItem("firsttime") != 1)
{
	localStorage.setItem("firsttime", 1);
	localStorage.setItem("o_hider", 1);
	localStorage.setItem("o_expander", 1);
	localStorage.setItem("o_backlinks", 1);
	localStorage.setItem("o_preview", 1);

	localStorage.setItem("o_loader", 0);
	localStorage.setItem("o_watched", 0);
	localStorage.setItem("o_updater", 0);
	localStorage.setItem("o_imgexpand", 0);
	localStorage.setItem("o_fastreply", 0);
}
if (typeof $.cookie("mitsuba_style") !== "undefined")
{
	$("#switch").attr("href", $.cookie("mitsuba_style"));
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function strStartsWith(str, prefix) {
	return str.indexOf(prefix) === 0;
}


$(document).ready(function () {
	fillFields();
	if ($(".postingMode").length == 0) //outside thread
	{
		if (localStorage.getItem("o_hider") == 1)
		{
			addThreadHider("body");
			hideThreads();
		}
		if (localStorage.getItem("o_expander") == 1)
		{
			addThreadExpander("body");
		}
		if (localStorage.getItem("o_watched") == 1)
		{
			handleWatched("body");
		}
		if (localStorage.getItem("o_loader") == 1)
		{
			addLoader();
		}
	} else { //in thread
		if (localStorage.getItem("o_updater") == 1)
		{
			addThreadUpdater();
		}
	}
	
	addStylechanger();
	if (localStorage.getItem("o_backlinks") == 1)
	{
		addBacklinks("body");
	}
	if (localStorage.getItem("o_preview") == 1)
	{
		addPostpreview("body");
	}
	if (localStorage.getItem("o_imgexpand") == 1)
	{
		addImgExpand("body");
	}
	if (localStorage.getItem("o_fastreply") == 1)
	{

	}
	addQuotelinks();

	addSettings();
});

var currentPage = 0;
function addLoader()
{
	$(".deleteform").css("position", "fixed").css("opacity", "0.7").css("bottom", "10px").css("right", "10px");
	var strong = $(".pagelist").find("strong")[0];
	currentPage = $(strong).html();
	var nextPageEl = $(strong).parent().next();
	if (nextPageEl.length >= 1)
	{
		$(window).scroll(function() {   
			if($(window).scrollTop() + $(window).height() == $(document).height()) {
				$(".pagelist").css("opacity", "0.5");
				$(window).unbind('scroll');
				$.ajax({
				type: 'get',
				url: "./"+$(nextPageEl).html()+".html",
				success: function(data, textStatus, xhr){
					$(".pagelist").css("opacity", "");
					var html = xhr.responseText;
					var nodes = $.parseHTML( html );
					currentPage = $(nextPageEl).html();
					$(".deleteform").before("<div class='board' id='b"+currentPage+"'><br /><b>Page "+currentPage+"</b><hr />"+$($(".board", nodes)[0]).html()+"</div>");
					$(".prev").html($(".prev", nodes).html());
					$(".pages").html($(".pages", nodes).html());
					$(".next").html($(".next", nodes).html());
					addBacklinks("#b"+currentPage);
					addPostpreview("#b"+currentPage);
					addImgExpand("#b"+currentPage);
					addThreadHider("#b"+currentPage);
					addThreadExpander("#b"+currentPage);
					hideThreads();
					addLoader();
						
					}
				});
			}
		});
	}
	
}

var settingsShown = 0;

function addSettings()
{
	$("body").prepend("<span style='float:right;'>[<a id='settingsbutton' href='#'>Settings</a>]</span>");
	$("body").prepend("<div id='settingsDivWrap' style='z-index:9000; display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.247);'><div id='settingsDiv' style='width: 400px; height: 100%; margin: auto; background: rgb(241, 225, 215); overflow: auto; z-index: 9001;'> \
		<span style='font-size:20px; display: block; text-align: center; background: #ffccaa;'>Settings</span> \
		<hr /> \
		<input type='checkbox' name='o_hider' /> Enable thread hider<br />\
		<input type='checkbox' name='o_expander' /> Enable thread expander<br />\
		<input type='checkbox' name='o_backlinks' /> Enable backlinks<br />\
		<input type='checkbox' name='o_preview' /> Enable post preview<br />\
		<input type='checkbox' name='o_loader' /> Enable page loader<br />\
		<input type='checkbox' name='o_watched' /> Enable watched threads<br />\
		<input type='checkbox' name='o_updater' /> Enable updater<br />\
		<input type='checkbox' name='o_imgexpand' /> Enable image expander (RES)<br />\
		<input type='checkbox' name='o_fastreply' /> Enable fast reply<br />\
		<hr /> \
		<input type='button' value='Save' id='settingsSave'/> <input type='button' value='Reset' id='settingsReset'/>\
		</div></div>");
	
	$("#settingsSave").click(function (e) {
		$("input[name^='o_']").each(function ()
		{
			if ($(this).prop("checked"))
			{
				localStorage.setItem($(this).attr("name"), 1);
			} else {
				localStorage.setItem($(this).attr("name"), 0);
			}
		});
		window.location.reload();
	});
	$("#settingsReset").click(function (e) {
		localStorage.setItem("firsttime", 0);
		window.location.reload();
	});
	$("#settingsDivWrap").click(function (e) {
		if( e.target !== this ) 
			return;
		$(this).css("display", "none");
		e.preventDefault();
	});
	$("#settingsbutton").click(function (e) {
		$("input[name^='o_']").attr("checked", false);
		for (var key in localStorage)
		{
			if ((key.substring(0, 2) == "o_") && (localStorage.getItem(key) == 1))
			{
				$("input[name='"+key+"']").attr("checked", true);
			}
		}
		//$("#settingsDiv").css("display","");
		$("#settingsDivWrap").css("display","");
		/*if (settingsShown == 0)
		{
			settingsShown = 1;
			$("#settingsDiv").css("display","");
		} else {
			settingsShown = 0;
			$("#settingsDiv").css("display","none");
		}*/
		e.preventDefault();
	});
}

function fillFields()
{
	if (typeof $.cookie("mitsuba_name") !== "undefined")
	{
		$("input[name='name']").val($.cookie("mitsuba_name"));
	}
	
	if (typeof $.cookie("mitsuba_email") !== "undefined")
	{
		$("input[name='email']").val($.cookie("mitsuba_email"));
	}
	
	if (typeof $.cookie("mitsuba_fakeid") !== "undefined")
	{
		$("input[name='fake_id']").val($.cookie("mitsuba_fakeid"));
	}
}

function addThreadUpdater()
{
	
}

function addQuotelinks()
{
	$(".quotePost").click(function () {
		try {
			event.preventDefault();
			var id = $(this).attr("id").substr(1);
			var textarea = $("#postForm textarea[name='com']")[0];
			$(textarea).val($(textarea).val()+'>>'+id+'\n'); 
		} catch (ex) {
			
		}
	});
}

function addStylechanger()
{
	$("#stylechangerDiv").css("display", "block");
	$("link[rel='alternate stylesheet']").each(function () {
		var selected = "";
		if (typeof $.cookie("mitsuba_style") !== "undefined")
		{
			if (absolutizeURI(window.location.href, $(this).attr("href")) == $.cookie("mitsuba_style"))
			{
				selected = " selected";
			}
		}
		$("#stylechanger").append("<option value='"+$(this).attr("href")+"'"+selected+">"+$(this).attr("title")+"</option>");
	});
	$("#stylechanger").change(function (e) {
		$("#switch").attr("href", e.target.options[e.target.selectedIndex].value);
		$.cookie("mitsuba_style", absolutizeURI(window.location.href, e.target.options[e.target.selectedIndex].value), {expires: 31, path: '/'});
	});
	
	
}

function addPostpreview(parent)
{
	$("body").append('<div id="quote-preview" class="post preview" style="display: none; position: absolute; z-index:999;"></div>');
	$(parent).find(".quotelink").mouseenter(function () { showPostPreview(this); });
	$(parent).find(".quotelink").mouseleave(function () { hidePostPreview(this); });
}

function addBacklinks(parent)
{
	$(parent).find(".postMessage").each(function () {
		
		$(this).append('<div class="backlink" id="bl'+$(this).attr("id").substr(1)+'"></div>');
		
	});
	$(parent).find(".quotelink:not(cross)").each(function () {
		var hr = $(this).attr("href");
		var postid = hr.substr(hr.indexOf('#')+2);
		//here
		try {
			
		if ($("#bl"+postid).html() == "")
		{
			$("#bl"+postid).append("<hr />");
		}
		$("#bl"+postid).append("<span><a href='#p"+$(this).parent(".postMessage").attr("id").substr(1)+"' class='quotelink'>>>"+$(this).parent(".postMessage").attr("id").substr(1)+"</a> </span>");
		} catch(ex) {
			
		}
	});
}

function addThreadExpander(parent)
{
	
	$(parent).find(".thread").each(function () {
		$('<a href="javascript:;" class="expander" id="e'+$(this).attr("id")+'">[+]</a>').insertAfter($("div#"+$(this).attr("id")+" > span.summary")).click(function () {
			var tid = "#"+$(this).attr("id").substr(1);
			var href = absolutizeURI(window.location.href, $(tid).find(".replylink").attr("href"));
			$.ajax({
			type: 'get',
			url: href,
			success: function(data, textStatus, xhr){
				var html = xhr.responseText;
				var nodes = $.parseHTML( html );
				$(tid).fadeOut(100, function()
					{
						$(tid).fadeIn(200);
					});

				$(tid).html($(tid, nodes).html());

				$('<a href="javascript:;" class="hider" id="ht'+tid.substr(2)+'">[-]</a>').appendTo($(tid+" div.op div.postInfo")).click(function () {
					var id = $(this).attr("id").substr(2);
					thread_toggle(id);
				});
				$('<span> &nbsp; [<a href="'+href+'" class="replylink">Reply</a>] </span>').insertAfter($(tid+" div.op span.postNum"));
				$(tid).find("a").each( function () { if ($(this).attr("href") !== null) { $(this).attr("href", absolutizeURI(href, $(this).attr("href"))); } } );
				$(tid).find("img").each( function () { $(this).attr("src", absolutizeURI(href, $(this).attr("src")));  } );
				
				addBacklinks(tid);
				addPostpreview(tid);
				addImgExpand(tid);
					
				}
			});
		});
	});
}

function addThreadHider(parent)
{
	$(parent).find(".op .postInfo").each(function () {
		var id = $(this).attr("id").substr(2);
		$(this).append(' <a href="javascript:;" class="hider" id="ht'+id+'">[-]</a>');
	});

	$(parent).find(".hider").click(function () {
		var id = $(this).attr("id").substr(2);
		thread_toggle(id);
	});
}

function showPostPreview( el )
{
	var href = $(el).attr("href").split("#");
	var curl = window.location.href.split("#");
	curl = curl[0];
	href = absolutizeURI(curl, href[0]);
	if (href == curl)
	{
		var hr = $(el).attr("href");
		var postid = hr.substr(hr.indexOf('#'));
		$("#quote-preview").html($(postid).html());
		var off = $( el ).offset();
		off.left = off.left + $(el).width();
		off.top = off.top - $("#quote-preview").height()/2
		$("#quote-preview").css("display", "block");
				$("#quote-preview").find("a").each( function () { if ($(this).attr("href") !== null) { $(this).attr("href", absolutizeURI(href, $(this).attr("href"))); } } );
				$("#quote-preview").find("img").each( function () { $(this).attr("src", absolutizeURI(href, $(this).attr("src")));  } );
		$("#quote-preview").offset(off);
	} else {
		$.ajax({
			type: 'get',
			url: href,
			success: function(data, textStatus, xhr){
				var html = xhr.responseText;
				var nodes = $.parseHTML( html );
				var hr = $(el).attr("href");
				var postid = hr.substr(hr.indexOf('#'));
				$("#quote-preview").html($(postid, nodes).html());
				var off = $( el ).offset();
				off.left = off.left + $(el).width();
				off.top = off.top - $("#quote-preview").height()/2
				$("#quote-preview").css("display", "block");
				$("#quote-preview").find("a").each( function () { if ($(this).attr("href") !== null) { $(this).attr("href", absolutizeURI(href, $(this).attr("href"))); } } );
				$("#quote-preview").find("img").each( function () { $(this).attr("src", absolutizeURI(href, $(this).attr("src")));  } );
				$("#quote-preview").offset(off);
			}
		});
	}
}

function hidePostPreview( el )
{
	
	$("#quote-preview").css("display", "none");
	$("#quote-preview").offset({top: "0px", left: "0px"});
	$("#quote-preview").html("");
	
}

function hideThreads()
{
	for (var key in localStorage)
	{
		if (key.substring(0, 2) == "h_")
		{
			hideThread(key.substring(2), 1);
		}
	}
}

function hideThread(id, type)
{
	// 0 = click, 1 = cookie
	if (type == 1)
	{
		$("#pc"+id+" .file").css("display", "none");
		$("#m"+id).css("display", "none");
		$("#t"+id).find(".replyContainer").css("display", "none");
		$("#t"+id).find("span.summary").slideUp(1);
		$("#et"+id).slideUp(1);
	}
	else
	{
		$("#m"+id).slideToggle(300, function()
		{
			$("#pc"+id+" .file").slideUp(1200);
			$("#et"+id).slideUp(1200);
			$("#t"+id).find(".replyContainer").slideUp(1200);
			$("#t"+id).find("span.summary").slideUp(1200);
		});
	}

	$("#ht"+id).html("[+]");
}

function showThread(id)
{
	
	
	if (($("#t"+id).find(".replyContainer").length) != 0)
	{
		$("#pc"+id+" .file").slideDown(1200);
		$("#t"+id).find(".replyContainer").slideDown(1200, function()
		{
			$("#m"+id).slideDown(300);
			$("#t"+id).find("span.summary").slideDown(600, function(){$("#et"+id).slideDown(600);});
		});
	}
	else 
	{
		$("#pc"+id+" .file").slideDown(1200, function(){$("#m"+id).slideDown(300);});
		$("#t"+id).find("span.summary").slideDown(600);
	}

	
	$("#ht"+id).html("[-]");
}

function thread_toggle(id)
{
	if (typeof localStorage.getItem("h_"+id) === "undefined")
	{
		localStorage.setItem("h_"+id, "1");
		hideThread(id);
	} else {
		if (localStorage.getItem("h_"+id) == 1)
		{
			
			localStorage.removeItem("h_"+id);
			showThread(id);
		} else {
			localStorage.setItem("h_"+id, "1");
			hideThread(id);
		}
	}
}

function addImgExpand(parent)
{
	$(parent).find(".fileThumb").click(function (e) {
		imgExpand($(this).parent());
		e.preventDefault();
	});
}

function imgExpand(element)
{
	$(element).children(".fileThumb").css("opacity", "0.7");
	var id = $(element).attr("id");
	$(element).append("<img src='"+$($(element).children(".fileThumb")[0]).attr("href")+"' style='display: none;' id='x"+id+"' />");
	$("#x"+id).bind("load", function () { 
		var iw = $('body').innerWidth();
		$(element).children(".fileThumb").css("opacity", "").css("display", "none");
		$(this).css("display", "");
		var newWidth = Math.min($(this).width(), (iw-100));
		$(this).css("width", newWidth+"px");
		$(this).css("max-width", newWidth+"px");
		$(this).css("height", "auto");
		$(this).css("max-height", "auto");
		addZoom(this);
	});
	$("#x"+id).bind("error", function () { 
		$(element).children(".fileThumb").css("opacity", "");
		$(this).remove();
	});
}

function imgThumbnail(element)
{
	$(element).siblings(".fileThumb").css("display", "");
	$(element).remove();
}

var targetImageWidth = 0;
var targetDiagonal = 0;
var targetDragging = false;
function addZoom(img) {
	$(img).mousedown(function(e) {
		if (e.button == 0) {
			targetImageWidth = $(this).width();
			var rc = e.target.getBoundingClientRect();
			var p = Math.pow;
			var dragSize = p(p(e.clientX-rc.left, 2)+p(e.clientY-rc.top, 2), .5);
			targetDiagonal = Math.round(dragSize);
			targetDragging = false;
			e.preventDefault();
		}
	});
	$(img).mousemove(function(e) {
		if (targetDiagonal){
			var rc = e.target.getBoundingClientRect();
			var p = Math.pow;
			var dragSize = p(p(e.clientX-rc.left, 2)+p(e.clientY-rc.top, 2), .5);
			var newDiagonal = Math.round(dragSize);
			var oldDiagonal = targetDiagonal;
			var imageWidth = targetImageWidth;
			var newWidth = Math.max(250, newDiagonal/oldDiagonal*imageWidth)+'px';
			$(this).css("width", newWidth);
			$(this).css("maxWidth", newWidth);

			$(this).css("maxHeight", "");
			$(this).css("height", "auto");

			targetDragging = true;
		}
	});
	$(img).mouseout(function(e) {
		targetDiagonal = 0;
	});
	$(img).mouseup(function(e) {
		if (targetDiagonal) {
			var rc = e.target.getBoundingClientRect();
			var p = Math.pow;
			var dragSize = p(p(e.clientX-rc.left, 2)+p(e.clientY-rc.top, 2), .5);
			var newDiagonal = Math.round(dragSize);
			var oldDiagonal = targetDiagonal;
			var imageWidth = targetImageWidth;
			var newWidth = Math.max(250, newDiagonal/oldDiagonal*imageWidth)+'px';
			//$(this).width(newWidth);
			$(this).css("width", newWidth);
			$(this).css("maxWidth", newWidth);

		}
	});
	$(img).click(function(e) {
		targetDiagonal = 0;
		if (targetDragging) {
			targetDragging = false;
			e.preventDefault();
			return false;
		}
	});
	
	$(img).dblclick(function (e) {
		imgThumbnail(this);
	});
}

/* Dragging function */
(function($) {
	$.fn.drags = function(opt) {

		opt = $.extend({handle:"",cursor:"move"}, opt);

		if(opt.handle === "") {
			var $el = this;
		} else {
			var $el = this.find(opt.handle);
		}

		return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
			if(opt.handle === "") {
				var $drag = $(this).addClass('draggable');
			} else {
				var $drag = $(this).addClass('active-handle').parent().addClass('draggable');
			}
			var z_idx = $drag.css('z-index'),
				drg_h = $drag.outerHeight(),
				drg_w = $drag.outerWidth(),
				pos_y = $drag.offset().top + drg_h - e.pageY,
				pos_x = $drag.offset().left + drg_w - e.pageX;
			$drag.css('z-index', 1000).parents().on("mousemove", function(e) {
				$('.draggable').offset({
					top:e.pageY + pos_y - drg_h,
					left:e.pageX + pos_x - drg_w
				}).on("mouseup", function() {
					$(this).removeClass('draggable').css('z-index', z_idx);
				});
			});
			e.preventDefault(); // disable selection
		}).on("mouseup", function() {
			if(opt.handle === "") {
				$(this).removeClass('draggable');
			} else {
				$(this).removeClass('active-handle').parent().removeClass('draggable');
			}
		});

	}
})(jQuery);

function handleWatched(parent)
{

	function addButton()
	{
		$(parent).find(".op .postInfo").each(function () {
			var id = $(this).attr("id").substr(2);
			$('#pi'+id).append('<div style="display: inline;" class="watcher" id="wt ' + id + '"> <a href="javascript:;">[W]</a></div>');
		});
	}

	function addFrame()
	{
		$("body").append('<div class="movable" id="watcher_box" \
			style="border: solid 1px; position: absolute; top: 100px; left: 100px; width: 250px; height: 150px; \
			background: rgba(241, 225, 215, 0.5);"> \
			<span style="font-size:20px; display: block; text-align: center; background: #ffccaa;">Watched Threads</span> \
			<ul id="watched_list"></ul>');
	}

	function loadWatched()
	{
		for (var key in localStorage)
		{
			if (key.substring(0, 2) == "wt")
			{
				addToWatched(key.substring(2));
			}
		}
	}

	addFrame();
	addButton();
	loadWatched();
	
	$('#watcher_box').drags();

	$(parent).find(".watcher").click(function () {
		var id = $(this).attr("id").substr(3);
		if ($('#wl'+id).length == 0)
			addToWatched(id);
		else
			removeFromWatched(id);

	});
}

function addToWatched(id)
{

	localStorage.setItem("wt"+id, "1");

	$('#watched_list').append('<li id="wl'+id+'" style="display:none;">Thread: '+id+'</li>');
	$('#wl'+id).fadeIn();
}

function removeFromWatched(id)
{
	localStorage.removeItem("wt"+id);
	$('#wl'+id).fadeOut(function(){$('#wl'+id).remove();});
}

/* 
 * ==============================
 * | URI manipulation functions |
 * ==============================
 */
function parseURI(url) {
  var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
  // authority = '//' + user + ':' + pass '@' + hostname + ':' port
  return (m ? {
	href     : m[0] || '',
	protocol : m[1] || '',
	authority: m[2] || '',
	host     : m[3] || '',
	hostname : m[4] || '',
	port     : m[5] || '',
	pathname : m[6] || '',
	search   : m[7] || '',
	hash     : m[8] || ''
  } : null);
}
 
function absolutizeURI(base, href) {// RFC 3986
 
  function removeDotSegments(input) {
	var output = [];
	input.replace(/^(\.\.?(\/|$))+/, '')
		 .replace(/\/(\.(\/|$))+/g, '/')
		 .replace(/\/\.\.$/, '/../')
		 .replace(/\/?[^\/]*/g, function (p) {
	  if (p === '/..') {
		output.pop();
	  } else {
		output.push(p);
	  }
	});
	return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
  }
 
  href = parseURI(href || '');
  base = parseURI(base || '');
 
  return !href || !base ? null : (href.protocol || base.protocol) +
		 (href.protocol || href.authority ? href.authority : base.authority) +
		 removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) +
		 (href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) +
		 href.hash;
}