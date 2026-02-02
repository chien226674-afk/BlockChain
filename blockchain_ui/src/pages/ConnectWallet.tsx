import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
// import { Button } from '@/components/ui/button'; 

const ConnectWallet = () => {
  const { connectWallet, account, signer } = useWallet();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && account) {
      // navigate('/'); // Redirect if already fully authenticated
    }
  }, [isAuthenticated, account, navigate]);

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleVerify = async () => {
    if (!account || !signer) return;
    try {
      // 1. Get Nonce & Message
      let nonceData;
      if (isAuthenticated) {
        // Use Link flow (get nonce for current logged in user)
        const response = await api.get('/auth/nonce/me');
        nonceData = response.data;
      } else {
        // Use Login flow (get nonce for specific wallet)
        const response = await api.get(`/auth/nonce/${account}`);
        nonceData = response.data;
      }

      const { nonce, message: backendMessage } = nonceData;
      // Fallback if backendMessage is not provided
      const message = backendMessage || `Please sign this message to verify your identity. Nonce: ${nonce}`;

      // 2. Sign Message
      const signature = await signer.signMessage(message);

      // 3. Verify / Link on Backend
      if (isAuthenticated) {
        // Link Flow
        const { data } = await api.post('/auth/link-wallet', { walletAddress: account, signature });
        login(localStorage.getItem('token') || '', data.user);
        alert("Wallet linked successfully to your account!");
      } else {
        // Login Flow
        const { data } = await api.post('/auth/verify', { walletAddress: account, signature });
        login(data.token, data.user);
      }

      navigate('/user/profile');
    } catch (error: any) {
      console.error("Verification failed", error);
      alert(error.response?.data?.error || "Verification failed. Please check your wallet.");
    }
  };

  return (
    <div className="container mx-auto max-w-md py-20 text-center">
      <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
      <p className="text-gray-500 mb-8">Choose a wallet to connect to our marketplace.</p>

      {!account ? (
        <button
          onClick={handleConnect}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Connect MetaMask
        </button>
      ) : (
        <div className="space-y-4">
          <p className="font-mono bg-gray-100 p-2 rounded text-gray-800 break-all">{account}</p>
          <button
            onClick={handleVerify}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            {isAuthenticated ? 'Verify & Link Wallet' : 'Verify Signature & Login'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
