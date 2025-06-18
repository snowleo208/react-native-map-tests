import { forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { MapMarkerProps, MapViewProps } from 'react-native-maps';

export const mockMapRef = {
  animateToRegion: jest.fn(),
};

const MapView = forwardRef(({ children, onLayout, onMapReady, ...props }: MapViewProps, ref: React.Ref<unknown>) => {
  useImperativeHandle(ref, () => mockMapRef);

  useLayoutEffect(() => {
    if (onLayout) {
      onLayout({
        nativeEvent: {
          layout: { x: 0, y: 0, width: 300, height: 400 },
        },
      } as unknown as LayoutChangeEvent);
    }

    if (onMapReady) {
      onMapReady();
    }

  }, [onLayout]);


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