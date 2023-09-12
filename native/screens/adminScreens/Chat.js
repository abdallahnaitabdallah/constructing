import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { View, Platform, Text, TouchableOpacity, Image } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Composer } from 'react-native-gifted-chat';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import COLORS from '../../constants/colors';
import { baseUrl } from '../../constants/url';
import { useSelector } from 'react-redux';

const Chat = ((params) => {
  const user = useSelector((state) => state.auth.user);
  const access = useSelector((state) => state.auth.access);
  const customId = params.userId;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userId, setUserId] = useState(user.id);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [lastMessageId, setLastMessageId] = useState(null);
  const [parentMessage, setParentMessage] = useState(lastMessageId);


  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${access}`,
      Accept: 'application/json',
    },
  };

  useEffect(() => {
    // Fetch initial messages when the component mounts
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/chat-messages/`, config);
      const chatMessages = response.data;

      const filteredMessages = chatMessages
        .filter((message) => message.sender === customId)
        .map((message) => ({
          _id: message.id.toString(),
          text: message.content,
          createdAt: new Date(message.timestamp),
          user: {
            _id: message.sender.toString(),
            name: message.sender_name, // Replace with the appropriate field from your Django model
          },
          // If you have attachments, add them here
          // attachment: message.attachment,
        }));

      // Find the last message and set its ID as the parent message
      if (filteredMessages.length > 0) {
        setLastMessageId(filteredMessages[filteredMessages.length - 1]._id);
      }

      setMessages(filteredMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const onSend = async () => {
    if (!inputText && !selectedAttachment) return; // Don't send empty messages

    try {
      const newMessage = {
        sender: userId,
        content: inputText,
        parent_message: parentMessage, 
        attachment: selectedAttachment,
      };

      // Send the new message to the Django server
      await axios.post(`${baseUrl}/api/chat-messages/`, newMessage, config);

      // Update the local messages state with the new message
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessage)
      );

      // Clear the input field and selected attachment after sending the message
      setInputText('');
      setSelectedAttachment(null);

      // Scroll to the bottom to show the new message
      giftedChatRef.current.scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDocumentPick = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync();
      if (document.type === 'success') {
        setSelectedAttachment(document.uri);
      }
    } catch (error) {
      console.error('Error picking a document:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const image = await ImagePicker.launchImageLibraryAsync();
      if (!image.canceled) {
        setSelectedAttachment(image.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: userId.toString(),
        }}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor:
                  props.user._id === userId.toString() ? COLORS.primary : 'lightgray',
              },
              right: {
                backgroundColor: COLORS.secondary,
              },
            }}
          />
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: 'white',
              borderTopWidth: 1,
              borderTopColor: 'lightgray',
              paddingBottom: Platform.OS === 'android' ? 0 : 10,
            }}
          />
        )}
        renderComposer={(props) => (
          <View style={{ flexDirection: 'row' }}>
            <Composer
              {...props}
              textInputStyle={{
                borderWidth: 1,
                borderColor: 'lightgray',
                borderRadius: 20,
                paddingLeft: 10,
                paddingRight: 10,
              }}
              textInputProps={{
                onChangeText: (text) => setInputText(text),
                value: inputText,
                placeholder: 'Type a message...',
              }}
            />
            <TouchableOpacity
              onPress={() => setIsAttachmentOpen(!isAttachmentOpen)}
              style={{ marginLeft: 10, alignSelf: 'center' }}
            >
              {isAttachmentOpen ? (
                <FontAwesomeIcon name="times" size={24} color={COLORS.primary} />
              ) : (
                <FontAwesomeIcon name="paperclip" size={24} color={COLORS.primary} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSend}
              style={{ marginLeft: 10, alignSelf: 'center' }}
            >
              <FontAwesomeIcon name="send" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}
        renderActions={(props) => {
          if (isAttachmentOpen) {
            return (
              <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                <TouchableOpacity
                  onPress={handleDocumentPick}
                  style={{ marginRight: 20 }}
                >
                  <FontAwesomeIcon name="file" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleImagePick}>
                  <FontAwesomeIcon name="camera" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            );
          }
          return null;
        }}
        onLongPress={(context, message) => {
          // Set the parent message when the user long-presses a message
          setParentMessage(message._id);
        }}
        scrollToBottom
        bottomOffset={50}
      />
    </View>
  );
});

export default Chat;
