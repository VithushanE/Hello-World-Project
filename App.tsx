import React, { useState, useEffect } from 'react';

// Define the structure of a user object
interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  interests: string[];
}

// Mock data for the user list
const users: User[] = [
  {
    id: 1,
    name: 'Aria Montgomery',
    email: 'aria.m@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    interests: ['Photography', 'Reading', 'Fashion'],
  },
  {
    id: 2,
    name: 'Benjamin Carter',
    email: 'ben.c@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    interests: ['Hiking', 'Cooking', 'Jazz Music'],
  },
  {
    id: 3,
    name: 'Chloe Davis',
    email: 'chloe.d@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    interests: ['Yoga', 'Gardening', 'Painting'],
  },
  {
    id: 4,
    name: 'Daniel Evans',
    email: 'daniel.e@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
    interests: ['Gaming', 'Coding', 'Sci-Fi Movies'],
  },
  {
    id: 5,
    name: 'Eva Green',
    email: 'eva.g@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
    interests: ['Traveling', 'Volunteering', 'Documentaries'],
  },
  {
    id: 6,
    name: 'Finn Harris',
    email: 'finn.h@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704c',
    interests: ['Surfing', 'Skateboarding', 'Indie Rock'],
  },
];

// A component to render a single user's card
const UserCard: React.FC<{ user: User; onCardClick: (user: User) => void }> = ({ user, onCardClick }) => {
  return (
    <div 
      onClick={() => onCardClick(user)}
      className="bg-gray-800 rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 ease-in-out group cursor-pointer"
      role="button"
      aria-label={`View details for ${user.name}`}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onCardClick(user)}
    >
      <div className="relative inline-block">
        <img
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-700 group-hover:border-purple-500 transition-colors duration-300"
          src={user.imageUrl}
          alt={`Profile of ${user.name}`}
        />
         <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
      <p className="text-gray-400">{user.email}</p>
    </div>
  );
};

// A component for the user details modal
const UserModal: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-modal-title"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <img
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-500"
          src={user.imageUrl}
          alt={`Profile of ${user.name}`}
        />
        <h2 id="user-modal-title" className="text-3xl font-bold text-white mb-1">{user.name}</h2>
        <p className="text-gray-400 mb-6">{user.email}</p>

        <h3 className="text-lg font-semibold text-white border-t border-gray-700 pt-4 mb-3">Interests</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {user.interests.map((interest, index) => (
            <span key={index} className="bg-gray-700 text-purple-300 text-sm font-medium px-3 py-1 rounded-full">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};


// The main App component
const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCardClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                User Directory
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              A beautifully designed directory of our amazing users.
            </p>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map(user => (
            <UserCard key={user.id} user={user} onCardClick={handleCardClick} />
          ))}
        </div>
      </div>
      {selectedUser && <UserModal user={selectedUser} onClose={handleCloseModal} />}
    </main>
  );
};

export default App;
