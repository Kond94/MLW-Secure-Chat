import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

export default class Database {
  initDB() {
    let db;
    return new Promise((resolve) => {
      console.log('Plugin integrity check ...');
      SQLite.echoTest()
        .then(() => {
          console.log('Integrity check passed ...');
          console.log('Opening database ...');
          SQLite.openDatabase({name: 'dmis_chat.db', createFromLocation: 1})
            .then((DB) => {
              db = DB;
              console.log('Database OPEN');
              db.executeSql('SELECT 1 FROM chat LIMIT 1')
                .then(() => {
                  console.log('Database is ready ... executing query ...');
                })
                .catch((error) => {
                  console.log('Received error: ', error);
                  console.log('Database not yet ready ... populating data');
                });
              resolve(db);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log('echoTest failed - plugin not functional');
        });
    });
  }

  closeDatabase(db) {
    if (db) {
      console.log('Closing DB');
      db.close()
        .then((status) => {
          console.log('Database CLOSED');
        })
        .catch((error) => {
          this.errorCB(error);
        });
    } else {
      console.log('Database was not OPENED');
    }
  }

  getMessages(id) {
    return new Promise((resolve) => {
      const messages = [];
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT d.chat_id, d.chat_title, d.chat_body, d.display_name, d.display_time, d.has_attachment, d.chat_read FROM chat_topic_discussion d WHERE d.chat_id = ? OR d.thread_root = ? ORDER BY d.chat_time',
              [id, id],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);

                const {
                  chat_id,
                  chat_title,
                  chat_body,
                  display_name,
                  display_time,
                  has_attachment,
                  chat_read,
                } = row;
                messages.push({
                  chat_id,
                  chat_title,
                  chat_body,
                  display_name,
                  display_time,
                  has_attachment,
                  chat_read,
                });
              }
              messages.forEach((message) => {
                let comments = [];
                this.getComments(message.chat_id)
                  .then((data) => {
                    comments = data;
                    console.log('Coooooms: ', data);
                    comments = messages.map((m) => {
                      const sent = false;
                      return {...m, sent};
                    });
                    message = {...message, comments};
                    console.log(message);
                  })
                  .catch((err) => {
                    console.log(err);
                    this.setState = {
                      isLoading: false,
                    };
                  });
              });
              console.log(messages);
              resolve(messages);
            });
          })
            .then((result) => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getComments(id) {
    return new Promise((resolve) => {
      const comments = [];
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT d.chat_id, d.chat_title, d.chat_body, d.display_name, d.display_time, d.has_attachment, d.chat_read FROM chat_topic_discussion d WHERE d.thread_parent = ? ORDER BY d.chat_time',
              [id],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);

                const {
                  chat_id,
                  chat_title,
                  chat_body,
                  display_name,
                  display_time,
                  has_attachment,
                  chat_read,
                } = row;
                comments.push({
                  chat_id,
                  chat_title,
                  chat_body,
                  display_name,
                  display_time,
                  has_attachment,
                  chat_read,
                });
              }

              console.log(comments);
              resolve(comments);
            });
          })
            .then((result) => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getThreads() {
    return new Promise((resolve) => {
      const threads = [];
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              'SELECT t.chat_id, t.chat_title, t.chat_body, t.display_name, t.display_time, t.message_all, t.message_unread FROM chat_topic t ORDER BY t.chat_time DESC',
              [],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                const {
                  chat_id,
                  chat_title,
                  chat_body,
                  display_name,
                  display_time,
                  message_all,
                  message_unread,
                } = row;
                threads.push({
                  chat_id,
                  chat_title,
                  chat_body,
                  display_name,
                  display_time,
                  message_all,
                  message_unread,
                });
              }
              console.log(threads);
              resolve(threads);
            });
          })
            .then((result) => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  getUsers() {
    return new Promise((resolve) => {
      const users = [];
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql('SELECT * FROM chat_entity', []).then(
              ([tx, results]) => {
                console.log('Query completed');
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  const {
                    entity_id,
                    entity_name,
                    suspended,
                    pword,
                    ounit_id,
                    entity_type,
                    REVIEWER,
                    TRAINEE,
                  } = row;
                  users.push({
                    entity_id,
                    entity_name,
                    suspended,
                    pword,
                    ounit_id,
                    entity_type,
                    REVIEWER,
                    TRAINEE,
                  });
                }
                console.log(users);
                resolve(users);
              },
            );
          })
            .then((result) => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
  addProduct(prod) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql('INSERT INTO Product VALUES (?, ?, ?, ?, ?)', [
              prod.chat_id,
              prod.chat_title,
              prod.prodDesc,
              prod.prodImage,
              prod.prodPrice,
            ]).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then((result) => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  updateProduct(id, prod) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql(
              'UPDATE Product SET chat_title = ?, prodDesc = ?, prodImage = ?, prodPrice = ? WHERE chat_id = ?',
              [
                prod.chat_title,
                prod.prodDesc,
                prod.prodImage,
                prod.prodPrice,
                id,
              ],
            ).then(([tx, results]) => {
              resolve(results);
            });
          })
            .then((result) => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }

  deleteProduct(id) {
    return new Promise((resolve) => {
      this.initDB()
        .then((db) => {
          db.transaction((tx) => {
            tx.executeSql('DELETE FROM Product WHERE chat_id = ?', [id]).then(
              ([tx, results]) => {
                console.log(results);
                resolve(results);
              },
            );
          })
            .then((result) => {
              this.closeDatabase(db);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
}
