import React, {Component} from 'react';
import {Composer, GiftedChat, Send} from 'react-native-gifted-chat';
import {getChatDiscussion} from '../core/queries';
import {ImageBackground, Keyboard, Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {api, imagePickerOptions} from '../core/utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Card,
  Searchbar,
  TextInput,
} from 'react-native-paper';
import UserAvatar from 'react-native-user-avatar';
import Axios from 'axios';
import {getParticipants} from '../core/queries';
import ComposeMessage from '../components/composeMessage';

class Chat extends Component {
  static navigationOptions = ({navigation}) => ({
    header: () => (
      <Appbar.Header>
        <UserAvatar
          style={{height: 40, width: 40, alignSelf: 'center'}}
          borderRadius={100}
          name={`${navigation.state.params.chat.display_name}`}
        />
        <Appbar.Content
          title={`${navigation.state.params.chat.chat_title}`}
          subtitle={
            `${navigation.state.params.chat.display_name}` +
            ' - ' +
            `${navigation.state.params.chat.chat_time}`
          }
        />
        {/* <Appbar.Action
          icon="magnify"
          onPress={() => {
            navigation.setParams({
              search: !navigation.state.params.search,
            });
          }}
        /> */}
      </Appbar.Header>
    ),
  });

  state = {
    chat_body: '',
    thread: {},
    messages: [],
    user: null,
    base64_image: null,
    intervalId: null,
    search: false,
  };

  componentDidMount = async () => {
    const user = await AsyncStorage.getItem('logged_in_user');
    const thread = this.props.navigation.state.params.chat;

    this.setState({thread, user});
    this.setMessages();

    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      async () => {
        let intervalId = 0;
        intervalId = setInterval(async () => {
          await this.setMessages();
        }, 2000);
        this.setState({intervalId: intervalId});
      },
    );

    this.focusListener = this.props.navigation.addListener('didBlur', () => {
      clearInterval(this.state.intervalId);
    });
  };

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  setMessages = async () => {
    console.log('Getting Messages');
    let messages = await getChatDiscussion(this.state.thread.chat_id);
    messages = await messages.map((m) => {
      return {
        _id: m.chat_id,
        text: m.chat_body,
        createdAt: m.chat_time,
        image:
          m.base64_image !== null
            ? `data:image/png;base64,${m.base64_image}`
            : null,
        user: {
          _id: m.uname,
          name: m.uname,
          avatar: null,
        },
      };
    });
    this.setState({messages});
  };

  onSend = async () => {
    Keyboard.dismiss();
    const {thread, user} = this.state;
    let participants = await getParticipants(this.state.thread.chat_id);
    participants = await participants.map((p) => p.uname);
    participants = await participants.join(',');
    const serverMessage = {
      uname: user,
      chat_title: '',
      chat_body: this.state.chat_body,
      base64_image: this.state.base64_image,
      thread_parent: thread.chat_id,
      send2user: participants,
      send2group: null,
    };
    this.setState({chat_body: ''});
    await Axios.post(api + 'chats/create.php?', serverMessage)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });

    this.setState({base64_image: null});
  };

  // search = async (text) => {
  //   let messages = this.state.messages;

  //   messages = messages.filter((t) =>
  //     t.text.toLowerCase().includes(text.toLowerCase()),
  //   );

  //   this.setState({messages: messages});
  // };

  render() {
    return (
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        source={require('../assets/bg1.jpg')}>
        {this.props.navigation.state.params.search === true ? (
          <Searchbar
            style={{margin: 20}}
            placeholder="Search"
            onChangeText={(text) => this.search(text)}
          />
        ) : (
          <></>
        )}
        <GiftedChat
          messages={this.state.messages}
          onSend={(message) => {
            this.onSend(message);
          }}
          user={{
            _id: this.state.user,
          }}
          renderUsernameOnMessage={true}
          renderLoading={() => (
            <ActivityIndicator
              style={{
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                flex: 1,
              }}
              size={'small'}
              color="#F0F0F0"
            />
          )}
          renderFooter={() =>
            this.state.base64_image !== null ? (
              <View
                style={{marginTop: 0, marginBottom: 25, marginHorizontal: 10}}>
                <Text style={{color: 'white', margin: 5}}>Preview</Text>
                <Card>
                  <Card.Cover
                    source={{
                      uri: `data:image/png;base64,${this.state.base64_image}`,
                    }}
                  />
                  <Card.Actions>
                    <Button>Retake</Button>
                    <Button>Delete</Button>
                  </Card.Actions>
                </Card>
              </View>
            ) : (
              <View style={{height: 15}} />
            )
          }
          renderComposer={(props) => (
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                backgroundColor: '#F0F0F0',
                height: 60,
              }}>
              <View style={{flex: 0.9}}>
                <TextInput
                  style={{backgroundColor: '#F9F9F9'}}
                  placeholder="Type your message"
                  onChangeText={(text) => {
                    this.setState({chat_body: text});
                  }}
                  value={this.state.chat_body}
                  right={
                    <TextInput.Icon
                      name="camera"
                      color="green"
                      onPress={() => {
                        ImagePicker.showImagePicker(
                          imagePickerOptions,
                          (response) => {
                            if (!response.didCancel) {
                              this.setState({
                                base64_image: response.data,
                              });
                            }
                          },
                        );
                      }}
                    />
                  }
                />
              </View>
              <View
                style={{
                  marginHorizontal: 5,
                  alignSelf: 'center',
                  elevation: 4,
                  flex: 0.1,
                }}>
                <TouchableOpacity onPress={() => this.onSend()}>
                  <Icon name="send-circle" size={35} color="green" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ImageBackground>
    );
  }
}

export default Chat;
