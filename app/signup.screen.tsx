import { Link, useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import tw from "twrnc";
import * as SplashScreen from 'expo-splash-screen';
import authService from "../service/auth.service";

const Logo = require("../assets/images/Logo.png");
const GoogleLogo = require("../assets/images/GoogleLogo.png");

const LogoSection = () => (
  <View style={tw`flex items-center`}>
    <Image source={Logo} style={tw`w-40 h-40`} />
    <Text style={tw`text-2xl font-semibold`}>Create an Account</Text>
    <Text style={tw`text-lg font-light text-center mt-3 px-8`}>
      Join us and start tracking your child's growth and well-being today.
    </Text>
  </View>
);

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  returnKeyType: "done" | "next" | "go" | "search" | "send";
  onSubmitEditing: () => void;
}

const InputField = React.forwardRef<TextInput, InputFieldProps>(({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  onFocus,
  onBlur,
  isFocused,
  returnKeyType,
  onSubmitEditing,
}, ref) => (
  <View style={tw`w-full px-8 mt-2`}>
    <Text style={tw`px-4 my-2 font-semibold`}>{label}</Text>
    <TextInput
      style={[
        tw`border rounded-full bg-white px-4 py-3`,
        isFocused ? tw`border-2 border-sky-500` : tw`border-sky-300`,
      ]}
      placeholder={placeholder}
      placeholderTextColor={tw.color("gray-400")}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      onFocus={onFocus}
      onBlur={onBlur}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      autoCapitalize="none"
      ref={ref}
    />
  </View>
));

const SignUpButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <View style={tw`w-full px-8 mt-6`}>
    <TouchableOpacity
      style={tw`bg-sky-500 rounded-full py-3`}
      onPress={onPress}
    >
      <Text style={tw`text-white text-center font-semibold`}>Sign Up</Text>
    </TouchableOpacity>
  </View>
);

const LoginLink = () => (
  <View style={tw`w-full px-8 mt-6`}>
    <Link style={tw`flex items-center justify-center px-4 pt-1`} href="/login.screen">
      <Text style={tw`text-center font-semibold`}>
        Already have an account?{" "}
        <Text style={tw`text-sky-500 underline`}>Log In</Text>
      </Text>
    </Link>
  </View>
);

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const router = useRouter();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    return () => {
      SplashScreen.hideAsync();
    };
  }, []);

  const handleSignUp = async () => {
    setIsUsernameFocused(false);
    setIsEmailFocused(false);
    setIsPasswordFocused(false);
    setIsConfirmPasswordFocused(false);

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    const success = await authService.signup(username, email, password);
    if (success) {
      router.push("/home.screen");
    } else {
      Alert.alert("Error", "Signup failed");
    }
  };

  return (
    <View style={tw`flex flex-col items-center h-full`}>
      <LogoSection />
      <InputField
        label="Your username"
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        onFocus={() => setIsUsernameFocused(true)}
        onBlur={() => setIsUsernameFocused(false)}
        isFocused={isUsernameFocused}
        returnKeyType="next"
        onSubmitEditing={() =>
          emailInputRef.current && emailInputRef.current.focus()
        }
      />
      <InputField
        label="Your email"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => setIsEmailFocused(false)}
        isFocused={isEmailFocused}
        returnKeyType="next"
        onSubmitEditing={() =>
          passwordInputRef.current && passwordInputRef.current.focus()
        }
        ref={emailInputRef}
      />
      <InputField
        label="Your password"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        onFocus={() => setIsPasswordFocused(true)}
        onBlur={() => setIsPasswordFocused(false)}
        isFocused={isPasswordFocused}
        returnKeyType="next"
        onSubmitEditing={() =>
          confirmPasswordInputRef.current && confirmPasswordInputRef.current.focus()
        }
        ref={passwordInputRef}
      />
      <InputField
        label="Confirm your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
        secureTextEntry
        onFocus={() => setIsConfirmPasswordFocused(true)}
        onBlur={() => setIsConfirmPasswordFocused(false)}
        isFocused={isConfirmPasswordFocused}
        returnKeyType="done"
        onSubmitEditing={handleSignUp}
        ref={confirmPasswordInputRef}
      />
      <SignUpButton onPress={handleSignUp} />
      <LoginLink />
    </View>
  );
}