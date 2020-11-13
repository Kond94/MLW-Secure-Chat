import React, {memo, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import {theme} from '../core/theme';

const HelpScreen = ({navigation}) => {
  return (
    <Background>
      <Logo />

      <Header>ULTRA CHAT</Header>
      <Text style={{...styles.link, textAlign: 'center'}}>
        This app is designated for students learning ultrasound. Please contact
        X to get your login details
      </Text>

      <View style={styles.row}>
        <Text style={styles.label}>Got your details? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(HelpScreen);
