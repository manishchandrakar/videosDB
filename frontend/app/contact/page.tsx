import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us – VideoHub',
  description: 'Get in touch with the VideoHub team.',
};

const ContactPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 flex flex-col gap-10">
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
        <p className="text-muted-foreground">We&apos;d love to hear from you. Reach out any time.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {/* Email */}
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            Email
          </div>
          <a
            href="mailto:support@videohub.com"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            support@videohub.com
          </a>
        </div>

        {/* Business */}
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Business Enquiries
          </div>
          <a
            href="mailto:business@videohub.com"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            business@videohub.com
          </a>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">Send Us a Message</h2>
        <form
          action={`mailto:support@videohub.com`}
          method="get"
          encType="text/plain"
          className="flex flex-col gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                className="rounded-lg border border-border bg-input-bg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                className="rounded-lg border border-border bg-input-bg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="What is this about?"
              className="rounded-lg border border-border bg-input-bg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
            <textarea
              id="message"
              name="body"
              rows={5}
              placeholder="Write your message here..."
              className="rounded-lg border border-border bg-input-bg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <button
            type="submit"
            className="self-start rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}

export default ContactPage;
