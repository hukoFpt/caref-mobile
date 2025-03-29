import { medicalService } from "@/service/medical.service";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import ArrowNext from "@/assets/icons/ArrowNext.icon";
import { MedicalRequest } from "@/models/Medical.model";

const Ellipse3 = require("../assets/images/Ellipse-3.png");
const Ellipse4 = require("../assets/images/Ellipse-4.png");
const FCare = require("../assets/images/Fcare.png");

export default function SupportScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [recordId, setRecordId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message
  const [requestHistory, setRequestHistory] = useState<MedicalRequest[]>([]); // State for request history

  useEffect(() => {
    const fetchRecordId = async () => {
      try {
        const selectedChildString = await AsyncStorage.getItem("selectedChild");
        const selectedChild = selectedChildString
          ? JSON.parse(selectedChildString)
          : null;

        if (!selectedChild) {
          console.warn("No selected child found.");
          return;
        }

        const recordsString = await AsyncStorage.getItem("records");
        const records = recordsString ? JSON.parse(recordsString) : [];

        const matchingRecord = records.find(
          (record: any) => record.ChildId === selectedChild._id
        );

        if (matchingRecord) {
          setRecordId(matchingRecord._id); // Set the record ID
        } else {
          console.warn("No matching record found for the selected child.");
        }
      } catch (error) {
        console.error("Failed to fetch record ID:", error);
      }
    };

    const fetchRequestHistory = async () => {
      try {
        if (!recordId) {
          console.warn("No record ID available.");
          return;
        }
        const response = await medicalService.getRequest(recordId);
        setRequestHistory(response);
      } catch (error) {
        console.error("Failed to fetch request history:", error);
      }
    };

    fetchRecordId();
    fetchRequestHistory();
  }, []);

  const handleCreateSupportRequest = () => {
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      if (!recordId) {
        console.warn("No record ID available.");
        return;
      }

      const payload = {
        Reason: reason,
        Notes: notes,
      };

      const response = await medicalService.createRequest(recordId, payload);
      console.log("Medical request created successfully:", response);

      setModalVisible(false);
      setReason("");
      setNotes("");
      setErrorMessage(null); // Clear error message on success
    } catch (error: any) {
      console.error("Failed to create medical request:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error); // Set the error message from the API response
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setReason("");
    setNotes("");
    setErrorMessage(null);
  };

  const MedicalCard = ({ request }: { request: MedicalRequest }) => {
    return (
      <View style={tw`border border-gray-300 rounded-lg p-3 mb-2`}>
        <Text style={tw`text-base font-semibold`}>
          Status: {request.Status}
        </Text>
        <Text style={tw`text-sm`}>Reason: {request.Reason}</Text>
        <Text style={tw`text-sm`}>Notes: {request.Notes}</Text>
        <Text style={tw`text-sm`}>
          Created Date: {new Date(request.CreatedDate).toLocaleString()}
        </Text>
      </View>
    );
  };

  interface AccordionProps {
    title: string;
    content: string;
  }

  const faqData = [
    {
      title: "How can I reset my password?",
      content:
        "To reset your password, go to the settings page and click on 'Reset Password'.",
    },
    {
      title: "How can I contact support?",
      content:
        "You can contact support by clicking on the 'Contact Us' button on the home screen.",
    },
    {
      title: "How can I update my profile?",
      content:
        "To update your profile, go to the profile page and click on 'Edit Profile'.",
    },
  ];

  const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
      setIsOpen(!isOpen);
    };

    return (
      <View style={tw`border-b border-gray-300`}>
        <TouchableOpacity
          style={tw`flex-row justify-between items-center py-3`}
          onPress={toggleAccordion}
        >
          <Text style={tw`text-lg font-semibold`}>{title}</Text>
          <Icon
            name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
        {isOpen && (
          <View style={tw`px-4 pb-3`}>
            <Text style={tw`text-gray-600`}>{content}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      <View style={tw`flex-col justify-between px-4 my-2`}>
        <Image
          source={Ellipse3}
          style={tw`absolute w-[400px] h-[400px] top-[-32px] left-0`}
        />
        <Image
          source={Ellipse4}
          style={tw`absolute w-[400px] h-[400px] right-0 top-[-4]`}
        />
        <Image
          source={FCare}
          style={tw`absolute w-[120px] h-[120px] top-0 right-4`}
        />
        <Text style={tw`text-2xl w-56 text-wrap text-blue-600 pt-8`}>
          Fcare+ always ready to support you!
        </Text>
      </View>
      <View style={tw`bg-white rounded-xl p-4`}>
        <TouchableOpacity
          style={tw`flex flex-row items-center justify-center bg-blue-600 rounded-full py-3 px-4`}
          onPress={handleCreateSupportRequest}
        >
          <Icon name="support-agent" size={24} color="white" style={tw`mr-2`} />
          <Text style={tw`text-white text-center text-lg font-bold`}>
            Create Support Request
          </Text>
        </TouchableOpacity>
        <View style={tw`h-[0.5px] bg-neutral-600 my-6`}></View>
        <TouchableOpacity
          style={tw`flex flex-row items-center gap-2`}
          onPress={() => {
            router.push("/medical-history.screen");
          }}
        >
          <Text style={tw`text-center text-lg font-bold`}>Request History</Text>
          <ArrowNext />
        </TouchableOpacity>
        <View style={tw`mt-4`}>
          {requestHistory.length > 0 ? (
            requestHistory
              .slice(0, 3)
              .map((request, index) => (
                <MedicalCard key={index} request={request} />
              ))
          ) : (
            <Text style={tw`text-gray-500 text-center`}>
              No request history available.
            </Text>
          )}
        </View>
      </View>

      <View style={tw`bg-white rounded-xl p-4 mt-8`}>
        <Text style={tw`text-lg font-bold mb-4`}>
          Frequently Asked Questions
        </Text>
        {faqData.map((faq, index) => (
          <Accordion key={index} title={faq.title} content={faq.content} />
        ))}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white rounded-lg p-6 w-11/12`}>
            <Text style={tw`text-xl font-bold text-center mb-4`}>
              Send Medical Request
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 mb-4`}
              placeholder="Reason"
              value={reason}
              onChangeText={setReason}
            />
            <TextInput
              style={tw`border border-gray-300 rounded-lg p-3 mb-4 h-36`}
              placeholder="Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
            />
            {errorMessage && (
              <Text style={tw`text-red-500 text-sm mb-4`}>{errorMessage}</Text>
            )}
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`bg-blue-600 rounded-lg py-2 px-4`}
                onPress={handleSubmit}
              >
                <Text style={tw`text-white text-center text-lg`}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`bg-gray-400 rounded-lg py-2 px-4`}
                onPress={handleCancel}
              >
                <Text style={tw`text-white text-center text-lg`}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
