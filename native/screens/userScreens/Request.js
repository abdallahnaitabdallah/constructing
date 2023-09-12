import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, InputToolbar, Message } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {baseUrl} from '../../constants/url';

const Request = () => {
  const [messages, setMessages] = useState([]);
  const user = useSelector(state => state.auth.user);
  const access = useSelector(state => state.auth.access);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${access}`,
          Accept: 'application/json',
        },
      };
      const response = await axios.get(`${baseUrl}/api/chat-messages/`, config);

      const formattedMessages = response.data.map(message => ({
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.timestamp),
        user: {
          _id: message.sender.id,
          name: message.sender.username,
        },
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const onSend = async newMessages => {
    try {
      const accessToken = await AsyncStorage.getItem('access');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
          Accept: 'application/json',
        },
      };

      const attachments = [];

      if (newMessages[0].attachments) {
        attachments.push(newMessages[0].attachments[0].uri);
      }

      const response = await axios.post(
        `${baseUrl}/api/chat-messages/`,
        {
          content: newMessages[0].text,
          sender: user.id,
          attachments,
        },
        config
      );
      const sentMessage = {
        _id: response.data.id,
        text: response.data.content,
        createdAt: new Date(response.data.timestamp),
        user: {
          _id: response.data.sender.id,
          name: response.data.sender.username,
        },
      };
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, [sentMessage])
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const onAttachmentPress = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();

      if (result.type === 'success') {
        const attachmentMessage = {
          text: 'Attachment: ' + result.name,
          user: {
            _id: user.id,
          },
          createdAt: new Date(),
          attachments: [
            {
              uri: result.uri,
              type: result.type,
              name: result.name,
              size: result.size,
            },
          ],
        };

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [attachmentMessage])
        );
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const onImageAttachmentPress = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        const attachmentMessage = {
          text: 'Image: ' + result.uri,
          user: {
            _id: user.id,
          },
          createdAt: new Date(),
          image: result.uri,
        };

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [attachmentMessage])
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const renderMessage = props => {
    const { currentMessage } = props;
    const isSentMessage = currentMessage.sender === user.id;
  
    return (
      <Message
        {...props}
        containerStyle={{
          left: {
            backgroundColor: isSentMessage ? 'black' : '#F0F0F0', // Background color based on whether it's sent by the user
            alignSelf: 'flex-start',
          },
          right: {
            backgroundColor: isSentMessage ? '#ffff' : '#F0F0F0', // Background color based on whether it's sent by the user
            alignSelf: 'flex-end',
          },
        }}
        textStyle={{
          fontSize: 16,
        }}
      />
    );
  };
  

  const renderInputToolbar = props => (
    <InputToolbar
      {...props}
      accessoryRight={() => (
        <View style={styles.attachmentButtonContainer}>
          <IconButton icon="attachment" onPress={onAttachmentPress} />
          <IconButton icon="image" onPress={onImageAttachmentPress} />
        </View>
      )}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: user.id,
        }}
        renderInputToolbar={renderInputToolbar}
        renderMessage={renderMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  attachmentButtonContainer: {
    marginRight: 10,
  },
});

export default Request;
