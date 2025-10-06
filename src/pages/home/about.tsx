import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Card } from '@/ui/components/Card';

export function About() {
  const features = [
    'AI-Powered Generative Tools',
    'Modern React 18 with TypeScript',
    'Lightning-fast Vite development',
    'Beautiful Tailwind CSS styling',
    'Intuitive React Router navigation',
    'Code quality with ESLint & Prettier',
    'Fully responsive design',
    'Professional UI components',
    'Clean, scalable architecture'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* About Content */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center">
              <img src="/gene.png" alt="Aladdyn" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
              About Aladdyn
            </h1>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Aladdyn is a cutting-edge AI-powered platform that provides generative tools 
              and intelligent solutions. Built with modern technologies and best practices, 
              it delivers a seamless experience for creating, managing, and deploying AI-driven applications.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              What's Included
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Getting Started
            </h2>
            
            <p className="text-gray-600 mb-4">
              This template is ready to use out of the box. You can start building 
              your application by:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
              <li>Customizing the components in the <code className="bg-gray-100 px-2 py-1 rounded">src/components</code> directory</li>
              <li>Adding new pages in the <code className="bg-gray-100 px-2 py-1 rounded">src/pages</code> directory</li>
              <li>Creating custom hooks in the <code className="bg-gray-100 px-2 py-1 rounded">src/hooks</code> directory</li>
              <li>Adding utility functions in the <code className="bg-gray-100 px-2 py-1 rounded">src/utils</code> directory</li>
            </ol>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Development
            </h2>
            
            <p className="text-gray-600">
              The project uses modern development tools and follows industry best practices. 
              All code is properly typed with TypeScript, formatted with Prettier, and 
              linted with ESLint for consistent code quality.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
