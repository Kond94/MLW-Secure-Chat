import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
const {width, height} = Dimensions.get('window');
export default class NewThread extends Component {
  constructor(props) {
    super(props);

    this.state = {msg: ''};
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Button
          title="Add Participants"
          onPress={() => this.props.navigateToUserList()}
        />
        <View style={styles.input}>
          <TextInput
            style={{flex: 1}}
            value={this.state.msg}
            placeholderTextColor="#696969"
            onChangeText={(msg) => this.setState({msg})}
            blurOnSubmit={false}
            placeholder="Title"
            returnKeyType="send"
          />
        </View>
        <View style={styles.input}>
          <TextInput
            style={{flex: 1}}
            value={this.state.msg}
            placeholderTextColor="#696969"
            onChangeText={(msg) => this.setState({msg})}
            blurOnSubmit={false}
            placeholder="Body"
            returnKeyType="send"
            numberOfLines={9}
          />
        </View>
        <Button
          onPress={() => this.props.navigateToHome()}
          style={{width: 50}}
          title="Submit"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  image: {
    width,
    height,
  },
  header: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#075e54',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
  },
  chatTitle: {
    color: '#fff',
    fontWeight: '600',
    margin: 10,
    fontSize: 15,
  },
  chatImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  input: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    padding: 10,
    // height: 40,
    width: width - 20,
    backgroundColor: '#fff',
    margin: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
    borderColor: '#696969',
    borderWidth: 1,
  },
  eachMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
  },
  rightMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
    alignSelf: 'flex-end',
  },
  userPic: {
    height: 40,
    width: 40,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
  },
  msgBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    padding: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  rightBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: '#97c163',
    padding: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  msgTxt: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  rightTxt: {
    fontSize: 15,
    color: '#202020',
    fontWeight: '600',
  },
});
