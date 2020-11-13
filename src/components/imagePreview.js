/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {StyleSheet, Text, View, Image as RNImage} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

class ImagePreview extends Component {
  state = {};
  render() {
    return (
      <View
        style={{
          // padding: 10,
          backgroundColor: '#F0F0F0',
          borderRadius: 10,
          elevation: 4,
        }}>
        {this.props.title ? (
          <Text
            style={{
              margin: 5,
              textAlign: 'left',
              fontWeight: 'bold',
              fontSize: 17,
              marginLeft: 30,
            }}>
            {this.props.title}
          </Text>
        ) : (
          <></>
        )}
        <TouchableOpacity onPress={this.props.onExpand}>
          <Image
            style={styles.imagePreview}
            source={{
              uri: `data:image/gif;base64,${this.props.image}`,
            }}
            indicator={ProgressBar}
          />
        </TouchableOpacity>
        {this.props.editable ? (
          <View
            style={{
              flexDirection: 'row',
              margin: 5,
            }}>
            <TouchableOpacity onPress={this.props.onRetake}>
              <RNImage
                style={{
                  marginLeft: 30,
                  marginHorizontal: 15,
                  height: 20,
                  width: 20,
                }}
                source={this.props.redoIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.onRemove}>
              <RNImage
                style={{height: 20, width: 20}}
                source={this.props.deleteIcon}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  }
}

export default ImagePreview;

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

  imagePreview: {
    height: 150,
    width: 300,
    borderRadius: 10,
    alignSelf: 'center',
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
