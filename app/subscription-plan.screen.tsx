import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import tw from "twrnc";
import { Header } from "@/components/Header.component";
import { router } from "expo-router";
import orderService from "@/service/order.service";

interface Plan {
  _id: string;
  name: string;
  description: string;
  features: string[];
  image: string;
  price: number;
  duration: number;
  plan_code: string;
}

const subscriptionColors: { [key: string]: string } = {
  "1": "bg-gray-400", // Silver
  "2": "bg-orange-400", // Gold
  "3": "bg-sky-500", // Platinum
  "4": "bg-violet-600", // Diamond
};

const plans: Plan[] = [
  {
    _id: "67b80c3cab3ae0219cebe25b",
    name: "Sprout Package 🌱",
    description: "Basic Tracking",
    features: [
      "Track height & weight over time.",
      "View detailed, beautiful growth charts.",
      "Monitor your children real-time.",
      "Receive basic growth alerts when reach limits.",
    ],
    image: "",
    price: 30000,
    duration: 6,
    plan_code: "1",
  },
  {
    _id: "67b80f1c611dc0ee536ab72f",
    name: "Bloom Package 🌸",
    description: "Enhanced Monitoring",
    features: [
      "Everything in Sprout Package.",
      "Detect growth abnormalities.",
      "Share growth data with doctors.",
      "Access expert health tips and tricks.",
    ],
    image: "",
    price: 50000,
    duration: 12,
    plan_code: "2",
  },
  {
    _id: "67b80f4b611dc0ee536ab732",
    name: "Thrive Package 🌟",
    description: "Personalized Insights",
    features: [
      "Everything in Bloom Package.",
      "Doctor feedback & recommendations.",
      "Detailed growth trend analysis.",
      "Personalized nutrition suggestions.",
    ],
    image: "",
    price: 200000,
    duration: 24,
    plan_code: "3",
  },
  {
    _id: "67b80f75611dc0ee536ab735",
    name: "Peak Package 🏆",
    description: "Advanced Care",
    features: [
      "Everything in Thrive Package.",
      "Interactive dashboards & reports.",
      "Priority access to expert consultations.",
    ],
    image: "",
    price: 900000,
    duration: 32,
    plan_code: "4",
  },
];

const paymentMethod: { image: string; title: string; number: string }[] = [
  {
    image:
      "https://static-00.iconduck.com/assets.00/visa-icon-2048x1313-o6hi8q5l.png",
    title: "Visa",
    number: "**** **** **** 1234",
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
    title: "Momo",
    number: "**** *** 012",
  },
  {
    image: "https://www.matbao.ws/wp-content/uploads/2024/08/icon-payos.png",
    title: "PayOS",
    number: "**** *** 345",
  },
];

const PlanCard = ({
  plan,
  style,
  loading,
  onGetStarted,
}: {
  plan: Plan;
  style?: any;
  loading: boolean;
  onGetStarted: (planId: string) => void;
}) => {
  const bgColor = subscriptionColors[plan.plan_code] || "#000000";

  return (
    <View style={[tw`w-3/4 h-96 m-2 rounded-lg shadow-md bg-white`, style]}>
      <View style={tw`items-center justify-center ${bgColor} rounded-t-lg p-4`}>
        <Text style={tw`text-white font-bold text-xl`}>{plan.name}</Text>
        <Text style={tw`text-white font-bold text-2xl`}>
          {plan.price.toLocaleString()} VND/{plan.duration} months
        </Text>
      </View>
      <View style={tw`flex-1 p-4`}>
        <Text style={tw`text-lg text-center font-semibold text-gray-600`}>
          {plan.description}
        </Text>
        <View style={tw`mt-2`}>
          {plan.features.map((feature, index) => (
            <Text key={index} style={tw`text-sm text-gray-600`}>
              {feature}
            </Text>
          ))}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onGetStarted(plan._id)}
        disabled={loading} // Disable the button while loading
        style={[
          tw`mx-8 mb-4 p-2 rounded-full h-10`,
          loading ? tw`bg-sky-100` : tw`${bgColor}`,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#2563eb" />
        ) : (
          <Text style={tw`text-center text-white text-lg font-semibold`}>
            Get Started
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const PaymentMethodCard = ({
  image,
  title,
  number,
  isSelected,
  onPress,
}: {
  image: string;
  title: string;
  number: string;
  isSelected: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`p-4 rounded-lg shadow-md flex-row items-center mb-2`,
        isSelected
          ? tw`bg-sky-100 border-2 border-sky-500`
          : tw`border-2 border-white bg-white`,
      ]}
    >
      <View style={tw`mr-4`}>
        <Image
          source={{ uri: image }}
          style={{
            width: 30,
            height: 30,
          }}
          resizeMode="contain"
        />
      </View>
      <View>
        <Text style={tw`font-bold text-lg ${isSelected ? "text-sky-500" : ""}`}>
          {title}
        </Text>
        <Text style={tw`text-gray-600`}>{number}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function SubscriptionPlanScreen() {
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentMethod[0].title
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNextPlan = () => {
    setCurrentPlanIndex((prevIndex) => (prevIndex + 1) % plans.length);
  };

  const handlePreviousPlan = () => {
    setCurrentPlanIndex(
      (prevIndex) => (prevIndex - 1 + plans.length) % plans.length
    );
  };

  const handleGetStarted = async (planId: string) => {
    setLoading(true);
    try {
      await orderService.createOrder({ serviceId: planId });
      setIsModalVisible(true);
    } catch (error) {
      console.error("Failed to create order", error);
      Alert.alert("Error", "Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    router.push("/purchase-history.screen"); // Navigate to purchase history
  };

  return (
    <View style={tw`flex-1`}>
      <Header
        screenTitle="Subscription Plan"
        onBackPress={() => {
          router.push("/account.screen");
        }}
      />
      <View>
        <Text style={tw`text-center font-bold text-2xl pt-4`}>
          CHOOSE YOUR PLAN
        </Text>
        <Text style={tw`text-center text-gray-600`}>
          Select the best plan that suits your needs
        </Text>
      </View>
      <View style={tw`py-56 justify-center items-center`}>
        {plans.map((plan, index) => {
          const scale = 1 - 0.05 * Math.abs(index - currentPlanIndex);
          const zIndex = plans.length - Math.abs(index - currentPlanIndex); // Higher zIndex for closer cards
          return (
            <PlanCard
              key={plan._id}
              plan={plan}
              style={{
                position: "absolute",
                opacity: index === currentPlanIndex ? 1 : 0.8,
                zIndex,
                transform: [
                  { scale },
                  { translateY: index === currentPlanIndex ? 0 : 1 },
                  {
                    translateX:
                      index === currentPlanIndex
                        ? 0
                        : (index - currentPlanIndex) * 20,
                  },
                ],
              }}
              loading={loading}
              onGetStarted={handleGetStarted}
            />
          );
        })}
        <TouchableOpacity
          style={[
            tw`w-10 h-10 flex items-center justify-center z-10 absolute left-4 p-2 rounded-full bg-sky-400`,
          ]}
          onPress={handlePreviousPlan}
        >
          <Icon name="chevron-left" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`w-10 h-10 flex items-center justify-center z-10 absolute right-4 p-2 rounded-full bg-sky-400`,
          ]}
          onPress={handleNextPlan}
        >
          <Icon name="chevron-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={tw`px-4`}>
        <Text style={tw`text-center font-bold text-lg px-4 my-2`}>
          Payment method
        </Text>
        {paymentMethod.map((method) => (
          <PaymentMethodCard
            key={method.title}
            image={method.image}
            title={method.title}
            number={method.number}
            isSelected={selectedPaymentMethod === method.title}
            onPress={() => setSelectedPaymentMethod(method.title)}
          />
        ))}
      </View>
      <View style={tw`px-4 mt-4`}>
        <Text style={tw`text-center text-gray-600 text-sm`}>
          By subscribing, you agree to our{" "}
          <Text
            style={tw`text-sky-500`}
            onPress={() =>
              Alert.alert(
                "Terms of Service",
                "By using this service, you agree to comply with all applicable laws and regulations. You also agree not to misuse the service or engage in any activity that could harm the service or its users. For more details, please contact support."
              )
            }
          >
            Terms of Service
          </Text>
          .
        </Text>
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`w-4/5 bg-white rounded-lg p-6`}>
            <Text style={tw`text-center font-bold text-lg`}>
              Subscription Successful!
            </Text>
            <Text style={tw`text-center text-gray-600 mt-2`}>
              Your subscription has been activated. You can view your purchase
              history for more details.
            </Text>
            <TouchableOpacity
              style={tw`bg-sky-500 rounded-full px-4 py-2 mt-4`}
              onPress={closeModal}
            >
              <Text style={tw`text-white text-center font-bold`}>
                Go to Purchase History
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
