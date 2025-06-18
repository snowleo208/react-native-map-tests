import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { mockMapRef } from '../__mocks__/react-native-maps';
import MapScreen, { INITIAL_REGION } from '../MapScreen';

import { setupServer } from 'msw/node';
import { amenityDefaultHandler, amenityErrorHandler } from '../__mocks__/amenityHandler';

const server = setupServer(amenityDefaultHandler);

describe('MapScreen', () => {

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    afterEach(() => {
        jest.clearAllMocks();
        server.resetHandlers();
    })

    it('renders loading state', async () => {
        process.env.SHOW_LOADING_STATE = 'true';
        render(<MapScreen />);

        expect(screen.getByLabelText('Loading Maps...')).toBeDefined();

        const map = await screen.findByTestId('mock-map-view');
        expect(map).toBeDefined();

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })
    });

    it('renders marker in the map', async () => {
        render(<MapScreen />);

        const map = await screen.findByTestId('mock-map-view');
        expect(map).toBeDefined();

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

        const markers = await screen.findAllByTestId('mock-marker');
        expect(markers).toBeDefined();
        expect(markers).toHaveLength(2);

        expect(screen.getByLabelText('Mock Café 1')).toBeDefined();

        expect(screen.queryByText('There was a problem when fetching cafes, please try again later.')).not.toBeVisible();

    });

    it('changes text when selected or deselected marker', async () => {
        render(<MapScreen />);

        const map = await screen.findByTestId('mock-map-view');
        expect(map).toBeDefined();

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

        const marker = screen.getByLabelText('Mock Café 1');
        expect(marker).toBeDefined();

        fireEvent.press(marker);

        expect(await screen.findByText('You selected the marker!')).toBeDefined();

        expect(screen.queryByText('Feel free to move the map around!')).toBeNull();

        fireEvent(map, 'onMarkerDeselect');

        expect(await screen.findByText('Feel free to move the map around!')).toBeDefined();

        expect(screen.queryByText('You selected the marker!')).toBeNull();
    });

    it('changes text when pressed the map', async () => {
        render(<MapScreen />);

        const marker = await screen.findByLabelText('Mock Café 1');
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

        const map = await screen.findByTestId('mock-map-view');
        expect(map).toBeDefined();

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

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

        const map = await screen.findByTestId('mock-map-view');
        expect(map).toBeDefined();

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

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

    it('shows error state', async () => {
        server.use(amenityErrorHandler);
        render(<MapScreen />);

        const map = await screen.findByTestId('mock-map-view');
        expect(map).toBeDefined();

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

        expect(screen.getByText('There was a problem when fetching cafes, please try again later.')).toBeVisible();

        const closeButton = screen.getByRole('button', { name: 'Close' })

        fireEvent.press(closeButton);

        await waitFor(() => {
            expect(screen.queryByText('There was a problem when fetching cafes, please try again later.')).toBeNull();
        })
    });
});
