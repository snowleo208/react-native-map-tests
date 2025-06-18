import { render, screen } from '@testing-library/react-native';
import App from '../index';

describe('App', () => {
    it('renders correctly', () => {
        render(<App />);

        expect(screen.getByText('Welcome to my map!')).toBeDefined();

        expect(screen.getByTestId('mock-map-view')).toBeDefined();
    });
});
