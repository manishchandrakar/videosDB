import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us – VideoHub',
  description: 'Learn about VideoHub, our mission, and our team.',
};

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 flex flex-col gap-10">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">About Us</h1>
        <p className="text-muted-foreground">Who we are and what drives us.</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">Welcome to VideoHub</h2>
        <p className="text-muted-foreground leading-relaxed">
          VideoHub is a modern video sharing and discovery platform designed to make high-quality
          video content accessible to everyone. Our platform empowers content creators, educators,
          and brands to reach their audience quickly and effectively.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          Our mission is to provide a clean, fast, and reliable platform for video hosting and
          discovery. We believe in the power of video to educate, entertain, and inspire communities
          worldwide — and we work every day to make that experience better.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>High-quality video streaming across all devices</li>
          <li>Smart content discovery through tags and categories</li>
          <li>Curated content from verified creators</li>
          <li>Category-based recommendations tailored to your interests</li>
          <li>Simple, distraction-free viewing experience</li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-foreground">Our Team</h2>
        <p className="text-muted-foreground leading-relaxed">
          We are a dedicated team of developers, designers, and content specialists passionate
          about building the best video platform experience. We continuously improve our platform
          based on user feedback and the latest in web technology.
        </p>
      </section>
    </div>
  );
}
export default AboutPage;
