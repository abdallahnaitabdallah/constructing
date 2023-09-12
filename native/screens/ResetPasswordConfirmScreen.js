import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native'; // Added ScrollView
import { useDispatch } from 'react-redux';
import { reset_password_confirm } from '../redux/actions/auth'; // Import your reset_password_confirm action
import { TextInput as PaperTextInput, Button as PaperButton } from 'react-native-paper';
import COLORS from '../constants/colors'; // Added COLORS

const ResetPasswordConfirmScreen = ({ route }) => {
  const dispatch = useDispatch();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const { uid, token } = route.params;

  const handleResetPassword = () => {
    dispatch(reset_password_confirm(uid, token, newPassword, confirmNewPassword));
    // Handle any navigation or UI updates upon successful reset
  };

  return (
    <ScrollView contentContainerStyle={styles.container}> {/* Added ScrollView */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Reset Password Confirmation</Text>
        <PaperTextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
        />
        <PaperTextInput
          label="Confirm New Password"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
          style={styles.input}
        />
        <PaperButton mode="contained" onPress={handleResetPassword} style={styles.button}>
          Confirm Reset Password
        </PaperButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Added flexGrow to expand content
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white, // Set background color
  },
  formContainer: {
    width: '80%',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.black, // Set title color
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: COLORS.primary, // Set button background color
  },
});

export default ResetPasswordConfirmScreen;
