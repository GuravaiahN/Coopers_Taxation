import React from 'react';

interface SummaryCardsProps {
  totalUsers: number;
  totalFiles: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalUsers,
  totalFiles,
}) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Total Users Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg sm:text-xl font-poppins text-gray-800 mb-2">
            Total Clients
          </h3>
          <p className="text-3xl  text-[#C84B31]" aria-label="Total users">
            {totalUsers}
          </p>
        </div>

        {/* Total Files Card */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg sm:text-xl font-poppins text-gray-800 mb-2">
            Total Files
          </h3>
          <p className="text-3xl  text-[#C84B31]" aria-label="Total files">
            {totalFiles}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
