import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Marketplace from '../pages/Marketplace';
import api from '../services/api';

// Mock the API service
vi.mock('../services/api', () => ({
    default: {
        get: vi.fn(),
    },
}));

const mockItems = [
    {
        _id: '1',
        nft: {
            name: 'Cool NFT',
            image: '/test-image.png',
            description: 'The coolest NFT',
        },
        price: 1.5,
        seller: {
            username: 'seller1',
        },
        status: 'listed',
    },
    {
        _id: '2',
        nft: {
            name: 'Another NFT',
            image: '/test-image2.png',
            description: 'Another one',
        },
        price: 2.5,
        seller: {
            username: 'seller2',
        },
        status: 'listed',
    },
];

describe('Marketplace Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        (api.get as any).mockReturnValue(new Promise(() => { })); // Never resolves
        render(
            <BrowserRouter>
                <Marketplace />
            </BrowserRouter>
        );
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it('renders market items after loading', async () => {
        (api.get as any).mockResolvedValue({ data: mockItems });
        render(
            <BrowserRouter>
                <Marketplace />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Cool NFT')).toBeInTheDocument();
            expect(screen.getByText('Another NFT')).toBeInTheDocument();
            expect(screen.getByText('1.5 ETH')).toBeInTheDocument();
            expect(screen.getByText('2.5 ETH')).toBeInTheDocument();
        });
    });

    it('handles API error gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        (api.get as any).mockRejectedValue(new Error('API Error'));
        render(
            <BrowserRouter>
                <Marketplace />
            </BrowserRouter>
        );

        await waitFor(() => {
            // It should still let us know it's not loading anymore
            // or show an error message if implemented.
            // Based on current Marketplace.tsx, it just logs error and stays loading/renders empty.
            expect(consoleSpy).toHaveBeenCalledWith("Failed to fetch market items", expect.any(Error));
        });
        consoleSpy.mockRestore();
    });
});
