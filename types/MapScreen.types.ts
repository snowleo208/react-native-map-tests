export enum State {
    IDLE = 'idle',
    LOADING = 'loading',
    ERROR = 'error'
}

export type Markers = {
    id: string;
    latitude: number;
    longitude: number;
    name: string;
}

export type Amenity = {
    "type": string,
    "id": number,
    "lat": number,
    "lon": number,
    "tags"?: {
        "addr:city"?: string,
        "addr:housenumber"?: string,
        "addr:postcode"?: string,
        "addr:street"?: string,
        "amenity"?: string,
        "bar"?: string,
        "cuisine"?: string,
        "email"?: string,
        "food"?: string,
        "name"?: string,
        "opening_hours"?: string,
        "outdoor_seating"?: string,
        "phone"?: string,
        "toilets"?: string,
        "website"?: string
    }
}

export const isValidAmenity = (value: Amenity | undefined | null): value is Amenity => {
    if (!value?.lat && !value?.lon) {
        return false;
    }

    return true;
}