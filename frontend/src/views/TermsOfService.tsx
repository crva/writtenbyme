import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="text-sm text-muted-foreground mb-8">
          Last updated: January 19, 2026
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
            <p>
              By accessing or using WrittenByMe, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do
              not use our service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Description of Service</h2>
            <p>
              WrittenByMe is a writing platform that allows users to create,
              publish, and share articles. The service includes features such
              as:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Article creation and publishing</li>
              <li>Article view analytics and statistics</li>
              <li>User profiles and public article sharing</li>
              <li>Dark/Light mode support</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Hosting</h2>
            <p>
              The application servers and database are hosted in European Union
              regions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">User Accounts</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials
              </li>
              <li>
                You agree to provide accurate and complete information when
                creating your account
              </li>
              <li>
                You are responsible for all activities that occur under your
                account
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the service for any unlawful purpose</li>
              <li>
                Attempt to gain unauthorized access to the service or its
                systems
              </li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Create multiple accounts for abusive purposes</li>
              <li>
                Publish content that infringes on intellectual property rights
              </li>
              <li>Publish content that is defamatory, obscene, or offensive</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality
              are owned by WrittenByMe and are protected by international
              copyright, trademark, and other intellectual property laws. Your
              articles remain your property, and you grant us a license to
              display and distribute them on the platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and
              access to the service at our sole discretion, without notice, for
              conduct that we believe violates these Terms of Service or is
              harmful to other users, us, or third parties, or for any other
              reason.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" and "as available" without any
              warranties of any kind, either express or implied. We do not
              warrant that the service will be uninterrupted or error-free.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, WrittenByMe shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms of Service
              at any time. If a revision is material, we will provide at least
              30 days' notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded">
              <p>support@writtenbyme.com</p>
            </div>
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
