import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Users extends Component {
  state = {
    data: [],
  };

  componentDidMount = () => {
    var db = openDatabase({name: 'dmis_chat.db', createFromLocation: 1});
    db.transaction((txn) => {
      txn.executeSql(
        'SELECT t.chat_id, t.chat_title, t.chat_body, t.display_name, t.display_time, t.message_all, t.message_unread FROM chat_topic t ORDER BY t.chat_time DESC',
        [],
        (tx, res) => {
          const threads = res.rows.raw().map((i) => {
            return {
              id: i.chat_id,
              description: i.chat_body,
              date: i.display_time,
              completed: 0,
            };
          });

          this.setState({data: threads});
        },
      );
    });
  };

  clickEventListener = (item) => {
    this.props.navigateToConversation(item);
  };

  __getCompletedIcon = (item) => {
    if (item.completed == 1) {
      return 'https://img.icons8.com/flat_round/64/000000/checkmark.png';
    } else {
      return 'https://img.icons8.com/flat_round/64/000000/delete-sign.png';
    }
  };

  __getDescriptionStyle = (item) => {
    if (item.completed == 1) {
      return {
        textDecorationLine: 'line-through',
        fontStyle: 'italic',
        color: '#808080',
      };
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.tasks}
          columnWrapperStyle={styles.listContainer}
          data={this.state.data}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={[styles.card, {borderColor: item.color}]}
                onPress={() => {
                  this.clickEventListener(item);
                }}>
                <View style={styles.cardContent}>
                  <Text
                    style={[
                      styles.description,
                      this.__getDescriptionStyle(item),
                    ]}>
                    {item.description}
                  </Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={() => this.props.navigateToNewThread()}></ActionButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#eeeeee',
  },
  tasks: {
    flex: 1,
  },
  cardContent: {
    marginLeft: 10,
    marginHorizontal: 2,
  },
  image: {
    width: 25,
    height: 25,
  },

  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,

    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: 'white',
    flexBasis: '46%',
    padding: 5,
    flexDirection: 'column',
    flexWrap: 'wrap',
    borderLeftWidth: 6,
  },

  description: {
    fontSize: 18,
    flex: 1,
    color: '#008080',
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    flex: 1,
    color: '#696969',
    marginTop: 5,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
