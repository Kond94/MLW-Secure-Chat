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
import Database from '../util/database';
const db = new Database();
const addImage = require('../../assets/icons/addImage.png');
const {width, height} = Dimensions.get('window');
export default class Thread extends Component {
  constructor(props) {
    super(props);
    super();
    this.state = {
      isLoading: true,
      messages: [],
      displayName: '',
      notFound: 'Products not found.\nPlease click (+) button to add it.',
      msg: '',
      topic: {
        time: '',
        title: '',
        body: '',
        display_name: '',
      },
    };
  }

  reply = () => {
    var messages = this.state.messages;
    messages.push({
      id: Math.floor(Math.random() * 99999999999999999 + 1),
      sent: false,
      msg: this.state.msg,
      image: 'https://www.bootdey.com/img/Content/avatar/avatar6.png',
    });
    this.setState({msg: '', messages: messages});
  };
  setUsername = async () => {
    return await AsyncStorage.getItem('entity_name');
  };
  componentDidMount = async () => {
    const displayName = await this.setUsername();

    this.setState({displayName: displayName});
    this.getMessages(this.props.navigation.state.params.item.chat_id);
  };

  getMessages = (id) => {
    let messages = [];
    db.getMessages(id)
      .then((data) => {
        messages = data;
        messages = messages.map((m) => {
          const sent = this.state.dispayName === m.display_name ? true : false;
          return {...m, sent};
        });

        this.setState({
          messages: messages,
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

  send = () => {
    if (this.state.msg.length > 0) {
      var messages = this.state.messages;
      messages.push({
        id: Math.floor(Math.random() * 99999999999999999 + 1),
        sent: true,
        msg: this.state.msg,
        image: 'https://www.bootdey.com/img/Content/avatar/avatar1.png',
      });
      this.setState({messages: messages, msg: ''});
      setTimeout(() => {
        // this.reply();
      }, 2000);
    }
  };

  renderItem = ({item}) => {
    if (item.sent === false) {
      return (
        <View style={styles.eachMsg}>
          <View style={styles.msgBlock}>
            <Text style={styles.msgTxt}>{item.chat_body}</Text>
            <Text style={styles.time}>
              {item.display_name + ' - ' + item.display_time}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: 'green', marginHorizontal: 5}}>Reply</Text>

              <Text style={{color: 'blue'}}>Show Comments</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.rightMsg}>
          <View style={styles.rightBlock}>
            <Text style={styles.rightTxt}>{item.chat_body}</Text>
          </View>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.Ogcontainer}>
          <TouchableOpacity onPress={() => {}}></TouchableOpacity>
          <View>
            <Text style={styles.name}>
              {/* {this.props.navigation.state.params.item.description} */}
            </Text>
            <Text style={styles.time}>
              {/* {this.state.topic.display_name +
                ' - ' +
                this.props.navigation.state.params.item.date} */}
            </Text>
          </View>
          {/* <Text rkType="primary3 mediumLine">{this.state.topic.body}</Text> */}
        </View>
        <FlatList
          style={{marginTop: 10}}
          extraData={this.state}
          data={this.state.messages}
          keyExtractor={(item) => {
            return item.chat_id;
          }}
          renderItem={this.renderItem}
        />
        <View style={{flexDirection: 'row'}}>
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
                this.setState({
                  msg: 'Image Uri: ' + JSON.stringify(response.uri),
                });
                this.send();
              })
            }>
            <Image source={addImage} style={{height: 40, width: 40}} />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <TextInput
              style={{...styles.input}}
              value={this.state.msg}
              placeholderTextColor="grey"
              onChangeText={(msg) => this.setState({msg})}
              placeholder="Type a message"
            />
          </View>
          <View
            style={{
              margin: 10,
              alignSelf: 'center',
              shadowColor: '#3d3d3d',
              shadowRadius: 2,
              shadowOpacity: 0.5,
              shadowOffset: {
                height: 1,
              },
            }}>
            <Button title="send" onPress={() => this.send()} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    justifyContent: 'center',
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
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
    borderColor: '#696969',
    borderWidth: 1,
    borderRadius: 10,
  },
  eachMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 2,
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
    backgroundColor: 'silver',
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
  Ogcontainer: {
    borderBottomWidth: 1,
    borderRadius: 15,
    paddingVertical: 12,
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  ogimage: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: 20,
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  time: {
    fontSize: 11,
    color: '#808080',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
