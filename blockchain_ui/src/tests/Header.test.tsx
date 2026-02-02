import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/layout/Header';

// Mock the AuthContext and WalletContext hooks
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: null,
        logout: vi.fn(),
    }),
}));

vi.mock('../context/WalletContext', () => ({
    useWallet: () => ({
        account: null,
        connect: vi.fn(),
    }),
}));

describe('Header Component', () => {
    it('renders logo and navigation links', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        // Should find multiple 'Marketplace' texts (logo + links)
        const marketplaceElements = screen.getAllByText(/Marketplace/i);
        expect(marketplaceElements.length).toBeGreaterThan(0);

        // Check for Rankings link
        expect(screen.getByText(/Rankings/i)).toBeInTheDocument();
    });

    it('shows login button when not authenticated', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        // Look specifically for the login link
        const loginLink = screen.getByRole('link', { name: /login/i });
        expect(loginLink).toBeInTheDocument();
    });
});
