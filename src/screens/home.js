import AsyncStorage from '@react-native-community/async-storage';
import * as React from 'react';
import {
  ActivityIndicator,
  AppState,
  FlatList,
  ImageBackground,
  Text,
} from 'react-native';
import {FAB, List, Searchbar} from 'react-native-paper';
import {Appbar} from 'react-native-paper';
import {addChat, getChatTopics} from '../core/queries';
import UserAvatar from 'react-native-user-avatar';
import Axios from 'axios';
import {api} from '../core/utils';

export class Home extends React.Component {
  state = {
    threads: [],
    time: null,
    intervalId: null,
    loading: false,
    pullState: null,
  };

  static navigationOptions = ({navigation}) => ({
    // header: () => (
    //   <Appbar.Header>
    //     <Appbar.Content title="ULTRA" subtitle="Hello" />
    //     {/* <Appbar.Action icon="dots-vertical" /> */}
    //   </Appbar.Header>
    // ),
    headerShown: null,
  });

  _signOutAsync = async () => {
    this.props.navigation.navigate('Auth');
  };

  componentDidMount = async () => {
    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      async () => {
        this.setState({threads: await getChatTopics()});
      },
    );
    const pullState = await AsyncStorage.getItem('initialPull');
    if (pullState === 'false') {
      this.setState({pullState: 'initial'});
      this.setState({loading: true});
      await this.getChats('get_all_chats');
      await AsyncStorage.setItem('initialPull', 'true');
      this.setState({loading: false});
      this.setState({pullState: null});
    }

    let intervalId = 0;

    intervalId = setInterval(async () => {
      await this.getChats('get_chats');
    }, 2000);
    this.setState({intervalId: intervalId});

    AppState.addEventListener('change', this._handleAppStateChange);
  };

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async (nextAppState) => {
    const lockTime = await AsyncStorage.getItem('lockTime');
    this.setState({appState: nextAppState});
    if (lockTime === null) {
      await AsyncStorage.setItem('lockTime', new Date().toDateString());
    } else {
      if (
        this.state.appState === 'active' &&
        new Date() - new Date(lockTime) > 30000
      ) {
        this.props.navigation.navigate('PinScreen', {status: 'enter'});
      }
    }
    await AsyncStorage.setItem('lockTime', new Date().toString());
    this.setState({appState: nextAppState});
  };

  getChats = async (mode) => {
    console.log('Getting Threads');
    const user = await AsyncStorage.getItem('logged_in_user');
    await Axios.get(api + 'chats/' + mode + '.php?uname=' + user)
      .then(async (response) => {
        let serverChats = [];

        serverChats = await response.data.map((c) => {
          return {
            chat_id: c.chat_id,
            uname: c.uname,
            display_name: c.uname,
            chat_title: c.chat_title,
            chat_body: c.chat_body,
            chat_time: c.chat_time,
            thread_parent: c.thread_parent,
            thread_root: c.thread_root,
            chat_read: 'N',
            base64_image: c.base64_image,
          };
        });

        await serverChats.forEach(async (chat) => {
          await addChat(chat);
        });
        this.setState({threads: await getChatTopics()});
      })
      .catch(async (error) => {
        if (this.state.threads.length === 0) {
          this.setState({loading: true});
          console.log('state is empty');
          this.setState({threads: await getChatTopics()});
          this.setState({loading: false});
        }
        console.log('Nothing to update');
      });
  };

  search = async (text) => {
    let threads = await getChatTopics();

    threads = threads.filter((t) =>
      t.chat_title.toLowerCase().includes(text.toLowerCase()),
    );

    this.setState({threads: threads});
  };

  render() {
    return (
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        source={require('../assets/bg1.jpg')}>
        <Searchbar
          style={{margin: 20}}
          placeholder="Search"
          onChangeText={(text) => this.search(text)}
        />
        {this.state.loading === true ? (
          <>
            <ActivityIndicator
              size="small"
              style={{
                flex: 1,
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
              color="#F0F0F0"
            />
            {this.state.pullState === 'initial' ? (
              <Text
                style={{
                  flex: 1,
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  color: '#F0F0F0',
                }}>
                Retrieving your initial messages
              </Text>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <FlatList
              style={{marginTop: 10}}
              data={this.state.threads}
              keyExtractor={(item) => {
                return item.chat_id;
              }}
              renderItem={({item}) => {
                return (
                  <List.Item
                    style={{
                      backgroundColor: '#F7F7F7',
                      borderRadius: 10,
                      marginVertical: 1,
                      marginHorizontal: 3,
                      elevation: 10,
                    }}
                    onPress={async () => {
                      await this.props.navigation.navigate('Chat', {
                        chat: item,
                        search: false,
                      });

                      this.setState({threads: await getChatTopics()});
                    }}
                    titleNumberOfLines={5}
                    descriptionNumberOfLines={1}
                    title={item.chat_title}
                    description={item.display_name + ' ' + item.chat_time}
                    left={(props) => (
                      <UserAvatar
                        style={{height: 40, width: 40, alignSelf: 'center'}}
                        borderRadius={25}
                        name={item.display_name}
                      />
                    )}
                    right={(props) =>
                      item.message_unread > 0 ? (
                        <List.Icon {...props} color="orange" icon="star" />
                      ) : (
                        <></>
                      )
                    }
                  />
                );
              }}
            />
          </>
        )}
        <FAB
          style={{
            position: 'absolute',
            margin: 30,
            right: 0,
            bottom: 0,
            backgroundColor: '#53BE64',
          }}
          color="#FFFFFF"
          large
          icon="plus"
          onPress={() => this.props.navigation.navigate('SelectParticipants')}
        />
      </ImageBackground>
    );
  }
}
