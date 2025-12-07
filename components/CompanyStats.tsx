import { COMPANY_STATS } from '../lib/constants';

const CompanyStats = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-red-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Happy Clients */}
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold text-red-700 mb-2">
              {COMPANY_STATS.happyClients}
            </div>
            <div className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">
              Happy Clients
            </div>
            <div className="text-gray-600">
              Trusted by thousands of satisfied customers
            </div>
          </div>

          {/* Years of Experience */}
          <div className="text-center">
            <div className="text-5xl md:text-6xl font-bold text-red-700 mb-2">
              {COMPANY_STATS.yearsOfExperience}
            </div>
            <div className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">
              Years of Experience
            </div>
            <div className="text-gray-600">
              Delivering expert tax solutions since 2016
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStats;