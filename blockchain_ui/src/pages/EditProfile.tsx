import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EditProfile = () => {
    const { user, login } = useAuth(); // We might need to update user in context after edit
    const navigate = useNavigate();

    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let avatarUrl = avatar;

            // 1. If file selected, upload it first
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                const { data: imageData } = await api.post('/nfts/upload-image', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                avatarUrl = imageData.imageUrl;
            }

            const { data } = await api.put('/users/profile', {
                username,
                email,
                bio,
                avatar: avatarUrl
            });

            // Update local storage/context with new user data
            const token = localStorage.getItem('token') || '';
            login(token, data.user);

            navigate('/user/profile');
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-20 px-4 text-white flex justify-center">
            <div className="w-full max-w-lg bg-[#2B2B2B] p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-8 text-center">Edit Profile</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500 bg-gray-600 relative">
                            {file ? (
                                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                            ) : avatar ? (
                                <img
                                    src={avatar}
                                    alt="Current"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${username}&background=random`;
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                                    {username[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <label className="bg-gray-700 px-4 py-1 rounded text-sm cursor-pointer hover:bg-gray-600 transition">
                            Change Picture
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Avatar URL (Optional)</label>
                        <input
                            type="text"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            placeholder="https://example.com/avatar.png"
                            className="w-full bg-[#3B3B3B] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[#3B3B3B] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#3B3B3B] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            className="w-full bg-[#3B3B3B] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 h-32 resize-none"
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/user/profile')}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg font-bold transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold transition disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
