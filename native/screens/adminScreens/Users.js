import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { baseUrl } from '../../constants/url';

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchNonAdminUsers();
  }, []);

  const fetchNonAdminUsers = async () => {
    try {
      const token = await AsyncStorage.getItem('access');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`,
          'Accept': 'application/json'
        }
      };

      const response = await axios.get(`${baseUrl}/api/non-admin-user/`, config);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching non-admin users:', error);
    }
  };

  const handleUserClick = (userId) => {
    // Navigate to the chat screen with the user's ID as a parameter
    navigation.navigate('Chat', { userId: userId.toString() });
  };

  return (
    <View style={styles.container}>
      {users.map((item) => (
        <TouchableOpacity
          key={item.user_id}
          style={styles.userContainer}
          onPress={() => handleUserClick(item.user_id)}
        >
          <View style={styles.userCard}>
            <Text style={styles.userName}>
              {item.first_name} {item.last_name}
            </Text>
            {item.num_unreplied_messages > 0 && (
              <Text style={styles.unrepliedText}>- Has unreplied messages</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop:60,
  },
  userContainer: {
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  userName: {
    fontSize: 18,
  },
  unrepliedText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
});

export default Users;
