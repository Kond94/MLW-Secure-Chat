import * as React from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
  Image,
  Text,
} from 'react-native';

import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './src/screens/home';
import Thread from './src/screens/thread';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import {openDatabase} from 'react-native-sqlite-storage';
import SelectMultiple from 'react-native-select-multiple';
import NewThread from './src/screens/newThread';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'Warning: AsyncStorage',
  'Warning: componentWillReceiveProps has been renamed',
  'VirtualizedLists should never be nested',
]);

class SignInScreen extends React.Component {
  state = {
    user: {username: '', password: ''},
    users: [],
  };

  static navigationOptions = {
    title: 'Please sign in',
  };

  setUsername = (text) => {
    this.setState({user: {...this.state.user, username: text}});
  };

  setPassword = (text) => {
    this.setState({user: {...this.state.user, password: text}});
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Username"
          style={{
            textAlign: 'center',
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 10,
            width: 200,
          }}
          onChangeText={this.setUsername}
        />

        <TextInput
          placeholder="Password"
          style={{
            textAlign: 'center',
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 10,
            width: 200,
          }}
          onChangeText={this.setPassword}
        />
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    var db = openDatabase({name: 'dmis_chat.db', createFromLocation: 1});
    db.transaction((txn) => {
      txn.executeSql('SELECT * FROM chat_entity', [], async (tx, res) => {
        const users = res.rows.raw().map((u) => {
          return {
            username: u.entity_id,
            password: u.pword,
            displayName: u.entity_name,
          };
        });
        if (users.find((user) => user.username === this.state.user.username)) {
          if (
            users.find((user) => user.password === this.state.user.password)
          ) {
            await AsyncStorage.setItem('userToken', 'abc');
            await AsyncStorage.setItem('entity_name', this.state.user.username);
            await AsyncStorage.setItem(
              'entity_display_name',
              users.find((user) => user.username === this.state.user.username)
                .displayName,
            );
            this.props.navigation.navigate('App');
          } else {
            alert('Please check your password');
          }
        } else {
          alert('That username does not exist');
        }
      });
    });
  };
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  componentDidMount() {
    // var db = openDatabase({name: 'dmis_chat.db', createFromLocation: 1});
    // db.transaction(function (txn) {
    //   txn.executeSql(
    //     'SELECT t.chat_id, t.chat_title, t.chat_body, t.display_name, t.display_time, t.message_all, t.message_unread FROM chat_topic t ORDER BY t.chat_time DESC',
    //     [],
    //     function (tx, res) {
    //       console.log('item:', res.rows.length);
    //       if (res.rows.length == 0) {
    //         console.log('Nada');
    //       }
    //     },
    //   );
    // });
  }

  render() {
    return (
      <>
        <Home
          navigateToConversation={this._showMoreApp}
          navigateToNewThread={this._showSelectParticipants}
        />
        <Button title="sign me out" onPress={this._signOutAsync} />
      </>
    );
  }

  _showMoreApp = (item) => {
    this.props.navigation.navigate('Other', {item: item});
  };

  _showSelectParticipants = () => {
    this.props.navigation.navigate('SelectParticipants');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class OtherScreen extends React.Component {
  static navigationOptions = {
    title: 'Thread',
  };
  state = {
    users: {},
  };

  render() {
    return <Thread navigation={this.props.navigation} />;
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class NewThreadScreen extends React.Component {
  static navigationOptions = {
    title: 'New Thread',
  };
  state = {
    users: {},
  };

  render() {
    return <NewThread navigation={this.props.navigation} />;
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class SelectParticipantsScreen extends React.Component {
  static navigationOptions = {
    title: 'Select Participants',
  };
  state = {
    users: [],
    selectedUsers: [],
  };
  componentDidMount() {
    var db = openDatabase({name: 'dmis_chat.db', createFromLocation: 1});
    var users = [];
    db.transaction((txn) => {
      txn.executeSql('SELECT * FROM chat_entity', [], (tx, res) => {
        users = res.rows.raw().map((u) => {
          return {label: u.entity_name, value: u.entity_id};
        });

        this.setState({users: users});
      });
    });
  }

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };

  _navigateHome = async () => {
    this.props.navigation.navigate('Home');
  };

  _showNewThread = () => {
    this.props.navigation.navigate('NewThread', {
      participants: this.state.selectedUsers,
      navigateToHome: this._navigateHome,
    });
  };

  renderLabel = (label, style) => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{marginLeft: 10}}>
          <Text style={style}>{label}</Text>
        </View>
      </View>
    );
  };

  onSelectionsChange = (selectedUsers) => {
    // selectedFruits is array of { label, value }
    this.setState({selectedUsers});
  };

  render() {
    const userList = this.state.users;
    return (
      <View>
        <View style={{width: '50%', alignSelf: 'center', margin: 7}}>
          <Button
            disabled={this.state.selectedUsers.length === 0 ? true : false}
            title="next"
            onPress={this._showNewThread}
          />
        </View>
        <ScrollView>
          <SelectMultiple
            items={this.state.users}
            renderLabel={this.renderLabel}
            selectedItems={this.state.selectedUsers}
            onSelectionsChange={this.onSelectionsChange}
          />
        </ScrollView>
      </View>
    );
  }
}

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Other: OtherScreen,
  NewThread: NewThreadScreen,
  SelectParticipants: SelectParticipantsScreen,
});
const AuthStack = createStackNavigator({SignIn: SignInScreen});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
