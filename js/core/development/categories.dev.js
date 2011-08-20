	function new_categories_transaction() {
	
	    try {
	        var transaction = Buleys.db.transaction(["categories"], IDBTransaction.READ_WRITE /*Read-Write*/ , 1000 /*Time out in ms*/ );
	        transaction.oncomplete = function (e) {
	
	            delete Buleys.objectStore;
	        };
	        transaction.onabort = function (e) {
	
	        };
	        Buleys.objectStore = transaction.objectStore("categories");
	
	    } catch (e) {
	        console.log("new_categories_transaction(): Could not open objectStore. You may have to create it first");
	
	        var ver_to_set = 0;
	        if (!(Buleys.db.version > 0)) {
	            ver_to_set = ver_to_set + 1;
	        } else {
	            ver_to_set = 1;
	        }
	
	        console.log(Buleys.db);
	        var request = Buleys.db.setVersion(ver_to_set);
	        request.onsuccess = function (e) {
	
	
	            Buleys.objectStore = Buleys.db.createObjectStore("categories", {
	                "keyPath": "id"
	            }, true);
	
	            Buleys.objectStore.createIndex("link", "link", {
	                unique: false
	            });
	            Buleys.objectStore.createIndex("slug", "slug", {
	                unique: false
	            });
	            Buleys.objectStore.createIndex("type", "type", {
	                unique: false
	            });
	            Buleys.objectStore.createIndex("modified", "modified", {
	                unique: false
	            });
	
	
	
	        };
	        request.onerror = function (e) {
	
	        };
	
	    };
	}
	
	//

	//

	function add_category_controls(event_context) {
	    jQuery("#overlay .vote_up_category").remove();
	    jQuery("#overlay .vote_down_category").remove();
	    jQuery("#overlay .delete_category").remove();
	    jQuery("#overlay .selected_category").removeClass('.selected_category');
	    var html_snippit;
	    var current = jQuery(event_context).html();
	    var the_link = jQuery(event_context).attr('link');
	    var the_type = jQuery(event_context).attr('type');
	    var the_slug = jQuery(event_context).attr('slug');

	//begin vote
					    new_votes_transaction();
					    var vote_key = the_link.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();
					    var item_request = Buleys.objectStore.get(vote_key);
					    item_request.onsuccess = function (event) {
					
					        if (typeof item_request.result == 'undefined' || item_request.result == "") {

	    html_snippit = "<span class='vote_up_category empty_thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
	    html_snippit = html_snippit + "" + current;
	    html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
	    html_snippit = html_snippit + "<div class='vote_down_category empty_thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
					
					        } else {
					            if (typeof item_request.result != 'undefined') {
					                if (item_request.result.vote_value == -1) {
	    html_snippit = "<span class='vote_up_category empty_thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
	    html_snippit = html_snippit + "" + current;
	    html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
	    html_snippit = html_snippit + "<div class='remove_category_down_vote thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
					                } else if (item_request.result.vote_value == 1) {
	    html_snippit = "<span class='remove_category_up_vote thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
	    html_snippit = html_snippit + "" + current;
	    html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
	    html_snippit = html_snippit + "<div class='vote_down_category empty_thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
					                } else {
									    html_snippit = "<span class='vote_up_category empty_thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
									    html_snippit = html_snippit + "" + current;
									    html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
									    html_snippit = html_snippit + "<div class='vote_down_category empty_thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
					            	}
					            } else {
	    html_snippit = "<span class='vote_up_category empty_thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
	    html_snippit = html_snippit + "" + current;
	    html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
	    html_snippit = html_snippit + "<div class='vote_down_category empty_thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
					            }
					        }
						    jQuery(event_context).html(html_snippit);
					    };
					    item_request.onerror = function (e) {
					    };
					//end vote
	}
		
	function remove_category_for_item(item_url, item_slug, item_type) {
	    new_categories_transaction();
	    var request = Buleys.objectStore["delete"](item_url + item_type + item_slug);
	    request.onsuccess = function (event) {
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	    };
	}
	
		
	function add_category_controls_without_vote_status(event_context) {
	    jQuery("#overlay .vote_up_category").remove();
	    jQuery("#overlay .vote_down_category").remove();
	    jQuery("#overlay .delete_category").remove();
	    jQuery("#overlay .selected_category").removeClass('.selected_category');
	    var html_snippit;
	    var current = jQuery(event_context).html();
	    var the_link = jQuery(event_context).attr('link');
	    var the_type = jQuery(event_context).attr('type');
	    var the_slug = jQuery(event_context).attr('slug');
	    html_snippit = "<span class='vote_up_category thumb_up_icon float_left category_hover_icon ' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></span>";
	    html_snippit = html_snippit + "" + current;
	    html_snippit = html_snippit + "<div class='delete_category float_right cross_icon category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
	    html_snippit = html_snippit + "<div class='vote_down_category thumb_icon float_right category_hover_icon' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'></div>";
	    html_snippit = "<div class='vote_block'>" + html_snippit + "</div>";
	    jQuery(event_context).html(html_snippit);
	}
		
	function remove_category_for_item(item_url, item_slug, item_type) {
	    new_categories_transaction();
	    var request = Buleys.objectStore["delete"](item_url + item_type + item_slug);
	    request.onsuccess = function (event) {
	        delete Buleys.objectId;
	    };
	    request.onerror = function () {
	    };
	}

	function remove_item_from_categories_database(item_url, item_slug, item_type) {
	    new_categories_transaction();
	    Buleys.index = Buleys.objectStore.index("link");
	    var request_for_item = Buleys.index.get(item_url);
	    request_for_item.onsuccess = function (event) {
	        if (typeof request_for_item.result !== 'undefined') {
	            if (typeof request_for_item.result !== 'undefined') {
	                var slug_string = "";
	                slug_string = request_for_item.result.link.replace(/[^a-zA-Z0-9-_]+/g, "") + request_for_item.result.slug.toLowerCase() + request_for_item.result.type.toLowerCase();
	                new_categories_transaction();
	                var request_2 = Buleys.objectStore["delete"](slug_string);
	                request_2.onsuccess = function (event) {
	                    delete Buleys.objectId;
	                };
	                request_2.onerror = function () {
	                };
	            } else {
	                $.each(request_for_item.result, function (i, item) {
	                    var slug_string = "";
	                    slug_string = item.link.replace(/[^a-zA-Z0-9-_]+/g, "") + item.slug.toLowerCase() + item.type.toLowerCase();
	                    new_categories_transaction();
	                    var request_2 = Buleys.objectStore["delete"](slug_string);
	                    request_2.onsuccess = function (event) {
	                        delete Buleys.objectId;
	                    };
	                    request_2.onerror = function () {
	                    };
	                });
	            }
	        }
	    };
	    request_for_item.onerror = function () {
	    };
	}
	
	function add_categories_to_categories_database(item_url, categories) {
	    jQuery.each(categories, function (c, the_category) {
	        if (typeof the_category.key !== 'undefined') {
	            new_categories_transaction();
	            var data = {
	                "id": item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_category.key.toLowerCase() + the_category.type.toLowerCase(),
	                "link": item_url,
	                "slug": the_category.key,
	                "type": the_category.type,
	                "value": the_category.value,
	                "modified": new Date().getTime()
	            };
	            var add_data_request = Buleys.objectStore.add(data);
	            add_data_request.onsuccess = function (event) {
	                if (typeof the_category.key !== 'undefined') {
	                    var topic_key = the_category.type.toLowerCase() + "_" + the_category.key.toLowerCase();
	                    if (typeof Buleys.queues.new_items[topic_key] == "undefined") {
	                        Buleys.queues.new_items[topic_key] = 0;
	                    }
	                    Buleys.queues.new_items[topic_key] = Buleys.queues.new_items[topic_key] + 1;
	                }
	            };
	            add_data_request.onerror = function (e) {
	            };
	        }
	    });
	}

	function get_item_categories_for_overlay(item_url) {
	
	    new_categories_transaction();
	
	    var item_request = Buleys.objectStore.get(item_url);
	
	    try {
	
	        new_categories_transaction();
	        Buleys.index = Buleys.objectStore.index("link");
	
	        var cursorRequest = Buleys.index.openCursor(item_url);
	        cursorRequest.onsuccess = function (event) {
	            var objectCursor = cursorRequest.result;
	            if (!objectCursor) {
	                return;
	            }
	
	            if (objectCursor.length >= 0) {
	                jQuery.each(objectCursor, function (k, item) {
	                    if (jQuery("#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).length < 1) {
	                        var html_snippit = "<ul class='category_list' id='categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + "'></ul>";
	                        jQuery("#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).append(html_snippit);
	                    }
	                    var cat_snippit = "<li id='list_item_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + item.type.toLowerCase() + item.slug.toLowerCase() + "' class='category_list_item' link='" + item_url + "' type='" + item.type.toLowerCase() + "' slug='" + item.slug.toLowerCase() + "'><a id='" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "") + item.type.toLowerCase() + item.slug.toLowerCase() + "'  class='category' link='" + item_url + "' type='" + item.type.toLowerCase() + "' slug='" + item.slug.toLowerCase() + "' href='/" + item.type.toLowerCase() + "/" + item.slug + "'>" + item.value + "</a></li>";
	                    jQuery("#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g, "")).append(cat_snippit);
	
	                    get_vote_info(item_url, item.type.toLowerCase(), item.slug.toLowerCase());
		
	                });
	
	            }

	        };
	        request.onerror = function (event) {
	
	        };
	
	    } catch (e) {
	
	
	    }

	}

    $('.delete_category').live('click', function (event) {
        event.preventDefault();
        var the_url = $(this).attr('link');
        var the_type = $(this).attr('type');
        var the_slug = $(this).attr('slug');
        $(this).parent().parent().remove();
        remove_category_for_item(the_url.replace(/[^a-zA-Z0-9-_]+/g, ""), the_type, the_slug);

        if (!$(this).hasClass('voted')) {
            post_feedback('delete_category', the_url, the_type, the_slug);
        }
    });
    
    $('.vote_up_category').live('click', function (event) {
        event.preventDefault();
        var the_url = $(this).attr('link');
        var the_type = $(this).attr('type');
        var the_slug = $(this).attr('slug');
        var vote_key = "";
        vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();
		jQuery(this).removeClass('empty_thumb_up_icon').addClass('thumb_up_icon');
		jQuery(this).parent().children('.thumb_icon').removeClass('.thumb_icon').addClass('empty_thumb_icon');
        add_or_update_vote(vote_key, 1);
        if (!$(this).hasClass('voted')) {
            post_feedback('category_upvote', the_url, the_type, the_slug);
        }
        $(this).addClass('voted');
        $(this).removeClass('vote_up_category');
        $(this).addClass('remove_category_up_vote');
    });
    $('.vote_down_category').live('click', function (event) {
        event.preventDefault();
        var the_url = $(this).attr('link');
        var the_type = $(this).attr('type');
        var the_slug = $(this).attr('slug');
        var vote_key = "";
		jQuery(this).removeClass('empty_thumb_icon').addClass('thumb_icon');
		jQuery(this).parent().children('.thumb_up_icon').removeClass('.thumb_up_icon').addClass('empty_thumb_up_icon');
        vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();
        add_or_update_vote(vote_key, -1);
        if (!$(this).hasClass('voted')) {
            post_feedback('category_downvote', the_url, the_type, the_slug);
        }
        $(this).addClass('voted');
        $(this).removeClass('vote_down_category');
        $(this).addClass('remove_category_down_vote');
    });

    $('.remove_category_up_vote').live('click', function (event) {
        event.preventDefault();
        var the_url = $(this).attr('link');
        var the_type = $(this).attr('type');
        var the_slug = $(this).attr('slug');
        var vote_key = "";
        vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();
		jQuery(this).removeClass('thumb_up_icon').addClass('empty_thumb_up_icon');
        remove_vote(vote_key);
        if ($(this).hasClass('voted')) {
            post_feedback('remove_category_upvote', the_url, the_type, the_slug);
        }
        $(this).removeClass('voted');
        $(this).removeClass('remove_category_up_vote');
        $(this).addClass('vote_up_category');

    });
    $('.remove_category_down_vote').live('click', function (event) {
        event.preventDefault();
        var the_url = $(this).attr('link');
        var the_type = $(this).attr('type');
        var the_slug = $(this).attr('slug');
        var vote_key = "";
		jQuery(this).removeClass('thumb_icon').addClass('empty_thumb_icon');
        vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g, "") + the_type.toLowerCase() + the_slug.toLowerCase();
        remove_vote(vote_key);
        if ($(this).hasClass('voted')) {
            post_feedback('remove_category_downvote', the_url, the_type, the_slug);
        }
        $(this).removeClass('voted');
        $(this).removeClass('remove_category_down_vote');
        $(this).addClass('vote_down_category');

    });


    $('#overlay .category').live('mouseenter', function (event) {
        event.preventDefault();
        add_category_controls(jQuery(this));
    });

    $('#overlay .category').live('mouseleave', function (event) {
        event.preventDefault();
        jQuery("#overlay .vote_up_category").remove();
        jQuery("#overlay .vote_down_category").remove();
        jQuery("#overlay .remove_category_up_vote").remove();
        jQuery("#overlay .remove_category_down_vote").remove();
        jQuery("#overlay .delete_category").remove();
    });

