import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native'; // Import TextInput
import { Button as PaperButton } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { reset_password } from '../redux/actions/auth';
import COLORS from '../constants/colors';
import { useNavigation } from "@react-navigation/native";

const ResetPasswordScreen = () => {
   
  const dispatch = useDispatch();
  const navigation = useNavigation()
  const [email, setEmail] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await dispatch(reset_password(email));
      setResetRequested(true);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        {!resetRequested ? (
          <>
            <Text style={styles.title}>Forgot Password</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputBox}>
                <TextInput
                  placeholder='Enter your email'
                  placeholderTextColor={COLORS.black}
                  keyboardType='email-address'
                  style={styles.inputText}
                  onChangeText={text => setEmail(text)}
                  value={email}
                />
              </View>
            </View>

            <PaperButton
              mode="contained"
              onPress={handleResetPassword}
              loading={loading}
              style={styles.button}
            >
              Reset Password
            </PaperButton>
          </>
        ) : (
          <>
            <Text style={styles.successText}>Password reset instructions sent to your email!</Text>
            <PaperButton
              mode="contained"
              onPress={() =>navigation.navigate('Login')
            }
              style={styles.button}
            >
              Back
            </PaperButton>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  formContainer: {
    width: '80%',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.black,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 8,
  },
  inputBox: {
    width: '100%',
    height: 48,
    borderColor: COLORS.black,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  inputText: {
    flex: 1,
  },
  button: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
  },
  successText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.black,
  },
});

export default ResetPasswordScreen;
