"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink, Element } from "react-scroll";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Brain,
  Zap,
  Shield,
  ChevronRight,
  Check,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: BarChart,
    title: "Performance Tracking",
    description:
      "Monitor and analyze your athletic performance with precision.",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description:
      "Get intelligent suggestions to improve your training and performance.",
  },
  {
    icon: Zap,
    title: "Instant Data Access",
    description:
      "Access your performance data anytime, anywhere with blockchain security.",
  },
  {
    icon: Shield,
    title: "Data Ownership",
    description: "Maintain full control and ownership of your athletic data.",
  },
];

const testimonials = [
  {
    name: "Michael Johnson",
    role: "Olympic Athlete",
    content:
      "AthleDger has revolutionized how I track and manage my performance data. The blockchain security gives me peace of mind.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Sarah Thompson",
    role: "Sports Agent",
    content:
      "As an agent, AthleDger provides invaluable insights into my clients' performances. It's a game-changer in athlete management.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "David Chen",
    role: "Team Coach",
    content:
      "The data analytics provided by AthleDger have significantly improved our team's training strategies and overall performance.",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

const faqItems = [
  {
    question: "What is AthleDger?",
    answer:
      "AthleDger is a blockchain-powered platform that allows athletes to securely store, manage, and monetize their performance data. It provides a decentralized ledger system ensuring complete transparency and control over athletic information.",
  },
  {
    question: "How does AthleDger ensure data security?",
    answer:
      "AthleDger uses blockchain technology to create a secure, immutable record of all data transactions. This ensures that your performance data is protected from unauthorized access or tampering.",
  },
  {
    question: "Can I control who sees my data?",
    answer:
      "Yes, AthleDger gives you full control over your data. You can choose to keep your data private, share it with specific individuals or organizations, or make it public for potential monetization opportunities.",
  },
  {
    question: "How can I monetize my athletic data?",
    answer:
      "AthleDger provides a marketplace where you can securely sell or license your performance data to interested parties such as sports teams, researchers, or brands. You set the terms and pricing for your data.",
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [ref, inView] = useInView();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailValid(true);
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      console.log("Valid email submitted:", email);
      setIsSubmitted(true);
      // Here you would typically send the email to your backend
    } else {
      setIsEmailValid(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold">AthleDger</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <ScrollLink
                  to="features"
                  smooth={true}
                  duration={500}
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                >
                  Features
                </ScrollLink>
                <ScrollLink
                  to="demo"
                  smooth={true}
                  duration={500}
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                >
                  Demo
                </ScrollLink>
                <ScrollLink
                  to="testimonials"
                  smooth={true}
                  duration={500}
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                >
                  Testimonials
                </ScrollLink>
                <ScrollLink
                  to="faq"
                  smooth={true}
                  duration={500}
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                >
                  FAQ
                </ScrollLink>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button size="sm" className="rounded-full">
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Empower Your Athletic Journey with{" "}
                <span className="text-primary">AthleDger</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Securely store, manage, and monetize your performance data with
                blockchain technology. Take control of your athletic career like
                never before.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" className="rounded-full">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full">
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Element name="features">
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Revolutionize Your Athletic Data Management
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                AthleDger combines cutting-edge blockchain technology with
                intuitive design to help you take control of your performance
                data.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="rounded-lg bg-card p-6 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Element>

      {/* Demo Section */}
      <Element name="demo">
        <section className="py-16 sm:py-24 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                See AthleDger in Action
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Experience the power and simplicity of AthleDger with our
                interactive demo videos.
              </p>
            </div>
            <Tabs
              defaultValue="dashboard"
              className="w-full"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="dashboard">Athlete Dashboard</TabsTrigger>
                <TabsTrigger value="marketplace">Data Marketplace</TabsTrigger>
                <TabsTrigger value="analytics">
                  Performance Analytics
                </TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent
                    value="dashboard"
                    className="bg-card rounded-lg shadow-lg p-6"
                  >
                    <h3 className="text-xl font-semibold mb-4">
                      Athlete Dashboard
                    </h3>
                    <p className="mb-4">
                      Manage your performance data and control access to your
                      information with ease.
                    </p>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Athlete Dashboard Demo Video
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="marketplace"
                    className="bg-card rounded-lg shadow-lg p-6"
                  >
                    <h3 className="text-xl font-semibold mb-4">
                      Data Marketplace
                    </h3>
                    <p className="mb-4">
                      Discover how you can monetize your athletic data securely
                      on our blockchain-powered marketplace.
                    </p>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Data Marketplace Demo Video
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="analytics"
                    className="bg-card rounded-lg shadow-lg p-6"
                  >
                    <h3 className="text-xl font-semibold mb-4">
                      Performance Analytics
                    </h3>
                    <p className="mb-4">
                      Gain valuable insights from your performance data with our
                      advanced analytics tools.
                    </p>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">
                        Performance Analytics Demo Video
                      </p>
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </section>
      </Element>

      {/* Testimonials Section */}
      <Element name="testimonials">
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What Athletes Say
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover how AthleDger is transforming the way athletes manage
                their data and careers.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-card rounded-lg p-6 shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <p className="text-muted-foreground mb-4">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Element>

      {/* FAQ Section */}
      <Element name="faq">
        <section className="py-16 sm:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Find answers to common questions about AthleDger.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="font-semibold text-lg">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-muted-foreground">{item.answer}</p>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </Element>

      {/* CTA Section */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Take Control of Your Athletic Data?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Join thousands of athletes who are already benefiting from
              AthleDger. Start your journey today.
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col items-center sm:flex-row sm:justify-center"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full sm:w-64 text-foreground rounded-full ${
                  !isEmailValid ? "border-red-500" : ""
                }`}
              />
              <Button
                type="submit"
                size="lg"
                className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto rounded-full"
              >
                {isSubmitted ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Submitted
                  </>
                ) : (
                  "Get Early Access"
                )}
              </Button>
            </form>
            {!isEmailValid && (
              <p className="mt-2 text-sm text-red-400">
                Please enter a valid email address.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold">AthleDger</span>
            </div>
            <nav className="mt-4 flex items-center space-x-4 sm:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Contact
              </a>
            </nav>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2024 AthleDger. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
