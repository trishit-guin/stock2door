'use client'

import Link from 'next/link'
import { 
  MapIcon, 
  TruckIcon, 
  SparklesIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                <MapIcon className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-text-primary">SmartRoute</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-text-primary hover:text-accent transition-colors">
                Features
              </a>
              <a href="#about" className="text-text-primary hover:text-accent transition-colors">
                About
              </a>
              <a href="#contact" className="text-text-primary hover:text-accent transition-colors">
                Contact
              </a>
              <Link 
                href="/auth"
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
            Intelligent Route Optimization for
            <span className="text-accent"> Sustainable Logistics</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
            Optimize your delivery routes with AI-powered algorithms that balance emissions, 
            fuel consumption, weather conditions, and delivery time while promoting electric vehicle adoption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth"
              className="bg-accent text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-accent/90 transition-colors"
            >
              Start Optimizing Routes
            </Link>
            <Link 
              href="#features"
              className="bg-surface text-text-primary border border-gray-300 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Powerful Features for Modern Logistics
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Everything you need to optimize your delivery operations and reduce environmental impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapIcon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                AI Route Optimization
              </h3>
              <p className="text-text-secondary">
                Advanced algorithms optimize routes for minimum emissions, cost, and delivery time.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <SparklesIcon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                EV Compatibility
              </h3>
              <p className="text-text-secondary">
                Route planning optimized for electric vehicles with charging station integration.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <GlobeAltIcon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Weather-Aware Routing
              </h3>
              <p className="text-text-secondary">
                Real-time weather integration to avoid adverse conditions and ensure safe deliveries.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChartBarIcon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Sustainability Analytics
              </h3>
              <p className="text-text-secondary">
                Comprehensive reporting on CO₂ emissions, fuel savings, and environmental impact.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TruckIcon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Fleet Management
              </h3>
              <p className="text-text-secondary">
                Real-time vehicle tracking, maintenance scheduling, and performance monitoring.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">
                Enterprise Security
              </h3>
              <p className="text-text-secondary">
                Role-based access control, data encryption, and compliance with industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">25%</div>
              <div className="text-text-secondary">Average CO₂ Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">15%</div>
              <div className="text-text-secondary">Fuel Cost Savings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">2.5s</div>
              <div className="text-text-secondary">Average Route Optimization Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-text-secondary">System Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Logistics?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join leading companies in reducing emissions and optimizing delivery operations.
          </p>
          <Link 
            href="/auth"
            className="bg-accent text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-accent/90 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-accent rounded-lg flex items-center justify-center">
                  <MapIcon className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold">SmartRoute</span>
              </div>
              <p className="text-gray-400">
                Intelligent route optimization for sustainable logistics and delivery operations.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SmartRoute. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
