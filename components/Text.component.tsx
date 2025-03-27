import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import tw from "twrnc";

interface CTextProps extends TextProps {
  style?: any; // Accept Tailwind styles
}

const CText: React.FC<CTextProps> = ({ style, children, ...props }) => {
  // Extract font weight from Tailwind styles
  const fontWeight = tw.style(style)?.fontWeight;

  // Map Tailwind font weights to corresponding font families
  const fontFamily = (() => {
    switch (fontWeight) {
      case "100":
        return "NotoSans-100Thin";
      case "200":
        return "NotoSans-200ExtraLight";
      case "300":
        return "NotoSans-300Light";
      case "400":
        return "NotoSans-400Regular";
      case "500":
        return "NotoSans-500Medium";
      case "600":
        return "NotoSans-600SemiBold";
      case "700":
        return "NotoSans-700Bold";
      case "800":
        return "NotoSans-800ExtraBold";
      case "900":
        return "NotoSans-900Black";
      default:
        return "NotoSans-400Regular"; // Default font family
    }
  })();

  return (
    <Text style={[styles.defaultText, { fontFamily }, tw.style(style)]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    color: "#000", // Default text color
  },
});

export default CText;