import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState(null); // State to track the selected message for deletion
  const user = auth().currentUser;
  const chatId = `chat_${user.uid}`; // Generate a unique chat ID based on user ID
  const flatListRef = useRef(null); // Create a ref for the FlatList

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      .onSnapshot(querySnapshot => {
        const messagesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
        setIsLoading(false);

        // Scroll to the last message whenever the message list updates
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, error => {
        console.error('Error fetching messages:', error);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) {
      return;
    }

    const messageData = {
      text: newMessage,
      createdAt: firestore.FieldValue.serverTimestamp(),
      sender: user.uid,
    };

    try {
      // Ensure parent document exists before adding messages
      await firestore().collection('chats').doc(chatId).set({}); // Create parent document if it doesn't exist
      await firestore().collection('chats').doc(chatId).collection('messages').add(messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await firestore().collection('chats').doc(chatId).collection('messages').doc(messageId).delete();
      setSelectedMessageId(null); // Reset the selected message after deletion
    } catch (error) {
      console.error('Error deleting message:', error);
      Alert.alert('Error', 'Failed to delete the message.');
    }
  };

  const renderMessageItem = ({ item }) => {
    const isUserMessage = item.sender === user.uid;
    const isSelected = selectedMessageId === item.id; // Check if the current message is selected

    return (
      <TouchableOpacity
        onPress={() => setSelectedMessageId(isSelected ? null : item.id)} // Toggle selection on press
        style={isUserMessage ? styles.userMessage : styles.adminMessage}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        {isSelected && isUserMessage && (
          <TouchableOpacity onPress={() => deleteMessage(item.id)} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef} // Attach the ref to the FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })} // Ensure the FlatList scrolls to the last message
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#b2fbf8',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  adminMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f8fbb2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'darkturquoise',
    padding: 10,
    borderRadius: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});


export default ChatScreen;
