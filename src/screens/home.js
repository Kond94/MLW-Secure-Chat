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
import ImagePicker from 'react-native-image-picker';
import Database from '../util/database';
const db = new Database();

import ActionButton from 'react-native-action-button';

export default class Home extends Component {
  state = {
    data: [],
  };

  getThreads = () => {
    let threads = [];
    db.getThreads()
      .then((data) => {
        threads = data;
        this.setState({
          data: threads,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState = {
          isLoading: false,
        };
      });
  };
  componentDidMount = () => {
    this.getThreads();
  };

  clickEventListener = (item) => {
    this.props.navigateToConversation(item);
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.tasks}
          columnWrapperStyle={styles.listContainer}
          data={this.state.data}
          keyExtractor={(item) => {
            return item.chat_id;
          }}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                style={[styles.card, {borderColor: item.color}]}
                onPress={() => this.clickEventListener(item)}>
                <View style={styles.cardContent}>
                  <Text style={[styles.description]}>{item.chat_title}</Text>
                  <Text style={styles.date}>
                    {item.display_name + ' - ' + item.display_time}
                  </Text>
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
