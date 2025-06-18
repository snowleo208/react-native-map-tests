import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { setupServer } from 'msw/node';
import { amenityDefaultHandler } from '../__mocks__/amenityHandler';
import App from '../index';

const server = setupServer(amenityDefaultHandler);

describe('App', () => {

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    afterEach(() => {
        jest.clearAllMocks();
        server.resetHandlers();
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('renders correctly', async () => {
        render(<App />);

        expect(screen.getByText('Feel free to move the map around!')).toBeDefined();

        const map = await screen.findByTestId('mock-map-view');
        expect(map).toBeDefined();

        fireEvent(map, 'onMapReady');

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

        expect(await screen.findByTestId('mock-map-view')).toBeDefined();
    });
});
