import * as React from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';

import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './src/screens/home';
import Thread from './src/screens/thread';
import NewThread from './src/screens/newThread';
import UserList from './src/screens/userList';
import {TextInput} from 'react-native-gesture-handler';
import {openDatabase} from 'react-native-sqlite-storage';

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
          return {username: u.entity_name, password: u.pword};
        });
        // console.log(users);
        // console.log(this.state.user);
        if (users.find((user) => user.username === this.state.user.username)) {
          if (
            users.find((user) => user.password === this.state.user.password)
          ) {
            await AsyncStorage.setItem('userToken', 'abc');
            await AsyncStorage.setItem('entity_name', this.state.user.username);
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
          navigateToNewThread={this._showNewThread}
        />
        <Button title="sign me out" onPress={this._signOutAsync} />
      </>
    );
  }

  _showMoreApp = (item) => {
    this.props.navigation.navigate('Other', {item: item});
  };

  _showNewThread = () => {
    this.props.navigation.navigate('NewThread');
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
  componentDidMount() {
    var db = openDatabase({name: 'dmis_chat.db', createFromLocation: 1});
    db.transaction((txn) => {
      txn.executeSql('SELECT * FROM chat_entity', [], (tx, res) => {
        var users = {};
        var x = res.rows.raw().map((u) => {
          var use = {};
          use[u.entity_id] = u.entity_name;
          return use;
        });
        for (let index = 0; index < x.length; index++) {
          users = {...users, ...x[index]};
        }
        console.log(users);
        this.setState({users: users});
      });
    });
  }
  _showUserList = () => {
    this.props.navigation.navigate('UserList');
  };

  _showHome = () => {
    this.props.navigation.navigate('Home');
  };

  render() {
    const userList = this.state.users;
    return (
      <UserList
        options={userList}
        search={true} // should show search bar?
        multiple={true} //
        placeholder={'Search'}
        placeholderTextColor={'#757575'}
        returnValue={'labevaluel'} // label or value
        callback={(res) => {
          console.log(res);
        }} // callback, array of selected items
        rowBackgroundColor={'#eee'}
        rowHeight={40}
        rowRadius={5}
        iconColor={'#00a2dd'}
        iconSize={30}
        selectedIconName={'ios-checkmark-circle-outline'}
        unselectedIconName={'ios-radio-button-off-outline'}
        scrollViewHeight={130}
        selected={[1, 2]} // list of options which are selected by default
      />
    );
  }
}

class UserListScreen extends React.Component {
  static navigationOptions = {
    title: 'Select Contacts',
  };

  render() {
    return <UserList />;
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
  UserList: UserListScreen,
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
