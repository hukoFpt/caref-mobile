import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, Modal, FlatList, Image } from "react-native";
import tw from "twrnc";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "@/components/Header.component";
import { MaskedTextInput } from "react-native-mask-text";
import NewImage from "@/assets/icons/NewImage.icon";
import childService from "@/service/child.service";

enum Mode {
  View = "VIEW",
  Create = "CREATE",
  Update = "UPDATE",
}

const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
];

const bloodTypeOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

const initialChildData = {
  fname: "",
  lname: "",
  birthdate: "",
  gender: "",
  picture: "",
  blood_type: "",
  allergy: "",
  notes: "",
};

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChangeText, editable }) => (
  <View>
    <Text style={tw`font-normal text-slate-500`}>{label}</Text>
    {editable ? (
      <TextInput
        style={tw`border-b py-2 text-xl`}
        value={value}
        onChangeText={onChangeText}
      />
    ) : (
      <Text style={tw`py-2 text-xl`}>{value}</Text>
    )}
  </View>
);

interface PickerFieldProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  onValueChange: (value: string) => void;
}

const PickerField: React.FC<PickerFieldProps> = ({ label, value, options, showPicker, setShowPicker, onValueChange }) => (
  <View>
    <Text style={tw`font-normal text-slate-500`}>{label}</Text>
    <TouchableOpacity
      style={tw`border-b py-2`}
      onPress={() => setShowPicker(true)}
    >
      <Text style={tw`text-xl`}>{value || ` `}</Text>
    </TouchableOpacity>
    <Modal
      visible={showPicker}
      transparent={true}
      animationType="fade"
    >
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <View style={tw`bg-white p-4 rounded-lg w-3/4`}>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={tw`p-2 border-b border-gray-200`}
                onPress={() => {
                  onValueChange(item.value);
                  setShowPicker(false);
                }}
              >
                <Text style={tw`text-xl`}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={tw`p-2 mt-4 bg-red-500 rounded-lg`}
            onPress={() => setShowPicker(false)}
          >
            <Text style={tw`text-white text-center`}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
);

const ChildInformationScreen = () => {
  const router = useRouter();
  const { mode, id } = useLocalSearchParams();
  const [currentMode, setCurrentMode] = useState<Mode>(Mode.View);
  const [childData, setChildData] = useState(initialChildData);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showBloodTypePicker, setShowBloodTypePicker] = useState(false);

  useEffect(() => {
    console.log("Mode from URL:", mode);
    if (mode) {
      setCurrentMode(mode as Mode);
    }
    if (mode === Mode.Update && id) {
      fetchChildData(id as string);
    } else if (mode === Mode.View) {
      fetchSelectedChildData();
    }
  }, [mode, id]);

  const fetchChildData = async (childId: string) => {
    try {
      const childrenString = await AsyncStorage.getItem("children");
      if (childrenString) {
        const children = JSON.parse(childrenString);
        const child = children.find((c: any) => c.id === childId);
        if (child) {
          setChildData({ ...child, birthdate: new Date(child.birthdate).toLocaleDateString("en-GB") });
        }
      }
    } catch (error) {
      console.error("Failed to fetch child data from AsyncStorage", error);
    }
  };

  const fetchSelectedChildData = async () => {
    try {
      const selectedChildString = await AsyncStorage.getItem("selectedChild");
      if (selectedChildString) {
        const selectedChild = JSON.parse(selectedChildString);
        setChildData({ ...selectedChild, birthdate: new Date(selectedChild.birthdate).toLocaleDateString("en-GB") });
      }
    } catch (error) {
      console.error("Failed to fetch selected child data from AsyncStorage", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === "fullName") {
      const [fname, ...lnameParts] = value.split(" ");
      const lname = lnameParts.join(" ");
      setChildData({ ...childData, fname, lname });
    } else {
      setChildData({ ...childData, [field]: value });
    }
  };

  const handleSave = async () => {
    try {
      const childrenString = await AsyncStorage.getItem("children");
      let children = childrenString ? JSON.parse(childrenString) : [];
      if (currentMode === Mode.Create) {
        // Add new child
        const newChild = {
          ...childData,
          id: Date.now().toString(),
          birthdate: new Date(childData.birthdate.split("/").reverse().join("-")).toISOString(),
        };
        console.log("New child data:", newChild);
        children.push(newChild);
        await childService.createChild(newChild);
      } else if (currentMode === Mode.Update) {
        // Update existing child
        children = children.map((child: any) =>
          child.id === id
            ? {
                ...child,
                ...childData,
                birthdate: new Date(childData.birthdate.split("/").reverse().join("-")).toISOString(),
              }
            : child
        );
        await childService.updateChild(id as string, {
          ...childData,
          birthdate: new Date(childData.birthdate.split("/").reverse().join("-")).toISOString(),
        });
      }
      await AsyncStorage.setItem("children", JSON.stringify(children));
      setCurrentMode(Mode.View);
      router.push("/home.screen");
    } catch (error) {
      console.error("Failed to save child data", error);
    }
  };

  const renderForm = () => (
    <View>
      <View style={tw`flex items-center justify-center m-4 `}>
        <Image source={{ uri: 'https://picsum.photos/150' }} style={tw`w-25 h-25 rounded-full`} />
        <View style={tw`absolute bottom-0 left-4/7 bg-sky-300 p-1 rounded-full`}>
          <NewImage />
        </View>
      </View>

      <Text style={tw`px-4 text-lg font-bold`}>Information</Text>

      <View style={tw`mx-4 mt-4 p-4 bg-white rounded-lg`}>
        <InputField
          label="Full name"
          value={`${childData.fname} ${childData.lname}`.trim()}
          onChangeText={(value: string) => handleInputChange("fullName", value)}
          editable={currentMode !== Mode.View}
        />
        <View style={tw`flex flex-row mt-4 w-full`}>
          <View style={tw`w-1/3 pr-2`}>
            {currentMode !== Mode.View ? (
              <PickerField
                label="Gender identity"
                value={childData.gender}
                options={genderOptions}
                showPicker={showGenderPicker}
                setShowPicker={setShowGenderPicker}
                onValueChange={(value: string) => handleInputChange("gender", value)}
              />
            ) : (
              <InputField
                label="Gender identity"
                value={childData.gender}
                onChangeText={() => {}}
                editable={false}
              />
            )}
          </View>
          <View style={tw`w-2/3 pl-4`}>
            <Text style={tw`font-normal text-slate-500`}>Date of birth</Text>
            {currentMode !== Mode.View ? (
              <MaskedTextInput
                mask="99/99/9999"
                placeholder="DD/MM/YYYY"
                value={childData.birthdate}
                onChangeText={(value) => handleInputChange("birthdate", value)}
                style={tw`border-b py-2 text-xl`}
              />
            ) : (
              <Text style={tw`py-2 text-xl`}>{childData.birthdate}</Text>
            )}
          </View>
        </View>
        <View style={tw`flex flex-row mt-4 w-full`}>
          <View style={tw`w-1/3 pr-2`}>
            {currentMode !== Mode.View ? (
              <PickerField
                label="Blood Type"
                value={childData.blood_type}
                options={bloodTypeOptions}
                showPicker={showBloodTypePicker}
                setShowPicker={setShowBloodTypePicker}
                onValueChange={(value: string) => handleInputChange("blood_type", value)}
              />
            ) : (
              <InputField
                label="Blood Type"
                value={childData.blood_type}
                onChangeText={() => {}}
                editable={false}
              />
            )}
          </View>
          <View style={tw`w-2/3 pl-4`}>
            <InputField
              label="Allergies"
              value={childData.allergy}
              onChangeText={(value: string) => handleInputChange("allergy", value)}
              editable={currentMode !== Mode.View}
            />
          </View>
        </View>
        <View style={tw`mt-4`}>
          <InputField
            label="Additional Notes"
            value={childData.notes}
            onChangeText={(value: string) => handleInputChange("notes", value)}
            editable={currentMode !== Mode.View}
          />
        </View>
        {currentMode !== Mode.View && (
          <TouchableOpacity
            style={tw`bg-sky-500 p-2 rounded mt-4`}
            onPress={handleSave}
          >
            <Text style={tw`text-white text-center text-lg`}>
              {currentMode === Mode.Create ? "Create" : "Update"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View key={`${mode}-${id}-${currentMode}`} style={tw`flex-1`}>
      <Header
        screenTitle="Child Information"
        onBackPress={() => {
          router.push("/child-selector.screen");
        }}
      />
      {renderForm()}
      {currentMode === Mode.View && (
        <TouchableOpacity
          style={tw`bg-blue-500 p-2 rounded mt-4`}
          onPress={() => {
            setCurrentMode(Mode.Update);
          }}
        >
          <Text style={tw`text-white text-center`}>Click to Edit</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChildInformationScreen;