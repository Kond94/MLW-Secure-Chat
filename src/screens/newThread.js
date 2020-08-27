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
  AsyncStorage,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
const addImage = require('../../assets/icons/addImage.png');

import {openDatabase} from 'react-native-sqlite-storage';

const {width, height} = Dimensions.get('window');
export default class NewThread extends Component {
  constructor(props) {
    super(props);

    this.state = {title: '', body: ''};
  }
  setDname = async () => {
    return await AsyncStorage.getItem('entity_display_name');
  };
  setEid = async () => {
    return await AsyncStorage.getItem('entity_name');
  };

  getDate = () => {
    let date_ob = new Date();

    // adjust 0 before single digit date
    let date = ('0' + date_ob.getDate()).slice(-2);

    // current month
    let month = ('0' + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return (
      year +
      '-' +
      month +
      '-' +
      date +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    );
  };

  makeid = (length) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  addRecord = () => {};
  addThread = async () => {
    var db = openDatabase(
      {name: 'dmis_chat.db', createFromLocation: 1},
      () => {
        console.log('succ');
      },
      () => {
        console.log('err');
      },
    );
    var dname = await this.setDname();
    var uname = await this.setEid();
    var time = this.getDate();

    db.transaction(function (txn) {
      txn.executeSql(
        'INSERT INTO chat (chat_id, uname, display_name, chat_title, chat_body, has_attachment, chat_time, thread_parent, thread_root) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          this.makeid(36),
          uname,
          dname,
          this.state.title,
          this.state.body,
          'N',
          time,
        ],
        (tx, res) => {
          console.log(tx);
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            console.log('Nada');
          }
        },
        (err) => {
          console.log(err);
        },
      );
    });

    this.props.navigation.state.params.navigateToHome();
  };

  render() {
    return (
      <ScrollView style={{flex: 1}}>
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
        <TouchableOpacity
          style={{
            margin: 10,
            alignSelf: 'center',
            shadowColor: '#3d3d3d',
            shadowRadius: 2,
            shadowOpacity: 0.5,
            shadowOffset: {
              height: 1,
            },
          }}
          onPress={() =>
            ImagePicker.showImagePicker({}, (response) => {
              console.log(response.uri);
              this.setState({image: response.uri});
            })
          }>
          <Image source={addImage} style={{height: 40, width: 40}} />
        </TouchableOpacity>
        {this.state.image ? (
          <Image
            source={{uri: this.state.image}}
            style={{height: 150, width: 300, margin: 10, alignSelf: 'center'}}
          />
        ) : (
          <></>
        )}
        <View style={{width: '50%', alignSelf: 'center', margin: 10}}>
          <Button
            onPress={() => this.addThread()}
            style={{width: 50}}
            title="Submit"
          />
        </View>
      </ScrollView>
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
