import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View onStartShouldSetResponder={() => {
        console.log("Root container still receives touch!!!");
        return true;
      }}
        style={{ flex: 1, pointerEvents: "box-none" }}>
        <Stack />
      </View>
    </GestureHandlerRootView>
  );
}
