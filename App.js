import AsyncStorage from '@react-native-community/async-storage';
import * as React from 'react';
import {
  ActivityIndicator,
  LogBox,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {Buffer} from 'buffer';
import {Home} from './src/screens/Home';
import Chat from './src/screens/Chat';
import NewThread from './src/screens/NewThread';
import {SelectParticipants} from './src/screens/SelectParticipants';
import PinScreen from './src/screens/PinScreen';
import LoginScreen from './src/screens/LoginScreen';
import HelpScreen from './src/screens/HelpScreen';

LoginScreen.navigationOptions = {headerShown: false};
HelpScreen.navigationOptions = {headerShown: false};
PinScreen.navigationOptions = {headerShown: false};

global.Buffer = Buffer; // very important

LogBox.ignoreLogs([
  'Remote debugger is in a background tab',
  'Warning: componentWillReceiveProps has been renamed',
  'Animated: `useNativeDriver`',
  'Animated.event now requires a second argument',
]);

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    const lockTime = await AsyncStorage.getItem('lockTime');
    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (userToken) {
      if (new Date() - new Date(lockTime) > 2000 && lockTime !== null) {
        this.props.navigation.navigate('PinScreen', {status: 'enter'});
      } else {
        this.props.navigation.navigate('App');
      }
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const AppStack = createStackNavigator({
  Home: Home,
  SelectParticipants: SelectParticipants,
  NewThread: NewThread,
  Chat: Chat,
});

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  HelpScreen: HelpScreen,
  PinScreen: PinScreen,
});

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
