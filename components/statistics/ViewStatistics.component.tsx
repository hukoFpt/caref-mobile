import { View, Text } from "react-native";
import Graph from "../graph/Graph.component";
import tw from "twrnc";

const ViewStatistics = () => (
  <View style={tw`p-4`}>
    <Text style={tw`font-bold text-lg`}>Stats Index</Text>
    {/* <Graph primaryData={[]} /> */}
  </View>
);

export default ViewStatistics;