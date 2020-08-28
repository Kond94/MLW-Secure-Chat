-- VIEWS for SQLite database
DROP VIEW IF EXISTS chat_count;
CREATE VIEW chat_count

AS

SELECT sq.thread_root
	, COUNT(*) AS message_all
	, SUM(CASE WHEN chat_read = 'N' THEN 1 ELSE 0 END) message_unread
FROM (	
			SELECT  CASE 
								WHEN c.thread_root IS NULL THEN c.chat_id 
								ELSE c.thread_root 
							END AS thread_root
				, c.chat_read
			FROM chat c
		) sq
GROUP BY sq.thread_root;

DROP VIEW IF EXISTS chat_topic;
CREATE VIEW chat_topic

AS

SELECT c.chat_id
	, c.chat_title
	, c.chat_body
	, c.display_name
	, CASE
			WHEN CURRENT_DATE = SUBSTR(c.chat_time,1,10) THEN SUBSTR(c.chat_time, 12,5) 																												-- same day: show time only
			WHEN STRFTIME('%W', 'now') = STRFTIME('%W', c.chat_time) THEN SUBSTR('SunMonTueWedThuFriSat',STRFTIME('%w',c.chat_time) * 3 + 1, 3) || ' ' || SUBSTR(c.chat_time, 12,5) 	-- same week: show ddd HH:m
			WHEN STRFTIME('%Y', 'now') = STRFTIME('%Y', c.chat_time) THEN STRFTIME('%d', c.chat_time) || ' ' || SUBSTR('JanFebMarAprMayJunJulAugSepOctNovDec',STRFTIME('%m',c.chat_time) * 3 + 1, 3) || ' ' || SUBSTR(c.chat_time, 12,5) 	-- same year: show dd-mmm HH:m
			ELSE STRFTIME('%d', c.chat_time) || ' ' || SUBSTR('JanFebMarAprMayJunJulAugSepOctNovDec',STRFTIME('%m',c.chat_time) * 3 + 1, 3) || ' ' || STRFTIME('%Y %H:%M', c.chat_time)
		END AS display_time
	, cc.message_all
	, cc.message_unread
	, c.chat_time
FROM chat c
INNER JOIN chat_count cc ON cc.thread_root = c.chat_id
ORDER BY c.chat_time DESC;

DROP VIEW IF EXISTS chat_topic_discussion;
CREATE VIEW chat_topic_discussion

AS

SELECT c.chat_id
	, c.chat_title
	, c.chat_body
	, c.display_name
	, c.has_attachment
	, CASE
			WHEN CURRENT_DATE = SUBSTR(c.chat_time,1,10) THEN SUBSTR(c.chat_time, 12,5) 																												-- same day: show time only
			WHEN STRFTIME('%W', 'now') = STRFTIME('%W', c.chat_time) THEN SUBSTR('SunMonTueWedThuFriSat',STRFTIME('%w',c.chat_time) * 3 + 1, 3) || ' ' || SUBSTR(c.chat_time, 12,5) 	-- same week: show ddd HH:m
			WHEN STRFTIME('%Y', 'now') = STRFTIME('%Y', c.chat_time) THEN STRFTIME('%d', c.chat_time) || ' ' || SUBSTR('JanFebMarAprMayJunJulAugSepOctNovDec',STRFTIME('%m',c.chat_time) * 3 + 1, 3) || ' ' || SUBSTR(c.chat_time, 12,5) 	-- same year: show dd-mmm HH:m
			ELSE STRFTIME('%d', c.chat_time) || ' ' || SUBSTR('JanFebMarAprMayJunJulAugSepOctNovDec',STRFTIME('%m',c.chat_time) * 3 + 1, 3) || ' ' || STRFTIME('%Y %H:%M', c.chat_time)
		END AS display_time
	, thread_root
	, thread_parent
	, c.chat_time
	, chat_read
FROM chat c
ORDER BY c.chat_time;

