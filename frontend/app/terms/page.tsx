import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions – VideoHub',
  description: 'Terms and conditions for using VideoHub.',
};

const TermsPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 flex flex-col gap-10">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        By accessing or using VideoHub, you agree to be bound by these Terms &amp; Conditions. If
        you do not agree with any part of these terms, you must not use our platform.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">1. Eligibility</h2>
        <p className="text-muted-foreground leading-relaxed">
          You must be at least 13 years of age to use this platform. By using VideoHub, you confirm
          that you meet this age requirement and that you have the legal capacity to enter into a
          binding agreement.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">2. User Accounts</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You must provide accurate and complete information when creating an account.</li>
          <li>You are responsible for all activities that occur under your account.</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">3. Acceptable Use</h2>
        <p className="text-muted-foreground leading-relaxed">You agree not to:</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Upload, share, or distribute any content that is illegal, harmful, or offensive</li>
          <li>Infringe upon any intellectual property rights of others</li>
          <li>Use the platform to spam, harass, or harm other users</li>
          <li>Attempt to gain unauthorized access to any part of the platform or its systems</li>
          <li>Use automated tools (bots, scrapers) without prior written permission</li>
          <li>Distribute malware, viruses, or other malicious code</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">4. Content Ownership</h2>
        <p className="text-muted-foreground leading-relaxed">
          All video content hosted on VideoHub is owned by their respective creators and copyright
          holders. VideoHub does not claim ownership over user-uploaded content. By uploading
          content, you grant VideoHub a non-exclusive, royalty-free license to display and stream
          your content on the platform.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
        <p className="text-muted-foreground leading-relaxed">
          The VideoHub name, logo, design, and all platform-related content are the exclusive
          intellectual property of VideoHub. You may not reproduce, distribute, or create derivative
          works without our explicit written consent.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">6. Termination</h2>
        <p className="text-muted-foreground leading-relaxed">
          We reserve the right to suspend or terminate your account at any time, without notice, if
          you violate these Terms &amp; Conditions or engage in conduct that we determine to be
          harmful to the platform or its users.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">7. Limitation of Liability</h2>
        <p className="text-muted-foreground leading-relaxed">
          VideoHub is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no
          warranties, express or implied, regarding the reliability, availability, or accuracy of
          the platform. To the fullest extent permitted by law, VideoHub shall not be liable for
          any indirect, incidental, or consequential damages arising from your use of the platform.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">8. Governing Law</h2>
        <p className="text-muted-foreground leading-relaxed">
          These Terms &amp; Conditions are governed by applicable laws. Any disputes shall be
          resolved through appropriate legal channels in the jurisdiction where VideoHub operates.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">9. Changes to Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may revise these terms at any time. Continued use of the platform after changes are
          posted constitutes acceptance of the revised terms. We encourage you to review this page
          periodically.
        </p>
      </section>
    </div>
  );
}
export default TermsPage;
