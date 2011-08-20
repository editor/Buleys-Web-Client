function save_queues(){add_or_update_queue("new_items",Buleys.queues.new_items);add_or_update_queue("pending_crawls",Buleys.queues.pending_crawls)}function get_queues(){try{new_queue_transaction();Buleys.index=Buleys.objectStore.index("queue_name");var a=Buleys.index.openCursor();a.onsuccess=function(){var b=a.result;b&&b.length>=0&&jQuery.each(b,function(){})};request.onerror=function(){}}catch(c){}}
function remove_queue(a){new_queue_transaction();a=Buleys.objectStore["delete"](a);a.onsuccess=function(){delete Buleys.objectId};a.onerror=function(){}}function load_all_queues_into_dom(){new_queue_transaction();var a=Buleys.objectStore.openCursor();a.onsuccess=function(){typeof a.result!=="undefined"&&a.result.length>=0&&jQuery.each(a.result,function(c,b){Buleys.queues[b.queue_name]=b.queue_value})};a.onerror=function(){}}
function add_or_update_queue(a,c){new_queue_transaction();if(typeof c=="undefined")c="";var b=Buleys.objectStore.get(a);b.onsuccess=function(){typeof b.result=="undefined"?add_queue_to_queues_database(a,c):update_queue_in_queues_database(a,c)};b.onerror=function(){}}function add_queue_to_queues_database(a,c){new_queue_transaction();var b={queue_name:a,queue_value:c,modified:(new Date).getTime()},d=Buleys.objectStore.add(b);d.onsuccess=function(){Buleys.objectId=d.result};d.onerror=function(){}}
function update_queue_in_queues_database(a,c){new_queue_transaction();var b={queue_name:a,queue_value:c,modified:(new Date).getTime()},d=Buleys.objectStore.put(b);d.onsuccess=function(){Buleys.objectId=d.result};d.onerror=function(){}}
function new_queue_transaction(){try{var a=Buleys.db.transaction(["queue"],IDBTransaction.READ_WRITE,1E3);a.oncomplete=function(){delete Buleys.objectStore};a.onabort=function(){};Buleys.objectStore=a.objectStore("queue")}catch(c){a=Buleys.db.setVersion(parseInt(Buleys.db.version)+1);a.onsuccess=function(){Buleys.objectStore=Buleys.db.createObjectStore("queue",{keyPath:"queue_name"},true);Buleys.objectStore.createIndex("queue_value","queue_value",{unique:false})};a.onerror=function(){}}};
