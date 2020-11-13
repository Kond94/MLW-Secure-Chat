import AsyncStorage from '@react-native-community/async-storage';
import * as React from 'react';

import {ImageBackground, StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Chip, FAB, List, Searchbar, Text} from 'react-native-paper';
import {getChatEntities} from '../core/queries';

export class SelectParticipants extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  state = {
    users: [],
    selectedUsers: [],
  };

  componentDidMount = async () => {
    const user = await AsyncStorage.getItem('logged_in_user');
    let users = await getChatEntities();

    users = users.filter((u) => u.entity_id !== user);

    this.setState({users});
  };

  _showNewThread = () => {
    this.props.navigation.navigate('NewThread', {
      participants: this.state.selectedUsers,
      user: this.props.navigation.state.params.user,
      navigateToHome: this._navigateHome,
    });
  };

  search = async (text) => {
    let users = await getChatEntities();

    this.state.selectedUsers.forEach((element) => {
      users = users.filter((u) => u.entity_id !== element.entity_id);
    });

    users = users.filter((u) =>
      u.entity_id.toLowerCase().includes(text.toLowerCase()),
    );

    this.setState({users: users});
  };

  onRemove = (participant) => {
    const selectedUsers = this.state.selectedUsers.filter(
      (u) => u.value !== participant.value,
    );

    this.setState({
      selectedUsers: selectedUsers,
      users: [...this.state.users, participant],
    });
  };

  onSelectionsChange = (item) => {
    let selectedUsers = this.state.selectedUsers;
    let users = this.state.users;

    if (selectedUsers.includes(item)) {
      selectedUsers = selectedUsers.filter(
        (u) => u.entity_id !== item.entity_id,
      );
      users = [...users, item];
    } else {
      selectedUsers = [...selectedUsers, item];
      users = users.filter((u) => u.entity_id !== item.entity_id);
    }

    this.setState({selectedUsers, users});
  };

  render() {
    const {selectedUsers, users} = this.state;
    return (
      <ImageBackground
        style={{width: '100%', height: '100%'}}
        source={require('../assets/bg1.jpg')}>
        <Searchbar
          style={{margin: 20}}
          placeholder="Search"
          onChangeText={(text) => this.search(text)}
        />
        <View
          style={{
            backgroundColor: '#F0F0F0',
            borderTopStartRadius: 15,
            borderTopEndRadius: 15,
            opacity: 0.9,
          }}>
          <Text style={{marginVertical: 10, marginLeft: 20}}>
            {selectedUsers.length === 0
              ? 'Please select who can participate:'
              : 'Participants:'}
          </Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: 10}}>
            {selectedUsers.map((participant, i) => (
              <Chip
                key={i}
                style={{margin: 2, backgroundColor: 'orange'}}
                onPress={() => {
                  const participants = this.state.selectedUsers.filter(
                    (p) => p.entity_id !== participant.entity_id,
                  );

                  let users = this.state.users;

                  users.push(participant);

                  this.setState({selectedUsers: participants, users: users});
                }}>
                {participant.entity_id}
              </Chip>
            ))}
          </View>
        </View>
        <FlatList
          style={{backgroundColor: '#F0F0F0', opacity: 0.8}}
          data={users}
          keyExtractor={(item) => {
            return item.entity_id;
          }}
          renderItem={({item}) => (
            <List.Item
              onPress={() => {
                this.onSelectionsChange(item);
              }}
              title={item.entity_id}
              left={(props) => <List.Icon {...props} icon="account-circle" />}
            />
          )}
        />
        {selectedUsers.length > 0 ? (
          <FAB
            style={{
              position: 'absolute',
              margin: 30,
              right: 0,
              bottom: 0,
              backgroundColor: 'green',
            }}
            color="white"
            large
            icon="arrow-right-bold"
            onPress={() =>
              this.props.navigation.navigate('NewThread', {
                participants: selectedUsers,
              })
            }
          />
        ) : (
          <></>
        )}
      </ImageBackground>
    );
  }
}
