import { useParams } from 'react-router-dom';

const Artist = () => {
  const { address } = useParams();
  return (
    <div className="container mx-auto py-20 text-center text-white">
      <h1 className="text-4xl font-bold mb-4">Artist Profile</h1>
      <p className="font-mono bg-gray-800 inline-block px-4 py-2 rounded">{address}</p>
      <div className="mt-10 p-10 bg-[#3B3B3B] rounded-xl">
        <p>Artist collection coming soon...</p>
      </div>
    </div>
  );
};

export default Artist;
