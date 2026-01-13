"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Check,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const pricingRef = useRef<HTMLDivElement>(null);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/dashboard`);
    }
  };

  const handlePricingClick = () => {
    setTimeout(() => {
      pricingRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-linear-to-b from-background via-background to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Hero Section with Dashboard Screenshot */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
            {/* Main Headline */}
            <div className="text-center space-y-6 animate-fade-in">
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary via-primary to-primary/50">
                Share Your Stories
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Write, publish, and share your articles with the world. Simple,
                elegant, and built for writers.
              </p>
            </div>

            {/* Dashboard Screenshot */}
            <div className="w-full">
              <div className="relative rounded-2xl border border-primary/20 overflow-hidden shadow-2xl hover:shadow-primary/25 transition-shadow duration-300">
                <img
                  src="/dashboard.png"
                  alt="WrittenByMe Dashboard"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Username Input Section */}
        <section className="py-20 px-4 border-t border-primary/10">
          <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                Get Started Today
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose your username and begin sharing your articles
              </p>
            </div>

            <div className="w-full space-y-4">
              <form onSubmit={handleUsernameSubmit} className="relative">
                <div className="relative flex items-center rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm hover:border-primary/40  shadow-2xl hover:shadow-primary/25 duration-300">
                  {/* Prefix */}
                  <span className="text-lg font-semibold text-muted-foreground pl-2 pr-2 whitespace-nowrap">
                    writtenby.me/
                  </span>

                  {/* Input Field */}
                  <Input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-lg placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:outline-none px-2"
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!username.trim()}
                    className="m-1 rounded-md bg-primary hover:bg-primary/90 w-1/8"
                  >
                    <span className="hidden sm:inline">Go</span>
                    <Sparkles className="size-4 sm:hidden" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-3">
                  Create your profile and start writing today
                </p>
              </form>
            </div>

            {/* CTA Button to Pricing */}
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={handlePricingClick}
                variant="outline"
                className="rounded-full px-6 py-2 h-auto text-base border-primary/30 hover:border-primary/60 hover:bg-primary/5"
              >
                View Pricing Plans
              </Button>
              <p className="text-sm text-muted-foreground">
                See what plan fits you best
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              Why Choose WrittenByMe?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative p-8 rounded-xl border border-primary/10 bg-card/40 backdrop-blur hover:border-primary/30 hover:bg-card/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="text-primary size-6" />
                  </div>
                  <h3 className="text-xl font-bold">Simple & Elegant</h3>
                  <p className="text-muted-foreground">
                    A clean, distraction-free writing environment. Focus on what
                    matters: your words.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-8 rounded-xl border border-primary/10 bg-card/40 backdrop-blur hover:border-primary/30 hover:bg-card/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="text-primary size-6" />
                  </div>
                  <h3 className="text-xl font-bold">Easy Sharing</h3>
                  <p className="text-muted-foreground">
                    Share your articles with a simple, beautiful URL. Your
                    readers get the best experience.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-8 rounded-xl border border-primary/10 bg-card/40 backdrop-blur hover:border-primary/30 hover:bg-card/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="text-primary size-6" />
                  </div>
                  <h3 className="text-xl font-bold">Track Growth</h3>
                  <p className="text-muted-foreground">
                    With Pro plans, access statistics to see how your articles
                    are reaching readers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="py-20 px-4 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Choose Your Plan
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Simple, transparent pricing. Upgrade or downgrade anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="relative group p-8 rounded-2xl border border-primary/20 bg-card/40 backdrop-blur hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative space-y-6">
                  {/* Header */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold">Free</h3>
                    <p className="text-muted-foreground">
                      Perfect for getting started
                    </p>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">$0</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Forever free, no credit card needed
                    </p>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => {
                      const inputElement = document.querySelector(
                        'input[placeholder="username"]'
                      ) as HTMLInputElement;
                      if (inputElement) {
                        inputElement.focus();
                        inputElement.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30"
                    variant="outline"
                  >
                    Get Started
                  </Button>

                  {/* Features */}
                  <div className="space-y-3 pt-4 border-t border-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-5 rounded-full bg-primary/20">
                        <Check className="size-3 text-primary" />
                      </div>
                      <span className="text-sm">1 Article</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-5 rounded-full bg-primary/20">
                        <Check className="size-3 text-primary" />
                      </div>
                      <span className="text-sm">
                        Beautiful Reader Experience
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-5 rounded-full bg-primary/20">
                        <Check className="size-3 text-primary" />
                      </div>
                      <span className="text-sm">Easy Sharing & Hosting</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                      <div className="flex items-center justify-center size-5 rounded-full bg-muted">
                        <span className="size-3 text-muted-foreground text-xs">
                          <X className="size-3 text-primary" />
                        </span>
                      </div>
                      <span className="text-sm">Statistics & Analytics</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-50">
                      <div className="flex items-center justify-center size-5 rounded-full bg-muted">
                        <span className="size-3 text-muted-foreground text-xs">
                          <X className="size-3 text-primary" />
                        </span>
                      </div>
                      <span className="text-sm">Advanced Features</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="relative group p-8 rounded-2xl border-2 border-primary bg-linear-to-br from-primary/10 to-primary/5 backdrop-blur hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    <Zap className="size-4" />
                    Most Popular
                  </span>
                </div>

                <div className="relative space-y-6 pt-4">
                  {/* Header */}
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold">Pro</h3>
                    <p className="text-muted-foreground">
                      For serious writers & creators
                    </p>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">$7.99</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Unlock unlimited potential
                    </p>
                  </div>

                  {/* CTA */}
                  <Button className="w-full rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                    Upgrade to Pro
                  </Button>

                  {/* Features */}
                  <div className="space-y-3 pt-4 border-t border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-5 rounded-full bg-primary">
                        <Check className="size-3 text-primary-foreground" />
                      </div>
                      <span className="text-sm font-semibold">
                        Up to 200 Articles
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-5 rounded-full bg-primary">
                        <Check className="size-3 text-primary-foreground" />
                      </div>
                      <span className="text-sm">
                        Beautiful Reader Experience
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-5 rounded-full bg-primary">
                        <Check className="size-3 text-primary-foreground" />
                      </div>
                      <span className="text-sm">Easy Sharing & Hosting</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-5 rounded-full bg-primary">
                        <Check className="size-3 text-primary-foreground" />
                      </div>
                      <span className="text-sm font-semibold">
                        Full Statistics & Analytics
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-5 rounded-full bg-primary">
                        <Check className="size-3 text-primary-foreground" />
                      </div>
                      <span className="text-sm">Advanced Customization</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ or Additional Info */}
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="rounded-xl border border-primary/10 bg-card/40 backdrop-blur p-8 space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  What You Get
                </h3>
                <p className="text-muted-foreground">
                  Both plans include a beautiful, distraction-free writing
                  experience. With Pro, you unlock unlimited articles and
                  detailed statistics to track your writing impact. No
                  contracts, cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Share Your Stories?
              </h2>
              <p className="text-lg text-muted-foreground">
                Start writing today. It takes less than a minute to get started.
              </p>
            </div>

            <Button
              onClick={() => {
                const inputElement = document.querySelector(
                  'input[placeholder="username"]'
                ) as HTMLInputElement;
                if (inputElement) {
                  inputElement.focus();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              size="lg"
              className="rounded-lg px-8 bg-primary hover:bg-primary/90"
            >
              Start Writing Now
            </Button>
          </div>
        </section>

        {/* Footer */}
        <section className="border-t border-primary/10 py-12 px-4">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <p className="text-muted-foreground">
              WrittenByMe © {new Date().getFullYear()}. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Beautifully designed for writers, by writers.
            </p>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
