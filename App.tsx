
import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger the animation shortly after the component mounts
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
      <div className="text-center p-8">
        <div className="relative">
          <div 
            className={`transition-all duration-1000 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Hello, World!
              </span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-md mx-auto">
              This is a demonstration of a modern React application styled with Tailwind CSS.
            </p>
          </div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        </div>
      </div>
    </main>
  );
};

export default App;
