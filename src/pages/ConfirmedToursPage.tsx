
import Layout from "@/components/Layout";
import { ConfirmedTours } from "@/components/Tours/ConfirmedTours";

const ConfirmedToursPage = () => {
  return (
    <Layout>
      <div className="animate-fade-in p-6">
        <ConfirmedTours />
      </div>
    </Layout>
  );
};

export default ConfirmedToursPage;
