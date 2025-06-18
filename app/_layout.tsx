import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider
          settings={{
            icon: (props) => <MaterialCommunityIcons {...props} />,
          }}
        >
          <View style={{ flex: 1 }}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </View>

        </PaperProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}
