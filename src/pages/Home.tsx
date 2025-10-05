import { Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/components/Button';
import { Card, CardTitle, CardDescription, CardContent } from '../ui/components/Card';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Web App V2
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A modern, clean, and fast web application built with React, TypeScript, 
            and Tailwind CSS. Ready to be customized for your next project.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/about">
              <Button className="inline-flex items-center space-x-2">
                <span>Learn More</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </Link>
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" className="inline-flex items-center space-x-2">
                <CodeBracketIcon className="w-4 h-4" />
                <span>View Source</span>
              </Button>
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built with Modern Tools
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <SparklesIcon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>React 18</CardTitle>
                <CardDescription>
                  Latest React features with TypeScript for type safety and better developer experience.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CodeBracketIcon className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Vite</CardTitle>
                <CardDescription>
                  Lightning-fast build tool and development server for optimal performance.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <SparklesIcon className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Tailwind CSS</CardTitle>
                <CardDescription>
                  Utility-first CSS framework for rapid UI development with beautiful designs.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
