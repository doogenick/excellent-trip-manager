
import Layout from "@/components/Layout";
import { SettingsPage as SettingsContent } from "@/components/SettingsPage";

const SettingsPage = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <SettingsContent />
      </div>
    </Layout>
  );
};

export default SettingsPage;
