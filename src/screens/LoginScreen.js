import React, {memo, useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {theme} from '../core/theme';
import {
  api,
  emailValidator,
  passwordValidator,
  userValidator,
} from '../core/utils';
import AsyncStorage from '@react-native-community/async-storage';
import {addUser} from '../core/queries';
import Axios from 'axios';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});

  const _onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      return;
    }

    await Axios.get(api + 'get_users.php').then(async (response) => {
      const entities = await response.data.map((e) => {
        return {
          entity_id: e.entity_id,
          suspended: e.suspended,
        };
      });

      entities.forEach(async (entity) => {
        await addUser(entity);
      });
    });

    const userError = await userValidator(email.value);

    if (!userError) {
      alert('Sorry Invalid user');
      return;
    }
    await AsyncStorage.setItem('logged_in_user', email.value);
    await AsyncStorage.setItem('initialPull', 'false');
    await AsyncStorage.setItem('lockTime', 'null');

    navigation.navigate('PinScreen', {status: 'choose'});
  };

  return (
    <Background>
      <Logo />

      <Header>SECURE CHAT</Header>

      <TextInput
        label="Username"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({value: text, error: ''})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        theme={theme}
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({value: text, error: ''})}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        theme={theme}
      />

      <Button theme={theme} mode="contained" onPress={_onLoginPressed}>
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Need help? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('HelpScreen')}>
          <Text style={styles.link}>Tap here</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(LoginScreen);
