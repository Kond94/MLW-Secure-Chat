export const script = `

CREATE TABLE chat_entity(entity_id VARCHAR(36) NOT NULL PRIMARY KEY
													, entity_name VARCHAR(50) NOT NULL
													, suspended CHAR(1) NOT NULL
													, pword VARCHAR(150) NULL
													, ounit_id CHAR(36) NOT NULL
													, entity_type CHAR(1) NOT NULL
													, REVIEWER CHAR(1) NOT NULL
													, TRAINEE CHAR(1) NOT NULL
													);

INSERT INTO chat_entity(entity_id, entity_name, suspended, pword, ounit_id, entity_type, REVIEWER, TRAINEE) 
VALUES ('f73fa5f8-e3be-11ea-a1f9-00155d1e5bb1', 'TUDA Reviewer', 'N', NULL, 'f73fa5f8-e3be-11ea-a1f9-00155d1e5bb1', 'G', 'N', 'N')
, ('f73fa21d-e3be-11ea-a1f9-00155d1e5bb1', 'TUDA Trainee', 'N', NULL, 'f73fa21d-e3be-11ea-a1f9-00155d1e5bb1', 'G', 'N', 'N')
, ('monyiaichi', 'Monie Masesa', 'N', 'letmein', 'b6b93289-e566-11ea-844e-00155dae7ac8', 'P', 'Y', 'N')
, ('tuda_r1', 'Tuda Reviewer1', 'N', 'letmein', 'b6b93289-e566-11ea-844e-00155dae7ac8', 'P', 'Y', 'N')
, ('tuda_r2', 'Tuda Reviewer2', 'N', 'letmein', 'b6b93289-e566-11ea-844e-00155dae7ac8', 'P', 'Y', 'N')
, ('tuda1', 'Tuda User1', 'N', 'letmein', 'b6b93289-e566-11ea-844e-00155dae7ac8', 'P', 'N', 'Y')
, ('tuda2', 'Tuda User2', 'N', 'letmein', 'b6b93289-e566-11ea-844e-00155dae7ac8', 'P', 'N', 'Y')
, ('tuda3', 'Tuda User3', 'N', 'letmein', 'b6b93289-e566-11ea-844e-00155dae7ac8', 'P', 'N', 'Y')
, ('tuda4', 'Tuda User4', 'N', 'letmein', 'b6b93289-e566-11ea-844e-00155dae7ac8', 'P', 'N', 'Y')
, ('tuda5', 'Tuda User5', 'N', 'letmein', 'b6b93289-e566-11ea-844e-00155dae7ac8', 'P', 'N', 'Y')
, ('tuda6', 'Tuda User6', 'N', 'letmein', 'b6b93289-e566-11ea-844e-00155dae7ac8', 'P', 'N', 'Y');
													
CREATE TABLE chat(chat_id CHAR(36) NOT NULL PRIMARY KEY
										, uname VARCHAR(15) NOT NULL
										, display_name VARCHAR(50) NOT NULL
										, chat_title VARCHAR(100) NULL
										, chat_body VARCHAR(1500) NOT NULL
										, has_attachment CHAR(1) NOT NULL
										, chat_time CHAR(19) NOT NULL
										, thread_parent CHAR(36) NULL
										, thread_root CHAR(36) NULL
										);
													
INSERT INTO chat(chat_id, uname, display_name, chat_title, chat_body, has_attachment, chat_time, thread_parent, thread_root) 
VALUES ('e104ffc9-e55d-11ea-844e-00155dae7ac8', 'tuda4', 'Monie Masesa', NULL, 'Kachasu', 'N', '2020-08-23 18:29:55', '005d0449-e55c-11ea-844e-00155dae7ac8', '005d0449-e55c-11ea-844e-00155dae7ac8')
	, ('8ca14a88-e4a3-11ea-a1f9-00155d1e5bb1', 'tuda_r1', 'Monie Masesa', 'T:MSG01-R1-2 tuda_r2--->', 'B:MSG01-R1-2 tuda6--->', 'N', '2020-08-22 20:16:07', '60634f18-e4a2-11ea-a1f9-00155d1e5bb1', '260308a2-e4a2-11ea-a1f9-00155d1e5bb1')
	, ('60634f18-e4a2-11ea-a1f9-00155d1e5bb1', 'tuda5', 'Monie Masesa', 'T:MSG01-R1 tuda5--->tuda6,tuda5,f73fa', 'B:MSG01-R1tuda3--->tuda6,tuda5,f73fa5f8-e3be-11ea-a', 'N', '2020-08-22 20:07:44', '260308a2-e4a2-11ea-a1f9-00155d1e5bb1', '260308a2-e4a2-11ea-a1f9-00155d1e5bb1')
	, ('485e480b-e4a3-11ea-a1f9-00155d1e5bb1', 'tuda_r2', 'Monie Masesa', 'T:MSG01-R1-2 tuda6--->', 'B:MSG01-R1-1 monyiaichi--->tuda6,tuda5,f73fa', 'N', '2020-08-22 20:14:13', '60634f18-e4a2-11ea-a1f9-00155d1e5bb1', '260308a2-e4a2-11ea-a1f9-00155d1e5bb1')
	, ('260308a2-e4a2-11ea-a1f9-00155d1e5bb1', 'tuda3', 'Monie Masesa', 'T:MSG01 monyiaichi--->f73fa5f8-e3be-11ea-a', 'B:MSG01-R2monyiaichi--->f73fa5f8-e3be-11ea-a', 'N', '2020-08-22 20:06:06', NULL, NULL)
	, ('036de6df-e4a3-11ea-a1f9-00155d1e5bb1', 'tuda6', 'Monie Masesa', 'T:MSG01-R1-1 monyiaichi--->tuda6,tuda5,f73fa', 'B:MSG01-R2tuda5--->tuda6,tuda5,f73fa', 'N', '2020-08-22 20:12:17', '60634f18-e4a2-11ea-a1f9-00155d1e5bb1', '260308a2-e4a2-11ea-a1f9-00155d1e5bb1')
	, ('005d0449-e55c-11ea-844e-00155dae7ac8', 'tuda6', 'Monie Masesa', 'These things are EASY', 'Some guyt says NOT REALY. What is he drinking!', 'N', '2020-08-23 18:16:29', NULL, NULL);													
`;
