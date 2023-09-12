import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import COLORS from '../../constants/colors';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/actions/auth'; // Assuming you have a logout action
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleResetPassword = () => {
    navigation.navigate('ResetPassword');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, paddingTop:50 }}>
      <View style={{ flex: 1, marginHorizontal: 22 }}>
        <Text style={styles.title}>User Profile</Text>
        
        <Text style={styles.label}>First Name:</Text>
        <Text style={styles.info}>{user.first_name}</Text>
        
        <Text style={styles.label}>Last Name:</Text>
        <Text style={styles.info}>{user.last_name}</Text>
        
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{user.email}</Text>
        
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.info}>{user.phone}</Text>
        
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.info}>{user.adress}</Text>
        <TouchableOpacity
          style={styles.resetPasswordButton}
          onPress={handleResetPassword}
        >
          <Ionicons name="lock-closed-outline" size={24} color={COLORS.black} />
          <Text style={styles.resetPasswordText}>Reset Password</Text>
        </TouchableOpacity>
        <Button
          title="Logout"
          filled
          style={styles.logoutButton}
          onPress={handleLogout}
        />
        
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: COLORS.black,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  info: {
    fontSize: 16,
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 18,
    marginBottom: 4,
  },
  resetPasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  resetPasswordText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.black,
  },
});

export default Profile;
