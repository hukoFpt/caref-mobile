import { Link, useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import tw from "twrnc";
import * as SplashScreen from 'expo-splash-screen';
import authService from "@/service/auth.service";
import { saveUserData } from "@/utils/storage.util";
import { mapUserResponseToUser } from "@/models/User.model";
import { fetchAllServices } from "@/utils/fetchAllServices.util";

const Logo = require("../assets/images/Logo.png");
const GoogleLogo = require("../assets/images/GoogleLogo.png");

const LogoSection = () => (
  <View style={tw`flex items-center`}>
    <Image source={Logo} style={tw`w-40 h-40`} />
    <Text style={tw`text-2xl font-semibold mt-4`}>Welcome Back</Text>
    <Text style={tw`text-lg font-light text-center mt-3 px-8`}>
      Let's continue the journey of tracking your child's growth and well-being
      together.
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

const InputField: React.FC<InputFieldProps> = ({
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
}) => (
  <View style={tw`w-full px-8 mt-4`}>
    <Text style={tw`px-4 my-2 font-semibold`}>{label}</Text>
    <TextInput
      style={[
        tw`border rounded-full bg-white px-4 py-3`,
        isFocused ? tw`border-2 border-sky-500` : tw`border-sky-300`,
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      onFocus={onFocus}
      onBlur={onBlur}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      autoCapitalize="none"
    />
  </View>
);

const LoginButton: React.FC<{ onPress: () => void; isLoading: boolean }> = ({
  onPress,
  isLoading,
}) => (
  <View style={tw`w-full px-8 mt-6`}>
    <TouchableOpacity
      style={tw`rounded-full py-3 ${isLoading ? "bg-gray-400" : "bg-sky-500"
        }`}
      onPress={onPress}
      disabled={isLoading}
    >
      <Text style={tw`text-white text-center font-semibold`}>
        {isLoading ? "Signing In..." : "Sign In"}
      </Text>
    </TouchableOpacity>
  </View>
);

const ForgotPasswordLink = () => (
  <View style={tw`w-full px-8`}>
    <Link style={tw`px-4 pt-1`} href="/forgot-password.screen">
      <Text style={tw`text-sky-500 underline text-left font-semibold`}>
        Forgot password?
      </Text>
    </Link>
  </View>
);

const Divider = () => (
  <View style={tw`flex mt-6 w-full px-8`}>
    <Text style={tw`font-light text-center z-1`}>or sign in using</Text>
    <View style={tw`relative flex items-center top-[-2] h-[1px] bg-slate-600`}>
      <View style={tw`bg-sky-100 h-[1px] w-30`} />
    </View>
  </View>
);

const GoogleLoginButton = () => (
  <View style={tw`w-full px-8 mt-6`}>
    <TouchableOpacity
      style={tw`flex flex-row gap-3 items-center justify-center border border-sky-500 bg-white rounded-full py-3`}
      onPress={() => { }}
    >
      <Image source={GoogleLogo} style={tw`w-6 h-6`} />
      <Text style={tw`text-sky-500 text-center font-semibold`}>
        Connect with Google
      </Text>
    </TouchableOpacity>
  </View>
);

const SignUpLink = () => (
  <View style={tw`w-full px-8 mt-6`}>
    <Link style={tw`px-4 pt-1`} href="/signup.screen">
      <Text style={tw` text-center font-semibold`}>
        Don't have an account?{" "}
        <Text style={tw`text-sky-500 underline`}>Sign Up</Text>
      </Text>
    </Link>
  </View>
);

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const router = useRouter();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    return () => {
      SplashScreen.hideAsync();
    };
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await authService.login(username, password);
      if (response?.user.role === "Member") {
        const user = mapUserResponseToUser(response);
        await saveUserData(user);
        await fetchAllServices();
        router.push("/home.screen");
      }
    }
    catch (error) {
      console.error("Login failed:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
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
          passwordInputRef.current && passwordInputRef.current.focus()
        }
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
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />
      <ForgotPasswordLink />
      <LoginButton onPress={handleLogin} isLoading={isLoading} />
      <Divider />
      <GoogleLoginButton />
      <SignUpLink />
    </View>
  );
}