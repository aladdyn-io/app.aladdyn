import { Link } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import { Button } from '@/ui/components/Button';
import { Card, CardTitle, CardDescription, CardContent } from '@/ui/components/Card';

export function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <img src="/gene.png" alt="Aladdyn" className="h-20 w-20" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Aladdyn
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            AI Agent Platform
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create intelligent AI agents for your website in minutes. No coding required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="inline-flex items-center space-x-2">
                <span>Create Your Agent</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </Link>
            
            <Link to="/login">
              <Button variant="secondary" className="inline-flex items-center space-x-2">
                <span>View Demo</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2">
              <CardContent className="pt-6">
                <CardTitle className="text-lg font-semibold mb-2">Easy Setup</CardTitle>
                <CardDescription>
                  Configure your agent in 3 simple steps. No technical knowledge required.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2">
              <CardContent className="pt-6">
                <CardTitle className="text-lg font-semibold mb-2">Instant Deploy</CardTitle>
                <CardDescription>
                  Deploy your agent instantly with a single click. Works on any website.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2">
              <CardContent className="pt-6">
                <CardTitle className="text-lg font-semibold mb-2">Smart Responses</CardTitle>
                <CardDescription>
                  AI-powered responses that understand context and provide helpful answers.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
