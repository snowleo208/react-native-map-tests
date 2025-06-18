import { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ActivityIndicator, Banner, Button, MD2Colors } from 'react-native-paper';
import { Amenity, isValidAmenity, Markers, State } from "../types/MapScreen.types";

export const INITIAL_REGION = { "latitude": 51.50681634424901, "latitudeDelta": 0.04419279074402027, "longitude": -0.12822736621703257, "longitudeDelta": 0.05038206547021673 }

const MapScreen = () => {
    const [currentState, setCurrentState] = useState<State>(State.LOADING);
    const [markers, setMarkers] = useState<Markers[]>([]);
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

    const onMapReady = async () => {
        try {
            setCurrentState(State.LOADING);

            const query = `
    [out:json];
    node["amenity"="cafe"](51.5068,-0.14,51.5268,-0.10);
    out;
  `;
            const response = await fetch(
                `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
            );
            const json = await response.json();

            if (!json.elements?.[0]) {
                setCurrentState(State.IDLE);
                return;
            }

            if (!isValidAmenity(json.elements[0])) {
                setCurrentState(State.IDLE);
                return;
            }

            const markers: Markers[] = json.elements.map((item: Amenity) => ({
                id: item.id.toString(),
                latitude: item.lat,
                longitude: item.lon,
                name: item.tags?.name || 'Unnamed Café',
            })).slice(0, 100);

            setMarkers(markers);

            setCurrentState(State.IDLE);

        } catch (e) {
            setCurrentState(State.ERROR);
        }
    }

    return (
        <View style={styles.container}>
            {currentState === State.ERROR ? <Banner
                visible={currentState === State.ERROR}
                actions={[
                    {
                        label: 'Close',
                        onPress: () => setCurrentState(State.IDLE),
                    },
                ]}
            >
                There was a problem when fetching cafes, please try again later.
            </Banner> : null}
            <View style={styles.statusTextWrapper}>
                <Text style={styles.statusText}>{isMarkerSelected ? "You selected the marker!" : "Feel free to move the map around!"}</Text>
            </View>
            {currentState === State.LOADING ?
                <View style={styles.loadingWrapper}>
                    <ActivityIndicator accessibilityLabel="Loading Maps..." animating={true} color={MD2Colors.deepPurple500} />
                </View>
                : null}
            <MapView
                ref={mapRef}
                style={styles.map}
                onPress={() => setIsMarkerSelected(false)}
                initialRegion={INITIAL_REGION}
                onPanDrag={onPanDrag}
                onMarkerDeselect={() => setIsMarkerSelected(false)}
                onMapReady={onMapReady}
            >
                {markers.map((marker: Markers) => (
                    <Marker
                        key={marker?.id}
                        coordinate={{
                            latitude: marker?.latitude,
                            longitude: marker?.longitude,
                        }}
                        accessibilityLabel={marker?.name}
                        title={marker?.name}
                        onPress={onMakerPressed}
                    />
                ))}
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
    loadingWrapper: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    statusTextWrapper: { padding: 8 },
    statusText: { fontSize: 16 },
    buttonWrapper: { position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', paddingBottom: 32 },
    backToPositionButton: { flex: 0 },
});

export default MapScreen;