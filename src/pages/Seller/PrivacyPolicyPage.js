import React from "react";

const PrivacyPolicyPage = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto bg-white">
      <h2 className="text-3xl font-bold text-red-800 mb-4">PRIVACY POLICY</h2>
      <p className="text-sm text-gray-500 uppercase tracking-wider mb-10">
        Our personal statement, cookies, third-parties
      </p>

      <div className="space-y-6 divide-y divide-gray-200">
        {/* Section 1 */}
        <div className="grid md:grid-cols-3 gap-4 py-4">
          <h3 className="text-red-800 font-semibold">Respect for Your Privacy</h3>
          <div className="md:col-span-2 text-gray-800 text-sm">
            We are committed to respecting your privacy and protecting your personal data.
          </div>
        </div>

        {/* Section 2 */}
        <div className="grid md:grid-cols-3 gap-4 py-4">
          <h3 className="text-red-800 font-semibold">What Data We Collect</h3>
          <div className="md:col-span-2 text-gray-800 text-sm space-y-1">
            <ul className="list-disc list-inside">
              <li>Account information (name, email, etc.).</li>
              <li>Order and usage history.</li>
              <li>Cookies for personalization and analytics.</li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div className="grid md:grid-cols-3 gap-4 py-4">
          <h3 className="text-red-800 font-semibold">How We Use Your Data</h3>
          <div className="md:col-span-2 text-gray-800 text-sm space-y-1">
            <ul className="list-disc list-inside">
              <li>To improve and personalize our service.</li>
              <li>To communicate with you about orders or support.</li>
              <li>For security and fraud prevention.</li>
            </ul>
          </div>
        </div>

        {/* Section 4 */}
        <div className="grid md:grid-cols-3 gap-4 py-4">
          <h3 className="text-red-800 font-semibold">Data Sharing</h3>
          <div className="md:col-span-2 text-gray-800 text-sm space-y-1">
            <p>We do not share your personal data with third parties except:</p>
            <ul className="list-disc list-inside">
              <li>With service providers helping us operate the platform.</li>
              <li>When required by law or to protect rights.</li>
            </ul>
          </div>
        </div>

        {/* Section 5 */}
        <div className="grid md:grid-cols-3 gap-4 py-4">
          <h3 className="text-red-800 font-semibold">Data Protection</h3>
          <div className="md:col-span-2 text-gray-800 text-sm">
            Your data is stored securely with encryption and limited access.
          </div>
        </div>

        {/* Section 6 */}
        <div className="grid md:grid-cols-3 gap-4 py-4">
          <h3 className="text-red-800 font-semibold">Your Rights</h3>
          <div className="md:col-span-2 text-gray-800 text-sm">
            You have the right to view, edit, or delete your personal information. You may also delete your account at any time.
          </div>
        </div>

        {/* Section 7 */}
        <div className="grid md:grid-cols-3 gap-4 py-4">
          <h3 className="text-red-800 font-semibold">Policy Updates</h3>
          <div className="md:col-span-2 text-gray-800 text-sm">
            We may update this policy. You will be notified of any significant changes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
