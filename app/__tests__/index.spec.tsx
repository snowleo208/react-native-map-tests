import { render, screen, waitFor } from '@testing-library/react-native';
import App from '../index';

jest.mock('react-native-maps');

describe('App', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('renders correctly', async () => {
        render(<App />);

        expect(screen.getByText('Feel free to move the map around!')).toBeDefined();

        await waitFor(() => {
            expect(screen.queryByLabelText('Loading Maps...')).toBeNull();
        })

        expect(await screen.findByTestId('mock-map-view')).toBeDefined();
    });
});
