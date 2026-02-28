import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer – VideoHub',
  description: 'Legal disclaimer for VideoHub.',
};

const DisclaimerPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 flex flex-col gap-10">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Disclaimer</h1>
        <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        The information provided on VideoHub is for general informational and entertainment purposes
        only. By using this platform, you acknowledge and accept the terms of this disclaimer.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">1. No Professional Advice</h2>
        <p className="text-muted-foreground leading-relaxed">
          The content available on VideoHub — including videos, descriptions, and any associated
          materials — does not constitute professional advice of any kind (legal, financial, medical,
          or otherwise). Always seek the advice of a qualified professional before making decisions
          based on content you find on this platform.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">2. Third-Party Content</h2>
        <p className="text-muted-foreground leading-relaxed">
          VideoHub hosts content uploaded by third-party creators. We do not endorse, verify, or
          take responsibility for the accuracy, completeness, or reliability of any third-party
          content. The views and opinions expressed in videos are those of the creators alone and
          do not reflect the views of VideoHub.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">3. External Links</h2>
        <p className="text-muted-foreground leading-relaxed">
          Our platform may contain links to external websites, including sponsor and advertisement
          links. VideoHub has no control over the content, privacy practices, or accuracy of those
          sites. The inclusion of any link does not imply our endorsement of the linked site. We
          encourage users to review the privacy policies of any external sites they visit.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">4. Sponsored Content &amp; Advertisements</h2>
        <p className="text-muted-foreground leading-relaxed">
          VideoHub may display sponsored content and advertisements. Such content is clearly labelled.
          We are not responsible for the products or services promoted through advertisements, and
          their inclusion does not constitute an endorsement by VideoHub.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">5. Accuracy of Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          While we strive to keep the information on VideoHub accurate and up to date, we make no
          representations or warranties of any kind — express or implied — about the completeness,
          accuracy, reliability, or availability of the platform or the content on it.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
        <p className="text-muted-foreground leading-relaxed">
          To the maximum extent permitted by applicable law, VideoHub shall not be liable for any
          loss or damage — direct, indirect, incidental, consequential, or punitive — arising out of
          your access to or use of the platform, including any reliance on content found here.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">7. Changes to This Disclaimer</h2>
        <p className="text-muted-foreground leading-relaxed">
          We reserve the right to modify this Disclaimer at any time. Changes will be effective
          immediately upon posting. Continued use of the platform after any changes constitutes
          your acceptance of the updated Disclaimer.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">8. Contact</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about this Disclaimer, please contact us at{' '}
          <a href="mailto:legal@videohub.com" className="text-foreground underline underline-offset-4">
            legal@videohub.com
          </a>.
        </p>
      </section>
    </div>
  );
}

export default DisclaimerPage;