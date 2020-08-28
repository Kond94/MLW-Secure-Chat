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
import Database from './src/util/database';
const db = new Database();
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
    let users = [];
    db.getUsers()
      .then(async (data) => {
        users = data;
        if (users.find((user) => user.entity_id === this.state.user.username)) {
          if (users.find((user) => user.pword === this.state.user.password)) {
            await AsyncStorage.setItem('userToken', 'abc');
            await AsyncStorage.setItem('entity_name', this.state.user.username);
            await AsyncStorage.setItem(
              'entity_display_name',
              users.find((user) => user.entity_id === this.state.user.username)
                .display_name,
            );
            this.props.navigation.navigate('App');
          } else {
            alert('Please check your password');
          }
        } else {
          alert('That username does not exist');
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState = {
          isLoading: false,
        };
      });
  };
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  render() {
    return (
      <>
        <Home
          navigateToConversation={this.showMessagingScreen}
          navigateToNewThread={this._showSelectParticipants}
        />
        <Button title="sign me out" onPress={this._signOutAsync} />
      </>
    );
  }

  showMessagingScreen = (item) => {
    this.props.navigation.navigate('Messaging', {item: item});
  };

  _showSelectParticipants = () => {
    this.props.navigation.navigate('SelectParticipants');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

class MessagingScreen extends React.Component {
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
  Messaging: MessagingScreen,
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
