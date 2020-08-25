import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

const {width, height} = Dimensions.get('window');
export default class NewThread extends Component {
  constructor(props) {
    super(props);

    this.state = {title: '', body: ''};
  }

  addThread = () => {
    var db = openDatabase({name: 'dmis_chat.db', createFromLocation: 1});
    console.log('Starting');
    db.transaction(function (txn) {
      txn.executeSql(
        'INSERT INTO chat (chat_id, uname, display_name, chat_title, chat_body, has_attachment, chat_time, thread_parent, thread_root) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          '036de6df-e4a3-11ea-a1f9-00155d1e5b38',
          'tuda6',
          'Monie Kamsesa',
          'These things are NOT EASY',
          'Some guyt says THEY ARE. What is he smoking!',
          'N',
          '2020-08-25 18:16:29',
          null,
          null,
        ],
        function (tx, res) {
          console.log(res);
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            console.log('Nada');
          }
        },
        function (err) {
          console.log(err);
        },
      );
    });
    this.props.navigation.state.params.navigateToHome();
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{margin: 10}}>
          <Text>Participants:</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 5}}>
            {this.props.navigation.state.params.participants.map((p, i) => (
              <View
                key={i}
                style={{
                  borderWidth: 1,
                  borderRadius: 3,
                  padding: 2,
                  margin: 2,
                }}>
                <Text>{p.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.input}>
          <TextInput
            style={{flex: 1}}
            value={this.state.title}
            placeholderTextColor="#696969"
            onChangeText={(title) => this.setState({title})}
            blurOnSubmit={false}
            placeholder="Title"
            returnKeyType="send"
          />
        </View>
        <View style={styles.input}>
          <TextInput
            style={{flex: 1}}
            value={this.state.body}
            placeholderTextColor="#696969"
            onChangeText={(body) => this.setState({body})}
            blurOnSubmit={false}
            placeholder="Body"
            returnKeyType="send"
            numberOfLines={9}
          />
        </View>
        <View style={{width: '50%', alignSelf: 'center'}}>
          <Button
            onPress={() => this.addThread()}
            style={{width: 50}}
            title="Submit"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  image: {
    width,
    height,
  },
  header: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#075e54',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
  },
  chatTitle: {
    color: '#fff',
    fontWeight: '600',
    margin: 10,
    fontSize: 15,
  },
  chatImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  input: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 10,
    // height: 40,
    width: width - 20,
    backgroundColor: '#fff',
    margin: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
    borderColor: '#696969',
    borderWidth: 1,
  },
  eachMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
  },
  rightMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
    alignSelf: 'flex-end',
  },
  userPic: {
    height: 40,
    width: 40,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
  },
  msgBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    padding: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  rightBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: '#97c163',
    padding: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  msgTxt: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  rightTxt: {
    fontSize: 15,
    color: '#202020',
    fontWeight: '600',
  },
});
