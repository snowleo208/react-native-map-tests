import { View } from "react-native";
import { MapScreen } from "./MapScreen";

export default function App() {
    return (
        <View
            style={{ flex: 1 }}
            onStartShouldSetResponder={() => {
                console.log("Map container still receiving touch!");
                return true;
            }}
        >
            <MapScreen />
        </View>

    );
}