"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Check,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router";

export default function Landing() {
  const pricingRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handlePricingClick = () => {
    setTimeout(() => {
      pricingRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-linear-to-b from-background via-background/50 to-background">
      {/* Animated background elements - Subtle gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-fade-in opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-fade-in opacity-40 animation-delay-1s" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-16 md:py-32">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 md:gap-12">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm animate-fade-in">
              <span className="text-xs md:text-sm text-primary font-medium">
                ✨ Beautiful writing, simplified
              </span>
            </div>

            {/* Main Headline */}
            <div className="text-center space-y-6 animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                <span className="bg-linear-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                  Share Your Stories
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Write, publish, and share your articles with the world. Simple,
                elegant, and built for writers.
              </p>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up animation-delay-02s">
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="rounded-lg px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-primary/50"
              >
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                onClick={handlePricingClick}
                variant="outline"
                size="lg"
                className="rounded-lg px-8 border-primary/30 hover:border-primary/60 hover:bg-primary/5 font-medium transition-all duration-200"
              >
                View Pricing
              </Button>
            </div>

            {/* Dashboard Screenshot */}
            <div className="w-full max-w-5xl animate-fade-in-up animation-delay-04s">
              <div className="relative rounded-2xl border border-primary/10 overflow-hidden shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:border-primary/20 group">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Dashboard Screenshot Image */}
                <img
                  src="/dashboard.png"
                  alt="WrittenByMe Dashboard"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 md:py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Why Choose WrittenByMe?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to write and share beautiful articles,
                designed for creators
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative p-8 md:p-10 rounded-2xl border border-primary/10 bg-card/30 backdrop-blur hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative space-y-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                    <BookOpen className="text-primary size-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">Simple & Elegant</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      A clean, distraction-free writing environment. Focus on
                      what matters: your words.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative p-8 md:p-10 rounded-2xl border border-primary/10 bg-card/30 backdrop-blur hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative space-y-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                    <Users className="text-primary size-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">Easy Sharing</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Share your articles with a simple, beautiful URL. Your
                      readers get the best experience.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative p-8 md:p-10 rounded-2xl border border-primary/10 bg-card/30 backdrop-blur hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative space-y-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-300">
                    <TrendingUp className="text-primary size-7" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">Track Growth</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      With Pro plans, access statistics to see how your articles
                      are reaching readers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section ref={pricingRef} className="px-4 py-20 md:py-32 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that works for you. Upgrade or downgrade
                anytime, no questions asked.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="relative group p-10 rounded-2xl border border-primary/15 bg-card/30 backdrop-blur hover:border-primary/25 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative space-y-8">
                  {/* Header */}
                  <div className="space-y-3">
                    <h3 className="text-2xl md:text-3xl font-bold">Free</h3>
                    <p className="text-muted-foreground">
                      Perfect for getting started
                    </p>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl md:text-6xl font-bold">$0</span>
                      <span className="text-muted-foreground text-lg">
                        /month
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Forever free, no credit card required
                    </p>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    className="w-full rounded-xl px-6 py-3 border-primary/30 hover:border-primary/60 hover:bg-primary/5 text-base font-medium transition-all duration-200"
                  >
                    Get Started
                    <ArrowRight className="ml-2 size-4" />
                  </Button>

                  {/* Features */}
                  <div className="space-y-4 pt-8 border-t border-primary/10">
                    <p className="text-sm font-semibold text-muted-foreground">
                      What's included:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-5 rounded-full bg-primary/20 shrink-0">
                          <Check className="size-3 text-primary" />
                        </div>
                        <span className="text-sm">1 Article</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-5 rounded-full bg-primary/20 shrink-0">
                          <Check className="size-3 text-primary" />
                        </div>
                        <span className="text-sm">
                          Beautiful Reader Experience
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-5 rounded-full bg-primary/20 shrink-0">
                          <Check className="size-3 text-primary" />
                        </div>
                        <span className="text-sm">Easy Sharing & Hosting</span>
                      </div>
                      <div className="flex items-center gap-3 opacity-50">
                        <div className="flex items-center justify-center size-5 rounded-full bg-muted shrink-0">
                          <X className="size-3 text-muted-foreground" />
                        </div>
                        <span className="text-sm">Statistics & Analytics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pro Plan - Featured */}
              <div className="relative group p-10 rounded-2xl border-2 border-primary bg-linear-to-br from-primary/15 to-primary/5 backdrop-blur hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
                {/* Popular Badge */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg">
                    <Zap className="size-4" />
                    Most Popular
                  </span>
                </div>

                <div className="relative space-y-8 pt-2">
                  {/* Header */}
                  <div className="space-y-3">
                    <h3 className="text-2xl md:text-3xl font-bold">Pro</h3>
                    <p className="text-muted-foreground">
                      For serious writers & creators
                    </p>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl md:text-6xl font-bold">
                        $5.99
                      </span>
                      <span className="text-muted-foreground text-lg">
                        /month
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Unlock unlimited articles and insights
                    </p>
                  </div>

                  {/* CTA */}
                  <Button
                    className="w-full rounded-xl px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                    onClick={() => navigate("/dashboard")}
                  >
                    Get Started
                    <ArrowRight className="ml-2 size-4" />
                  </Button>

                  {/* Features */}
                  <div className="space-y-4 pt-8 border-t border-primary/20">
                    <p className="text-sm font-semibold text-foreground">
                      What's included:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-5 rounded-full bg-primary shrink-0">
                          <Check className="size-3 text-primary-foreground" />
                        </div>
                        <span className="text-sm font-medium">
                          Up to 200 Articles
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-5 rounded-full bg-primary shrink-0">
                          <Check className="size-3 text-primary-foreground" />
                        </div>
                        <span className="text-sm">
                          Beautiful Reader Experience
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-5 rounded-full bg-primary shrink-0">
                          <Check className="size-3 text-primary-foreground" />
                        </div>
                        <span className="text-sm">Easy Sharing & Hosting</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-5 rounded-full bg-primary shrink-0">
                          <Check className="size-3 text-primary-foreground" />
                        </div>
                        <span className="text-sm font-medium">
                          Full Statistics & Analytics
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ / Additional Info */}
            <div className="mt-20 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-primary/10 bg-card/30 backdrop-blur p-10 space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
                    <Sparkles className="size-5 text-primary" />
                  </div>
                  What You Get
                </h3>
                <p className="text-muted-foreground leading-relaxed">
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
        <section className="px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Ready to Share Your Stories?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start writing today. It takes less than a minute to get started.
              </p>
            </div>

            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="rounded-xl px-10 py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            >
              Start Writing Now
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <section className="border-t border-primary/10 py-12 px-4">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <p className="text-muted-foreground font-medium">
              WrittenByMe © {new Date().getFullYear()}. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Beautifully designed for writers, by writers.
            </p>
          </div>
        </section>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-02s {
          animation-delay: 0.2s;
        }

        .animation-delay-04s {
          animation-delay: 0.4s;
        }

        .animation-delay-1s {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
