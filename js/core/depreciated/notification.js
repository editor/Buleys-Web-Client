function createNotificationInstance(a){jQuery(document).trigger("createNotificationInstance");if(a.notificationType=="simple")return window.webkitNotifications.createNotification("fire.png","Notification Title","Notification content...");else if(a.notificationType=="html")return window.webkitNotifications.createHTMLNotification("http://someurl.com")}
function send_notification_to_desktop(){jQuery(document).trigger("send_notification_to_desktop");if(window.webkitNotifications.checkPermission()==0){notification_test=createNotificationInstance({notificationType:"html"});notification_test.ondisplay=function(){};notification_test.onclose=function(){};notification_test.show()}else window.webkitNotifications.requestPermission()}
function notify_user_of_new_items(a,b,c){jQuery(document).trigger("notify_user_of_new_items");if(Buleys.view.type===b&&c===Buleys.view.slug||Buleys.view.type=="home"||typeof Buleys.view.type==="undefined")flash_console("<p>"+a+" new items added to "+b+" "+c+" </p>")}
function do_pending_crawl(){jQuery(document).trigger("do_pending_crawl");var a=Buleys.queues.pending_crawls.splice(0,1),b=a[0].split("_",1),c=b[0],d=a[0].replace(b[0]+"_","");$.ajax({url:"http://static.buleys.com/js/collections/"+c+"/"+d+".js",dataType:"jsonp",jsonpCallback:"load_collection",error:function(){$("#index").html("<li class='item'>No results.</li>")},success:function(e){add_items(e.items,c,d)}})}
function check_for_waiting_items(){jQuery(document).trigger("check_for_waiting_items");notify_user_of_new_items(Buleys.queues.new_items,type_to_get,company_to_get)};
