import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import tw from "twrnc";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Header } from "@/components/Header.component";
import { router } from "expo-router";
import { Order } from "@/models/Order.model";
import orderService from "@/service/order.service";

const ItemsCard = ({ order }: { order: Order }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={tw`bg-white rounded-lg p-4 mb-2`}>
      <TouchableOpacity style={tw``} onPress={() => setIsOpen(!isOpen)}>
        <View style={tw`flex flex-row justify-between`}>
          <Text style={tw`text-base font-semibold`}>
            Invoice for {order.serviceName}
          </Text>
          <Icon
            name={isOpen ? "expand-less" : "expand-more"}
            size={24}
            color="gray"
          />
        </View>
        <Text style={tw`text-neutral-600 pt-1 font-light`}>
          Payment code: {order.orderCode}
        </Text>
      </TouchableOpacity>
      {isOpen ? (
        <View style={tw`mt-2`}>
          <View style={tw`w-full h-[0.5px] bg-neutral-600 my-1`}></View>
          <Text style={tw`text-gray-700`}>
            Order Code:{" "}
            <Text style={tw`text-neutral-800 text-base font-semibold`}>
              {order._id.slice(0, 8).toUpperCase()}
            </Text>
          </Text>
          <Text style={tw`text-gray-700`}>
            Amount:{" "}
            <Text style={tw`text-neutral-800 text-base font-semibold`}>
              {order.amount.toLocaleString()} VND
            </Text>
          </Text>
          <Text>
            Payment time:{" "}
            <Text style={tw`text-neutral-800 text-base font-semibold`}>
              {new Date(order.createdAt).toLocaleString()}
            </Text>
          </Text>
          <Text style={tw`text-gray-700`}>
            Payment type:{" "}
            <Text style={tw`text-neutral-800 text-base font-semibold`}>
              Online payment
            </Text>
          </Text>
          <Text style={tw`text-gray-700`}>
            Payment method:{" "}
            <Text style={tw`text-neutral-800 text-base font-semibold`}>
              PayOS
            </Text>
          </Text>
        </View>
      ) : (
        <Text style={tw`text-neutral-600 pt-2`}>
          Amount:{" "}
          <Text style={tw`text-neutral-800 text-base font-semibold`}>
            {order.amount.toLocaleString()} VND
          </Text>
        </Text>
      )}
    </View>
  );
};

export default function PurchaseHistoryScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await orderService.getMemberOrder();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchOrders();
  }, []);

  return (
    <View style={tw`flex-1`}>
      <Header
        screenTitle="Purchase Management"
        onBackPress={() => {
          router.push("/account.screen");
        }}
      />
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#1E90FF" />
          <Text style={tw`text-gray-500 mt-4`}>Loading purchase history...</Text>
        </View>
      ) : orders.length > 0 ? (
        <View style={tw`p-4`}>
          {orders.map((order) => (
            <ItemsCard key={order._id} order={order} />
          ))}
        </View>
      ) : (
        <View style={tw`justify-center items-center mt-8`}>
          <Image
            source={require("@/assets/images/empty.png")} // Replace with your image path
            style={tw`w-40 h-40 rounded-full bg-white`}
            resizeMode="contain"
          />
          <Text style={tw`text-lg font-bold text-gray-700 mt-4`}>
            No purchase history available.
          </Text>
          <Text style={tw`text-center text-gray-500 mt-2`}>
            You have no payment history yet.
          </Text>
        </View>
      )}
    </View>
  );
}