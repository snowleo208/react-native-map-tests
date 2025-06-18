import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ActivityIndicator, Button, MD2Colors } from 'react-native-paper';

export const INITIAL_REGION = { "latitude": 51.50681634424901, "latitudeDelta": 0.04419279074402027, "longitude": -0.12822736621703257, "longitudeDelta": 0.05038206547021673 }

const MapScreen = () => {
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isMarkerSelected, setIsMarkerSelected] = useState(false);
    const [isInOriginalPosition, setIsInOriginalPosition] = useState(true);
    const mapRef = useRef<MapView>(null);

    const onMakerPressed = () => {
        setIsMarkerSelected(true);
    }

    const onPanDrag = () => {
        setIsInOriginalPosition(false);
    }

    const onPressBackToPosButton = () => {
        mapRef.current?.animateToRegion(
            INITIAL_REGION,
            300
        );
        setIsInOriginalPosition(true);
    }

    const onMapReady = () => {
        setIsMapLoaded(true);
    }

    return (
        <View style={styles.container}>
            <View style={styles.statusTextWrapper}>
                <Text style={styles.statusText}>{isMarkerSelected ? "You selected the marker!" : "Feel free to move the map around!"}</Text>
            </View>
            {!isMapLoaded ? <View>
                <ActivityIndicator accessibilityLabel="Loading Maps..." animating={true} color={MD2Colors.deepPurple500} />
            </View> : null}
            <MapView
                ref={mapRef}
                style={styles.map}
                onPress={() => setIsMarkerSelected(false)}
                initialRegion={INITIAL_REGION}
                onPanDrag={onPanDrag}
                onMarkerDeselect={() => setIsMarkerSelected(false)}
                onMapReady={onMapReady}
            >
                <Marker
                    coordinate={{ latitude: 51.50681634424901, longitude: -0.12822736621703257 }}
                    title="London"
                    description="Capital of UK"
                    onPress={onMakerPressed}
                />
            </MapView>
            {!isInOriginalPosition ?
                <View style={styles.buttonWrapper}>
                    <Button mode="contained" style={styles.backToPositionButton} onPress={onPressBackToPosButton}>Back to original position</Button>
                </View>
                : null}
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    statusTextWrapper: { padding: 8 },
    statusText: { fontSize: 16 },
    buttonWrapper: { position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', paddingBottom: 32 },
    backToPositionButton: { flex: 0 },
});

export default MapScreen;