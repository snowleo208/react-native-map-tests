import { forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import { View } from 'react-native';
import { MapMarkerProps, MapViewProps } from 'react-native-maps';

export const mockMapRef = {
  animateToRegion: jest.fn(),
};

const MapView = forwardRef(({ children, onMapReady, ...props }: MapViewProps, ref: React.Ref<unknown>) => {
  useImperativeHandle(ref, () => mockMapRef);

  useLayoutEffect(() => {
    if (!onMapReady) {
      return;
    }

    setTimeout(() => {
      onMapReady();
    }, 100);
  }, [onMapReady]);

  return <View testID="mock-map-view"  {...props}>{children}</View>;
});

const Marker = ({ children, ...props }: MapMarkerProps) => {
  return <View testID="mock-marker" {...props}>{children}</View>;
};

const PROVIDER_GOOGLE = 'google';

module.exports = {
  __esModule: true,
  default: MapView,
  Marker,
  PROVIDER_GOOGLE,
  mockMapRef,
};