import { View, Text, Pressable, Image, Dimensions } from 'react-native'
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constants/colors';
import Button from '../components/Button';

const Welcome = ({ navigation }) => {
  const { width, height } = Dimensions.get('window');

  return (
    <LinearGradient
      style={{
        flex: 1
      }}
      colors={[COLORS.secondary, COLORS.primary]}
    >
      <View style={{ flex: 1 }}>
        <View style={{
          paddingHorizontal: 0.07 * width, 
          position: "absolute",
          top: 0.6 * height, 
          width: "100%"
        }}>
          <Text style={{
            fontSize: 0.08 * width, 
            fontWeight: 'bold',
            color: COLORS.white,
          }}>Let's Get</Text>
          <Text style={{
            fontSize: 0.075 * width, 
            fontWeight: 'bold',
            color: COLORS.white,
          }}>Started</Text>

          <View style={{ marginVertical: 0.022 * height }}>
            <Text style={{
              fontSize: 0.025 * width, 
              color: COLORS.white,
              marginVertical: 4,
            }}></Text>
            <Text style={{
              fontSize: 0.025 * width, 
              color: COLORS.white,
            }}></Text>
          </View>

          <Button
            title="Join Now"
            onPress={() => navigation.navigate("SignUp")}
            style={{
              marginTop: 0.022 * height,
              width: "100%"
            }}
          />

          <View style={{
            flexDirection: "row",
            marginTop: 0.016 * height,
            justifyContent: "center"
          }}>
            <Text style={{
              fontSize: 0.04 * width, 
              color: COLORS.white
            }}>Already have an account ?</Text>
            <Pressable
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={{
                fontSize: 0.04 * width,
                color: COLORS.white,
                fontWeight: "bold",
                marginLeft: 0.01 * width,
              }}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  )
}

export default Welcome
