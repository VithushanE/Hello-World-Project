import React, { useState, useEffect, useCallback } from 'react';

// Define the structure of a user object
interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  interests: string[];
}

const SPREADSHEET_ID = '1Pu8off5ibGfMAJaXq6Y_bSQSytgyVc00_JrVPIOnEkQ';
const SHEET_NAME = 'Sheet1';
const API_KEY = process.env.API_KEY; 
const SHEET_RANGE = 'A2:E';

const SHEET_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!${SHEET_RANGE}?key=${API_KEY}`;


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

// A component for the Add User modal
const AddUserModal: React.FC<{ onClose: () => void; onSave: (newUser: Omit<User, 'id' | 'imageUrl'>) => void; }> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Name and Email are required.');
      return;
    }
    onSave({ name, email, interests: interests.split(',').map(i => i.trim()).filter(Boolean) });
  };
  
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
      aria-labelledby="add-user-modal-title"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="add-user-modal-title" className="text-3xl font-bold text-white mb-6 text-center">Add New User</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-300 mb-1">Interests (comma-separated)</label>
            <input type="text" id="interests" value={interests} onChange={(e) => setInterests(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-semibold transition-opacity">Save User</button>
        </div>
      </form>
    </div>
  );
};


// The main App component
const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!API_KEY) {
          throw new Error("API_KEY is not set. Please configure it in your environment.");
        }
        const response = await fetch(SHEET_API_URL);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message || `An error occurred: ${response.statusText}`);
        }
        const data = await response.json();
        const parsedUsers: User[] = (data.values || []).map((row: string[]): User => ({
          id: parseInt(row[0], 10),
          name: row[1] || '',
          email: row[2] || '',
          imageUrl: row[3] || `https://i.pravatar.cc/150?u=${row[0]}`,
          interests: row[4] ? row[4].split(',').map(interest => interest.trim()) : [],
        }));
        setUsers(parsedUsers);
      } catch (err) {
        if (err instanceof Error) {
            setError(`Failed to load users. Please ensure the Google Sheet is public and the API key is correct. Details: ${err.message}`);
        } else {
            setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  
  const handleSaveUser = useCallback((newUserData: Omit<User, 'id' | 'imageUrl'>) => {
    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...newUserData,
      imageUrl: `https://i.pravatar.cc/150?u=${Date.now()}`
    };

    // Optimistic UI update
    setUsers(prevUsers => [...prevUsers, newUser]);
    setAddUserModalOpen(false);

    // Persist to Google Sheet (requires a secure backend)
    saveUserToSheet(newUser);
  }, [users]);
  
  /**
   * NOTE ON SAVING DATA:
   * Direct client-side API calls to write to Google Sheets are insecure as they expose API keys or OAuth credentials.
   * The recommended approach is to create a simple backend service (e.g., using Google Apps Script, Cloud Functions, etc.).
   * This function is a placeholder for a call to your secure backend endpoint.
   */
  const saveUserToSheet = (user: User) => {
    console.log("Saving user (placeholder). In a real app, this would be a fetch call to a secure backend.", user);
    
    // Example of what the backend call might look like:
    /*
    const backendUrl = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';
    fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    .then(response => response.json())
    .then(data => console.log('Save success:', data))
    .catch(error => {
      console.error('Save failed:', error);
      // Optional: handle error, e.g., remove the optimistically added user from the state
    });
    */
  };
  
  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-400 text-lg">Loading users from Google Sheet...</p>;
    }
    if (error) {
      return <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>;
    }
    if (users.length === 0) {
        return <p className="text-center text-gray-400 text-lg">No users found in the sheet.</p>;
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map(user => (
          <UserCard key={user.id} user={user} onCardClick={setSelectedUser} />
        ))}
      </div>
    );
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
              A beautifully designed directory of our amazing users, powered by Google Sheets.
            </p>
            <div className="mt-8">
                <button 
                  onClick={() => setAddUserModalOpen(true)}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-semibold transition-opacity shadow-lg transform hover:scale-105"
                  aria-label="Add new user"
                >
                  Add New User
                </button>
            </div>
        </header>
        {renderContent()}
      </div>
      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      {isAddUserModalOpen && <AddUserModal onClose={() => setAddUserModalOpen(false)} onSave={handleSaveUser} />}
    </main>
  );
};

export default App;
