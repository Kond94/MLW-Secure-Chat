import React, {memo} from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import PINCode, {hasUserSetPinCode} from '@haskkor/react-native-pincode';
import AsyncStorage from '@react-native-community/async-storage';

const _finishProcess = async (pin, navigate) => {
  await AsyncStorage.setItem('userToken', 'abc');
  const hasPin = await hasUserSetPinCode();
  if (hasPin) {
    navigate();
  }
};

const PinScreen = ({navigation}) => (
  <Background>
    <Header>
      {navigation.state.params.status === 'choose'
        ? 'Let’s start'
        : 'Welcome Back'}
    </Header>
    <PINCode
      stylePinCodeColorTitle="white"
      stylePinCodeColorSubtitle="white"
      status={navigation.state.params.status}
      finishProcess={(pin) =>
        _finishProcess(pin, async () =>
          navigation.navigate('App', {
            user: await AsyncStorage.getItem('logged_in_user'),
          }),
        )
      }
    />
  </Background>
);

export default memo(PinScreen);
