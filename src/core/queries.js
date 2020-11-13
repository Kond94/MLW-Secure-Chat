import Database from './database';

export const getChatTopics = async () => {
  try {
    const results = await Database.executeSql('SELECT * FROM chat_topic', []);
    return await results.rows.raw();
  } catch (e) {}
};

export const getChatDiscussion = async (chat_id) => {
  try {
    const results = await Database.executeSql(
      'SELECT * FROM chat_topic_discussion d WHERE d.chat_id = ? OR d.thread_parent = ?',
      [chat_id, chat_id],
    );
    const results2 = await Database.executeSql(
      "UPDATE chat SET chat_read = 'Y' WHERE thread_parent = ?",
      [chat_id],
    );

    const results3 = await Database.executeSql(
      "UPDATE chat SET chat_read = 'Y' WHERE chat_id = ?",
      [chat_id],
    );
    return await results.rows.raw();
  } catch (e) {
    console.log(e);
  }
};

export const getParticipants = async (chat_id) => {
  try {
    const results = await Database.executeSql(
      'SELECT DISTINCT uname FROM chat WHERE thread_root = ?',
      [chat_id],
    );
    return await results.rows.raw();
  } catch (e) {
    console.log(e);
  }
};

export const getChatEntities = async () => {
  try {
    const results = await Database.executeSql('SELECT * FROM chat_entity', []);
    return await results.rows.raw();
  } catch (e) {}
};

export const getChatEntity = async (entity_id) => {
  try {
    const results = await Database.executeSql(
      'SELECT * FROM chat_entity WHERE entiity_id = ?',
      [entity_id],
    );
    return await results.rows.raw();
  } catch (e) {}
};

export const addChat = async (chat) => {
  try {
    const results = await Database.executeSql(
      'INSERT INTO chat (chat_id, uname, display_name, chat_title, chat_body, chat_time, thread_parent, thread_root, chat_read, base64_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        chat.chat_id,
        chat.uname,
        chat.display_name,
        chat.chat_title,
        chat.chat_body,
        chat.chat_time,
        chat.thread_parent,
        chat.thread_root,
        chat.chat_read,
        chat.base64_image,
      ],
    );
  } catch (e) {
    console.log(e);
  }
};

export const addUser = async (entity) => {
  try {
    const results = await Database.executeSql(
      'INSERT INTO chat_entity (entity_id, suspended) VALUES (?, ?)',
      [entity.entity_id, entity.suspended],
    );
  } catch (e) {
    console.log(e);
  }
};
