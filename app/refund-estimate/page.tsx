import HeroSection from '../components/HeroSection';
import RefundForm from '../../components/RefundForm';

export default function RefundEstimatePage() {
  return (
    <div className="min-h-screen bg-[#e7f0f0]">
      <HeroSection />
      <div className=" p-12">
        <RefundForm />
      </div>
    </div>
  );
}