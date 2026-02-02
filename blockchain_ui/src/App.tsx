import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ConnectWallet from './pages/ConnectWallet';
import Rankings from './pages/Rankings';
import Marketplace from './pages/Marketplace';
import NFTDetailPage from './pages/NFTDetailPage';
import Artist from './pages/Artist';
import NotFound from './pages/NotFound';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import CreateNFT from './pages/CreateNFT';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground flex flex-col dark">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/connect-wallet" element={<ConnectWallet />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/nft-detail/:id" element={<NFTDetailPage />} />
            <Route path="/artist/:address" element={<Artist />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/edit-profile" element={<EditProfile />} />
            <Route path="/create-nft" element={<CreateNFT />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
