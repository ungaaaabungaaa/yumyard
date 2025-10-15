'use client';

import { useRouter } from 'next/navigation';

export default function EmptyNotification() {
  const router = useRouter();

  const handleExploreClick = () => {
    router.push('/user/home');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      {/* Illustration Section */}
      <div className="relative mb-8">
        
        <img src="/Emptystate.png" alt="Empty Notification" className="w-full h-42 object-cover" />
        
      </div>
      
      {/* Text Content */}
      <div className="text-center mb-8 max-w-sm">
        <h2 className="text-4xl font-bold text-typography-heading mb-3">
          No Notification Found!
        </h2>
        <p className="text-gray-600 text-base leading-relaxed">
         Order something yummy <br></br> to See Notification here...
        </p>
      </div>
      
      {/* Explore Button */}
      <button 
        onClick={handleExploreClick}
        className="bg-background-primary  text-white font-medium px-24 py-4 rounded-lg  transition-colors duration-200"
      >
        Find Food
      </button>
    </div>
  );
}