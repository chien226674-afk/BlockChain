import { useState, useEffect } from 'react';
import type { MarketItem } from '../types';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Marketplace = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/market/items');
      // Filter out items where NFT data is missing or corrupted
      const validItems = data.filter((item: any) => item.nft && item.nft.tokenId);
      setItems(validItems);
    } catch (error) {
      console.error("Failed to fetch market items", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-white">Loading...</div>;

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center sm:text-left text-white">Marketplace</h1>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center">No items listed for sale.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.itemId} className="bg-[#2B2B2B] border border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition text-white">
              <img
                src={item.nft?.image}
                alt={item.nft?.name}
                className="w-full h-64 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=NFT+Image'; }}
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{item.nft?.name}</h3>
                <p className="text-sm text-gray-400 truncate mb-4">{item.nft?.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-purple-400">{item.price} GO</span>
                  <div className="flex gap-2">
                    <Link
                      to={`/nft-detail/${item.nft?.tokenId}`}
                      className="bg-gray-700 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-gray-600 transition"
                    >
                      View
                    </Link>
                    {user?.walletAddress?.toLowerCase() === item.seller?.walletAddress?.toLowerCase() ? (
                      <div className="bg-purple-900/50 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-purple-700/50">
                        Yours
                      </div>
                    ) : (
                      <Link
                        to={`/nft-detail/${item.nft?.tokenId}`}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-blue-700 transition"
                      >
                        Buy
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
