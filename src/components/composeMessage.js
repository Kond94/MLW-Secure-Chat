import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TextInput from './TextInput';
import {TextInput as Input} from 'react-native-paper';
import ImagePicker from 'react-native-image-picker';
import {imagePickerOptions} from '../core/utils';
import {Card, Text, Button} from 'react-native-paper';

class ComposeMessage extends Component {
  state = {};
  render() {
    return (
      <View style={{flex: 1}}>
        {this.props.base64_image !== null ? (
          <View style={{margin: 10}}>
            <Text style={{color: 'grey', margin: 5}}>Photo</Text>
            <Card>
              <Card.Cover
                source={{
                  uri: `data:image/png;base64,${this.props.base64_image}`,
                }}
              />
              <Card.Actions>
                <Button>Retake</Button>
                <Button>Delete</Button>
              </Card.Actions>
            </Card>
          </View>
        ) : (
          <View />
        )}
        <View style={{flexDirection: 'row', flex: 1}}>
          <View style={{flex: 0.9}}>
            <TextInput
              style={{margin: 8}}
              label="Body"
              placeholder="Type your message"
              onChangeText={(text) => {
                this.props.onChangeText(text);
              }}
              right={
                <Input.Icon
                  name="camera"
                  color="green"
                  onPress={() => {
                    ImagePicker.showImagePicker(
                      imagePickerOptions,
                      (response) => {
                        if (!response.didCancel) {
                          this.props.addImage({base64_image: response.data});
                        }
                      },
                    );
                  }}
                />
              }
            />
          </View>
          <View style={{...styles.sendButton, flex: 0.1}}>
            <TouchableOpacity onPress={this.props.submit}>
              <Icon name="send-circle" size={40} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default ComposeMessage;

const styles = StyleSheet.create({
  cardContent: {
    marginHorizontal: 15,
    marginVertical: 15,
    flex: 1,
    textAlignVertical: 'center',
    flexDirection: 'column',
  },
  threadDetails: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 5,
  },
  card: {
    elevation: 12,
    backgroundColor: 'white',
    padding: 3,
    flexDirection: 'row',
  },
  SectionStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    // height: 40,
    maxHeight: 100,
    borderRadius: 5,
    margin: 10,
  },

  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  sendButton: {
    marginRight: 5,
    alignSelf: 'center',
    elevation: 4,
  },
  imagePreview: {
    borderWidth: 2,
    height: 150,
    width: '100%',
  },
  addImage: {
    margin: 10,
    alignSelf: 'center',
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  date: {
    fontSize: 14,
    flex: 1,
    color: '#696969',
    marginTop: 5,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageDetails: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 5,
  },
  messageInput: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
    borderColor: '#696969',
    borderWidth: 1,
    borderRadius: 10,
  },

  message: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
    marginLeft: 10,
    paddingLeft: 10,
    borderBottomLeftRadius: 100,
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 10,
  },
  messageBlock: {
    flex: 0.9,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    marginLeft: -3,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },

  messageSent: {
    flex: 0.9,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
    marginRight: 10,
    paddingRight: 10,
    borderBottomRightRadius: 100,
    alignSelf: 'flex-end',
    backgroundColor: '#4CAC1D',
    borderRadius: 5,
    elevation: 10,
  },
  messageBlockSent: {
    flex: 0.9,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#4CAC1D',
    padding: 10,
    marginRight: -3,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },

  messageText: {
    fontSize: 15,
    color: '#202020',
    fontWeight: '600',
  },
  threadHeader: {
    borderBottomWidth: 1,
    borderRadius: 15,
    paddingVertical: 12,
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  ThreadImage: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: 20,
  },
  messageTime: {
    fontSize: 11,
    color: '#808080',
  },
  messageDisplayName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
