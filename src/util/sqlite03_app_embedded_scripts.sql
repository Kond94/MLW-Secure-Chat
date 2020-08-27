-- SQLite in-line (embedded in code: N procedures) queries
-- list of conversations
SELECT t.chat_id
	, t.chat_title
	, t.chat_body
	, t.display_name
	, t.display_time
	, t.message_all
	, t.message_unread
FROM chat_topic t
ORDER BY t.chat_time DESC;

-- discussion thread for selected conversation 
SELECT d.chat_id	, d.chat_title
	, d.chat_body
	, d.display_name
	, d.display_time
	, d.has_attachment
	, d.chat_read
FROM chat_topic_discussion d 
WHERE d.chat_id = '260308a2-e4a2-11ea-a1f9-00155d1e5bb1' 			-- ID of selcted thread
	OR d.thread_root = '260308a2-e4a2-11ea-a1f9-00155d1e5bb1' 	-- ID of selected thread
ORDER BY d.chat_time ;

-- list of groups/people to which a conversation can be sent to 
SELECT e.entity_id
	, e.entity_name
	, e.entity_type
FROM chat_entity e
WHERE entity_id != 'tuda6'	-- ID of currently logged on user
ORDER BY e.entity_type
	, e.entity_name;


-- mark thread as having been read
-- call only if the top level view had indicated that there are unread messages
-- probably best to call when leaving (in any way) the detailed / discussion thread view
UPDATE chat
SET chat_read = 'Y'
WHERE chat_id = '226fe6c3-e5bf-11ea-95d9-00155dae7780'				-- ID of selected thread
	OR thread_root = '226fe6c3-e5bf-11ea-95d9-00155dae7780';		-- ID of selected thread
	
	