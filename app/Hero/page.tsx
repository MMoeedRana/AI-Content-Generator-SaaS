"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/clerk-react';
import { Settings, BookOpen, Headphones, ArrowRight, BookTemplate, Users2Icon } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <div className="min-h-screen dark:bg-slate-900">
      {/* Header Section */}
      <header className="sticky flex justify-between items-center px-8 py-4 shadow-md bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="flex items-center ml-12">
          {/* Light Mode Logo */}
          <Image
            src="/logo.png"
            alt="GenFlow AI Logo"
            width={1000}
            height={1000}
            className="block dark:hidden w-auto h-12" 
            priority
          />
          {/* Dark Mode Logo */}
          <Image
            src="/logo-dark.png" 
            alt="GenFlow AI Logo Dark"
            width={140}
            height={60} 
            className="hidden dark:block w-auto h-12"
            priority
          />
        </div>
        <div className='px-12 flex items-center space-x-2'>
          <SignInButton forceRedirectUrl={'/dashboard'}>
            <Button className="text-sm px-4 py-2 bg-transparent border-none shadow-none focus:outline-none hover:cursor-pointer hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 flex items-center space-x-2">
              <Users2Icon className="h-5 w-5" />
              <span>Get Started</span>
            </Button>
          </SignInButton>
        </div>
      </header>

      {/* Main Content */}
      <main className="text-center py-20 px-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <div className='flex justify-center items-center'>
          <button className='border-2 border-gray-200 dark:border-gray-600 rounded-full px-16 py-1 my-4 mr-3 flex items-center justify-between'>
            Membership - Join Now 
            <span className='ml-2 bg-gray-300 dark:bg-gray-700 rounded-full w-8'>
              <ArrowRight className='mr-6 w-5' />
            </span>
          </button>
        </div>
        <h1 className="text-6xl font-bold mb-4">
          AI Content <span className=" bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Generator</span>
        </h1>
        <p className="max-w-2xl mx-auto mb-8">
          Revolutionize your content creation with our AI-powered app, delivering engaging and high-quality text in seconds.
        </p>
        <SignInButton forceRedirectUrl={'/dashboard'}>
          <Button className="bg-gradient-to-b from-primary to-blue-600 text-white px-7 py-6 rounded-lg shadow hover:bg-blue-600">
            Get Started <ArrowRight className='mr-1'/>
          </Button>
        </SignInButton>
      </main>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-16">
        {[
          {
            title: "25+ templates",
            description: "Responsive, and mobile-first project on the web.",
            icon: <BookTemplate className="w-6 h-6 text-white" />,
          },
          {
            title: "Customizable",
            description: "Components are easily customized and extendable.",
            icon: <Settings className="w-6 h-6 text-white" />,
          },
          {
            title: "Free to Use",
            description: "Every component and plugin is well documented.",
            icon: <BookOpen className="w-6 h-6 text-white" />,
          },
          {
            title: "24/7 Support",
            description: "Contact us 24 hours a day, 7 days a week.",
            icon: <Headphones className="w-6 h-6 text-white" />,
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-all duration-300 hover:shadow-md"
          >
            <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-xl mb-4">
              {feature.icon}
            </div>
            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">
              {feature.title}
            </h3>
            <p className="py-4 text-gray-600 dark:text-gray-300">{feature.description}</p>
            <p className="flex items-center text-blue-600">
              Learn more <ArrowRight className="ml-1" />
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Hero