import { fireEvent, render, screen } from '@testing-library/react-native';
import { INITIAL_REGION, MapScreen } from '../MapScreen';
import { mockMapRef } from '../__mocks__/react-native-maps';

describe('MapScreen', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('renders correctly with the map', () => {
        render(<MapScreen />);

        expect(screen.getByText('Welcome to my map!')).toBeDefined();

        expect(screen.getByTestId('mock-map-view')).toBeDefined();
    });


    it('renders marker', () => {
        render(<MapScreen />);

        expect(screen.getByTestId('mock-marker')).toBeDefined();
    });


    it('changes text when selected or deselected marker', async () => {
        render(<MapScreen />);

        const marker = screen.getByTestId('mock-marker');
        expect(marker).toBeDefined();

        fireEvent.press(marker);

        expect(await screen.findByText('You selected the marker!')).toBeDefined();

        expect(screen.queryByText('Welcome to my map!')).toBeNull();

        const map = screen.getByTestId('mock-map-view');
        fireEvent.press(map);

        expect(await screen.findByText('Welcome to my map!')).toBeDefined();

        expect(screen.queryByText('You selected the marker!')).toBeNull();
    });

    it('shows button when position changed', async () => {
        render(<MapScreen />);

        const map = screen.getByTestId('mock-map-view');
        expect(map).toBeDefined();

        fireEvent(map, 'onRegionChangeComplete', {
            latitude: 51.5,
            longitude: -0.1,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        });


        expect(await screen.findByRole('button', { name: 'Back to original position' })).toBeDefined();
    });

    it('backs to original position when clicked button', async () => {
        render(<MapScreen />);

        const map = screen.getByTestId('mock-map-view');
        expect(map).toBeDefined();

        fireEvent(map, 'onRegionChangeComplete', {
            latitude: 51.5,
            longitude: -0.1,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        });

        const changePositionButton = await screen.findByRole('button', { name: 'Back to original position' });

        expect(changePositionButton).toBeDefined();

        fireEvent.press(changePositionButton);

        expect(mockMapRef.animateToRegion).toHaveBeenLastCalledWith(
            INITIAL_REGION,
            300
        );

        expect(mockMapRef.animateToRegion).toHaveBeenCalledTimes(1);

        expect(screen.queryByRole('button', { name: 'Back to original position' })).toBeNull();
    });
});
