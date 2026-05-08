"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  Mail,
  Linkedin,
  FileText,
  ChevronRight,
  Check,
  Zap,
  Brain,
  Eye,
  ArrowRight,
} from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export default function NativeVoiceLanding(): React.ReactElement {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleEmailSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (email) {
        setSubmitted(true);
        setEmail("");
        setTimeout(() => setSubmitted(false), 3000);
      }
    },
    [email]
  );

  const features: Feature[] = [
    {
      icon: Brain,
      title: "AI-Powered Cultural Context",
      description:
        "Understands professional norms across tech and corporate environments, not just grammar rules.",
    },
    {
      icon: Zap,
      title: "One-Click Rewrites",
      description:
        "Paste your text, choose context, get a natural-sounding rewrite in seconds.",
    },
    {
      icon: Eye,
      title: "Learn as You Go",
      description:
        "Side-by-side explanations show you exactly why each change matters, building your fluency.",
    },
  ];

  const howItWorks: HowItWorksStep[] = [
    {
      number: "1",
      title: "Paste Your Text",
      description:
        "Copy any Slack message, email, LinkedIn post, or other professional communication.",
    },
    {
      number: "2",
      title: "Choose Your Context",
      description:
        "Select where it is going: message to manager, LinkedIn post, job application, etc.",
    },
    {
      number: "3",
      title: "Get Your Rewrite",
      description:
        "See a natural-sounding version with explanations of every change made.",
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      price: "$9",
      description: "Perfect for getting started",
      features: [
        "50 rewrites/month",
        "All communication types",
        "Basic explanations",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      description: "For regular users",
      features: [
        "Unlimited rewrites",
        "All communication types",
        "Detailed explanations",
        "Priority support",
        "Usage analytics",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Team",
      price: "$79",
      description: "For teams of up to 10",
      features: [
        "Unlimited rewrites",
        "Team dashboard",
        "Advanced analytics",
        "Dedicated support",
        "Custom training",
      ],
      cta: "Contact Us",
      popular: false,
    },
  ];

  const contextTypes = [
    { icon: MessageCircle, label: "Slack Messages" },
    { icon: Mail, label: "Emails" },
    { icon: Linkedin, label: "LinkedIn Posts" },
    { icon: FileText, label: "Cover Letters" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
              NV
            </div>
            <span className="font-bold text-lg hidden sm:inline">
              NativeVoice
            </span>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <Badge className="mx-auto bg-blue-500/20 text-blue-300 border-blue-400">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered English Fluency
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            Write English like you have spoken it your whole life
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            NativeVoice rewrites your professional communications — Slack
            messages, emails, LinkedIn posts — to sound naturally fluent. Not
            just grammatically correct. Like a native speaker wrote it.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8"
            >
              Try Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              Watch Demo
            </Button>
          </div>

          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {contextTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.label} className="space-y-2">
                  <Icon className="w-8 h-8 mx-auto text-blue-400" />
                  <p className="text-sm text-slate-300">{type.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why NativeVoice?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="bg-slate-700/50 border-slate-600 p-8 space-y-4"
                >
                  <Icon className="w-12 h-12 text-blue-400" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 bg-slate-700/50 border border-slate-600 rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">See the Difference</h3>
                <p className="text-slate-300">
                  Grammarly fixes spelling and punctuation. NativeVoice fixes
                  how you come across.
                </p>
                <ul className="space-y-3">
                  {[
                    "Tone & register adjustments",
                    "Idiomatic expressions",
                    "Cultural context awareness",
                    "Professional communication patterns",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 space-y-4">
                <div className="bg-slate-700 rounded p-4">
                  <p className="text-sm text-slate-400 mb-2">Before</p>
                  <p className="text-slate-200">
                    I am thinking about the project. Can we discuss it? I am having
                    some concerns about the timeline.
                  </p>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-blue-400" />
                </div>
                <div className="bg-slate-700 rounded p-4">
                  <p className="text-sm text-slate-400 mb-2">After</p>
                  <p className="text-slate-200">
                    I wanted to circle back on the project timeline. Do you have
                    time to sync? I am a bit concerned about the deadlines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.number} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500">
                      <span className="text-white font-bold">{step.number}</span>
                    </div>
                  </div>
                  {parseInt(step.number) < 3 && (
                    <ChevronRight className="w-6 h-6 text-slate-400 -ml-6 hidden md:block" />
                  )}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-8 text-center">
            <p className="text-lg mb-4">
              Start improving your professional English today
            </p>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-slate-300 mb-16 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Cancel anytime.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-8 space-y-6 ${
                  plan.popular
                    ? "bg-blue-500/20 border-blue-400 ring-2 ring-blue-500/50 relative"
                    : "bg-slate-700/50 border-slate-600"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                <div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <p className="text-slate-400 text-sm">/month</p>
                </div>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-slate-600 hover:bg-slate-500"
                  }`}
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Built for Tech Professionals
          </h2>

          <Tabs defaultValue="slack" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-slate-700">
              <TabsTrigger value="slack">Slack</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
            </TabsList>

            <TabsContent value="slack" className="space-y-4 mt-8">
              <Card className="bg-slate-700/50 border-slate-600 p-6">
                <p className="text-slate-300 mb-4">
                  <span className="font-semibold text-slate-200">
                    Before:
                  </span>{" "}
                  I have completed the code review. Your code needs many
                  improvements. The code is not good.
                </p>
                <p className="text-blue-300">
                  <span className="font-semibold">
                    After:
                  </span>{" "}
                  I finished up the code review. Great effort overall, but a few
                  things to polish: check the comments for details.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 mt-8">
              <Card className="bg-slate-700/50 border-slate-600 p-6">
                <p className="text-slate-300 mb-4">
                  <span className="font-semibold text-slate-200">
                    Before:
                  </span>{" "}
                  I wanted to ask if we can have a meeting about the budget. I
                  need to understand why this was decided.
                </p>
                <p className="text-blue-300">
                  <span className="font-semibold">
                    After:
                  </span>{" "}
                  Would you have time to discuss the budget allocation? I am keen
                  to understand the rationale behind the recent decisions.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="linkedin" className="space-y-4 mt-8">
              <Card className="bg-slate-700/50 border-slate-600 p-6">
                <p className="text-slate-300 mb-4">
                  <span className="font-semibold text-slate-200">
                    Before:
                  </span>{" "}
                  Today I learned a new technology. It is very good and useful.
                  I like it very much.
                </p>
                <p className="text-blue-300">
                  <span className="font-semibold">
                    After:
                  </span>{" "}
                  Diving deep into a new tech stack today. The learning curve was
                  steep, but the payoff is incredible. Game-changer for our
                  workflow.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="cover-letter" className="space-y-4 mt-8">
              <Card className="bg-slate-700/50 border-slate-600 p-6">
                <p className="text-slate-300 mb-4">
                  <span className="font-semibold text-slate-200">
                    Before:
                  </span>{" "}
                  I am very interested in your company. Your company does good
                  things. I can do this job very well.
                </p>
                <p className="text-blue-300">
                  <span className="font-semibold">
                    After:
                  </span>{" "}
                  Your mission resonates deeply with me, and I am confident my
                  background aligns well with this role. I am excited to
                  contribute meaningfully to your team.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-blue-500/20 border-t border-slate-700">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Ready to Sound Native?
          </h2>
          <p className="text-xl text-slate-300">
            Join thousands of tech professionals already using NativeVoice to
            communicate with confidence.
          </p>

          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 flex-1"
              required
            />
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap"
            >
              {submitted ? "Check your email!" : "Get Started"}
            </Button>
          </form>

          <p className="text-sm text-slate-400">
            Free trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
                  NV
                </div>
                <span className="font-bold">NativeVoice</span>
              </div>
              <p className="text-sm text-slate-400">
                Write English like a native speaker.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#features" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#privacy" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-400">
            <p>&copy; 2024 NativeVoice. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#twitter" className="hover:text-white">
                Twitter
              </a>
              <a href="#linkedin" className="hover:text-white">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}