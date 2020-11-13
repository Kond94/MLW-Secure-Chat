/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {Text, View, ScrollView, Keyboard, ImageBackground} from 'react-native';
import {Chip} from 'react-native-paper';

import AsyncStorage from '@react-native-community/async-storage';

import ComposeMessage from '../components/composeMessage';
import TextInput from '../components/TextInput';
import Axios from 'axios';
import Header from '../components/Header';
import {api} from '../core/utils';

export default class NewThread extends Component {
  static navigationOptions = {
    headerShown: false,
  };
  state = {
    title: '',
    body: '',
    base64_image: null,
  };

  addThread = async () => {
    if (this.state.title.trim() === '') {
      alert('Please enter a title');
      return;
    }

    if (this.state.body.trim() === '') {
      alert('Please enter a message');
      return;
    }

    Keyboard.dismiss();
    const user = await AsyncStorage.getItem('logged_in_user');
    let participants = await this.props.navigation.state.params.participants.map(
      (p) => p.entity_id,
    );

    participants = await participants.join(',');
    const serverMessage = {
      uname: user,
      chat_title: this.state.title,
      chat_body: this.state.body,
      base64_image: this.state.base64_image,
      thread_parent: null,
      thread_root: null,
      send2user: participants,
      send2group: null,
    };

    await Axios.post(api + 'chats/create.php?', serverMessage)
      .then((response) => {
        this.props.navigation.navigate('Home');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const participants = this.props.navigation.state.params.participants;
    return (
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        source={require('../assets/bg1.jpg')}>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              margin: 10,
              marginBottom: 5,
              borderBottomWidth: 1,
              borderColor: 'silver',
            }}>
            <View style={{alignItems: 'center'}}>
              <Header>Compose Thread</Header>
            </View>
            <Text style={{marginHorizontal: 15, color: 'white'}}>
              Participants:
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginVertical: 5,
              }}>
              {participants.map((participant, i) => (
                <Chip key={i} style={{margin: 2}} onPress={() => {}}>
                  {participant.entity_id}
                </Chip>
              ))}
            </View>
          </View>
          <Text
            style={{
              marginRight: 15,
              flex: 0,
              textAlign: 'right',
              color: this.state.title.length > 100 ? 'red' : 'white',
            }}>
            {140 - this.state.title.length}
          </Text>

          <TextInput
            style={{margin: 8}}
            label="Title"
            placeholder="Type a title"
            returnKeyType="next"
            onChangeText={(text) => this.setState({title: text})}
            multiline={true}
            maxLength={140}
          />

          <ComposeMessage
            onChangeText={(body) => this.setState({body})}
            message={this.state.message}
            submit={() => this.addThread()}
            addImage={({base64_image}) => {
              this.setState({base64_image});
            }}
            base64_image={this.state.base64_image}
          />
        </ScrollView>
      </ImageBackground>
    );
  }
}
