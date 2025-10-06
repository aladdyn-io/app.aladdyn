import { Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { Button } from '@/ui/components/Button';
import { Card, CardTitle, CardDescription, CardContent } from '@/ui/components/Card';

export function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg p-4">
              <img src="/gene.png" alt="Aladdyn" className="w-full h-full object-contain" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-6">
            Welcome to Aladdyn
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI-Powered Generative Tools platform built with cutting-edge technologies. 
            Create, manage, and deploy intelligent solutions with ease.
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
