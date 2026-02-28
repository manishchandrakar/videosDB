import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – VideoHub',
  description: 'How VideoHub collects, uses, and protects your data.',
};

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 flex flex-col gap-10">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        At VideoHub, we are committed to protecting your privacy. This Privacy Policy explains how we
        collect, use, disclose, and safeguard your information when you visit our website. Please read
        this policy carefully. If you disagree with its terms, please discontinue use of the site.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may collect information about you in a variety of ways, including:
        </p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong className="text-foreground">Personal Data:</strong> Name, email address, and password when you register an account.</li>
          <li><strong className="text-foreground">Usage Data:</strong> Pages visited, videos watched, search queries, and time spent on the platform.</li>
          <li><strong className="text-foreground">Device Data:</strong> Browser type, operating system, IP address, and device identifiers.</li>
          <li><strong className="text-foreground">Cookies:</strong> Small data files stored on your device to remember your preferences and session.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>To create and manage your account</li>
          <li>To personalize your content recommendations</li>
          <li>To improve our platform, features, and services</li>
          <li>To send administrative emails (e.g., account updates)</li>
          <li>To prevent fraudulent or unauthorized activity</li>
          <li>To comply with applicable legal obligations</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">3. Sharing Your Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          We do not sell, trade, or rent your personal information to third parties. We may share
          data with trusted service providers who assist us in operating our website, conducting our
          business, or serving our users, as long as those parties agree to keep this information
          confidential.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">4. Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          We use cookies to enhance your experience. You can choose to disable cookies through your
          browser settings; however, some parts of the site may not function properly without them.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">5. Data Security</h2>
        <p className="text-muted-foreground leading-relaxed">
          We implement industry-standard security measures to protect your personal information.
          However, no method of transmission over the Internet or electronic storage is 100% secure,
          and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Access and review the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and associated data</li>
          <li>Opt out of non-essential communications</li>
        </ul>
        <p className="text-muted-foreground">
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:privacy@videohub.com" className="text-foreground underline underline-offset-4">
            privacy@videohub.com
          </a>.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">7. Changes to This Policy</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this Privacy Policy from time to time. We will notify you of significant
          changes by updating the &quot;Last updated&quot; date at the top of this page. Continued use
          of the site after changes constitutes your acceptance of the updated policy.
        </p>
      </section>
    </div>
  );
}
export default PrivacyPolicyPage;
