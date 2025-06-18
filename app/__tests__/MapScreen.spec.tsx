import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { mockMapRef } from '../__mocks__/react-native-maps';
import MapScreen, { INITIAL_REGION } from '../MapScreen';

describe('MapScreen', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('renders loading state', async () => {
        process.env.SHOW_LOADING_STATE = 'true';
        render(<MapScreen />);

        expect(screen.getByLabelText('Loading Maps...')).toBeDefined();

        expect(await screen.findByTestId('mock-map-view')).toBeDefined();

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

        delete process.env.SHOW_LOADING_STATE;
    });

    it('renders marker in the map', async () => {
        render(<MapScreen />);



        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

        expect(screen.getByTestId('mock-marker')).toBeDefined();
    });

    it('changes text when selected or deselected marker', async () => {
        render(<MapScreen />);



        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

        const marker = screen.getByTestId('mock-marker');
        expect(marker).toBeDefined();

        fireEvent.press(marker);

        expect(await screen.findByText('You selected the marker!')).toBeDefined();

        expect(screen.queryByText('Feel free to move the map around!')).toBeNull();

        const map = screen.getByTestId('mock-map-view');
        fireEvent(map, 'onMarkerDeselect');

        expect(await screen.findByText('Feel free to move the map around!')).toBeDefined();

        expect(screen.queryByText('You selected the marker!')).toBeNull();
    });

    it('changes text when pressed the map', async () => {
        render(<MapScreen />);

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

        const marker = screen.getByTestId('mock-marker');
        expect(marker).toBeDefined();

        fireEvent.press(marker);

        expect(await screen.findByText('You selected the marker!')).toBeDefined();

        expect(screen.queryByText('Feel free to move the map around!')).toBeNull();

        const map = screen.getByTestId('mock-map-view');
        fireEvent.press(map);

        expect(await screen.findByText('Feel free to move the map around!')).toBeDefined();

        expect(screen.queryByText('You selected the marker!')).toBeNull();
    });

    it('shows button when position changed', async () => {
        render(<MapScreen />);

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

        const map = screen.getByTestId('mock-map-view');
        expect(map).toBeDefined();

        fireEvent(map, 'onPanDrag', {
            nativeEvent: {
                coordinate: {
                    latitude: 37.78825,
                    longitude: -122.4324,
                },
                position: {
                    x: 100,
                    y: 200,
                },
            },
        });

        expect(await screen.findByRole('button', { name: 'Back to original position' })).toBeDefined();
    });

    it('backs to original position when clicked button', async () => {
        render(<MapScreen />);

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

        const map = await screen.findByTestId('mock-map-view');
        expect(map).toBeDefined();

        fireEvent(map, 'onPanDrag', {
            nativeEvent: {
                coordinate: {
                    latitude: 37.78825,
                    longitude: -122.4324,
                },
                position: {
                    x: 100,
                    y: 200,
                },
            },
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
