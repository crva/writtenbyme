import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="text-sm text-muted-foreground mb-8">
          Last updated: January 19, 2026
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p>
              WrittenByMe operates the WrittenByMe website. This page informs
              you of our policies regarding the collection, use, and disclosure
              of personal data when you use our Service.
            </p>
            <p>
              This Privacy Policy complies with the European Union's General
              Data Protection Regulation (GDPR) and other applicable data
              protection laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Data We Collect</h2>
            <p>
              We collect only the minimum data necessary to operate the Service:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Email address</strong> - Used for authentication via
                magic link login
              </li>
              <li>
                <strong>Username</strong> - Used as your public profile
                identifier
              </li>
              <li>
                <strong>Your articles</strong> - All articles you create and
                publish
              </li>
              <li>
                <strong>Country from IP address</strong> - Aggregated for
                article view analytics only (not the IP address)
              </li>
              <li>
                <strong>Browser and OS information</strong> - Collected from
                User-Agent header for article view analytics
              </li>
              <li>
                <strong>Account metadata</strong> - Creation date, update date,
                and subscription status (paid/free)
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Email & Username:</strong> To authenticate you and
                identify your account
              </li>
              <li>
                <strong>Articles:</strong> To store and display your published
                content
              </li>
              <li>
                <strong>Analytics (Country, Browser, OS):</strong> To show you
                statistics about who reads your articles
              </li>
              <li>
                <strong>Subscription status:</strong> To manage access to paid
                features
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Your Rights</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and all associated data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Account Deletion</h2>
            <p>
              When you delete your account, all your personal data is
              permanently and immediately deleted, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your email address</li>
              <li>Your username</li>
              <li>All your articles</li>
              <li>All article view analytics</li>
              <li>Your account metadata</li>
            </ul>
            <p>
              There is no recovery after deletion. This action cannot be undone.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Data Security</h2>
            <p>
              We use industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure authentication via magic links</li>
              <li>Regular security updates</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. What We Don't Store</h2>
            <p>To be clear, we do NOT store:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Passwords</li>
              <li>Payment information (handled by third-party processors)</li>
              <li>IP addresses</li>
              <li>Cookies for tracking (only for session management)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Third-Party Services</h2>
            <p>
              We use <strong>Polar.sh</strong> to process payments. Payment data
              is handled directly by Polar.sh and is not stored on our servers.
              Polar.sh has its own privacy policy that you should review at{" "}
              <a
                href="https://polar.sh/legal/privacy"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                polar.sh/legal/privacy
              </a>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or want to
              exercise your data rights, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded">
              <p>support@writtenbyme.com</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              10. Changes to This Policy
            </h2>
            <p>
              We reserve the right to modify or replace this Privacy Policy at
              any time. If a revision is material, we will provide at least 30
              days' notice prior to any new terms taking effect.
            </p>
          </section>
        </div>

        <div className="flex justify-center items-center mt-10">
          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft />
              home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
