import { Button } from "@react-navigation/elements";
import { NavigationContainer } from "@react-navigation/native";
import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

export const INITIAL_REGION = {
    latitude: 51.5074,
    longitude: -0.1278,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
}

export const MapScreen = () => {
    const [isMarkerSelected, setIsMarkerSelected] = useState(false);
    const [isInOriginalPosition, setIsInOriginalPosition] = useState(true);
    const mapRef = useRef<MapView>(null);

    const onMakerPressed = () => {
        setIsMarkerSelected(true);
    }

    const onRegionChangeComplete = (region: Region) => {
        const matchedInitialPostiion = region.latitude === INITIAL_REGION.latitude && region.longitude === INITIAL_REGION.longitude;

        setIsInOriginalPosition(matchedInitialPostiion);
    }

    const onPressBackToPosButton = () => {
        mapRef.current?.animateToRegion(
            INITIAL_REGION,
            300
        );
        setIsInOriginalPosition(true);
    }

    return (
        <NavigationContainer>
            <View style={styles.container}>
                <Text>{isMarkerSelected ? "You selected the marker!" : "Welcome to my map!"}</Text>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    onPress={() => setIsMarkerSelected(false)}
                    initialRegion={INITIAL_REGION}
                    onRegionChangeComplete={onRegionChangeComplete}
                    provider={PROVIDER_GOOGLE}
                >
                    <Marker
                        coordinate={{ latitude: 51.5074, longitude: -0.1278 }}
                        title="London"
                        description="Capital of UK"
                        onPress={onMakerPressed}
                    />
                </MapView>
                {!isInOriginalPosition ? <Button onPress={onPressBackToPosButton}>Back to original position</Button> : null}
            </View>

        </NavigationContainer>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
});