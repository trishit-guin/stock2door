'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { 
  TruckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CubeIcon,
  MapIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('stock2door_token') : null
    setIsLoggedIn(!!token)
  }, [])

  return (
    <div className="flex min-h-screen flex-col font-sans text-foreground bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2">
            <Image
              src="/stock2door-logo.svg"
              alt="Stock2Door"
              width={160}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <button className="font-medium px-6 py-2.5 bg-[#1A73E8] text-white rounded-lg shadow-md hover:bg-[#1557b0] hover:shadow-lg transition-all">
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="font-medium px-6 py-2.5 text-gray-700 hover:text-[#1A73E8] transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="font-medium px-6 py-2.5 bg-[#1A73E8] text-white rounded-lg shadow-md hover:bg-[#1557b0] hover:shadow-lg transition-all">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 bg-gradient-to-b from-blue-50/50 to-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-8 text-center lg:text-left">
                <h1 className="font-display text-5xl font-bold leading-tight text-gray-900 sm:text-6xl lg:text-7xl">
                  From warehouse to customer{' '}
                  <span className="relative inline-block">
                    <span className="text-[#1A73E8]">with ease</span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 5 Q50 0, 100 5 T200 5" stroke="#1A73E8" strokeWidth="3" fill="none" opacity="0.3" />
                    </svg>
                  </span>
                </h1>
                <p className="mx-auto max-w-2xl text-xl text-gray-600 lg:mx-0 leading-relaxed">
                  The complete platform combining intelligent route optimization with powerful inventory management for seamless logistics operations.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 relative">
                  <Link href={isLoggedIn ? '/dashboard' : '/login'}>
                    <button className="h-14 px-8 text-base bg-[#1A73E8] text-white shadow-xl rounded-full font-bold hover:bg-[#1557b0] hover:scale-105 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                      Get Started
                      <ArrowRightIcon className="h-5 w-5" />
                    </button>
                  </Link>
                  {/* Scribble Arrow */}
                  <svg className="hidden lg:block absolute -right-24 -top-4 w-40 h-40 text-[#1A73E8] opacity-40" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 60 Q40 30, 60 50 Q80 70, 95 55" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M88 50 L95 55 L90 62" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M85 48 L92 53" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Hero Illustration */}
              <div className="relative mx-auto w-full max-w-[550px] lg:max-w-none">
                <div className="relative h-[500px] w-full">
                  {/* Main Card */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center gap-4 border-2 border-blue-100 animate-float">
                    <CubeIcon className="h-14 w-14 text-[#1A73E8]" />
                    <span className="font-bold text-gray-800 text-xl">Smart Logistics</span>
                    <p className="text-sm text-gray-600 text-center">End-to-end tracking</p>
                  </div>

                  {/* Secondary Cards */}
                  <div className="absolute top-32 left-0 w-48 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-3 border-2 border-gray-100 animate-float-delayed-1">
                    <ChartBarIcon className="h-10 w-10 text-[#1A73E8]" />
                    <span className="font-bold text-gray-800">Analytics</span>
                  </div>

                  <div className="absolute top-32 right-0 w-48 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-3 border-2 border-green-100 animate-float-delayed-2">
                    <TruckIcon className="h-10 w-10 text-green-600" />
                    <span className="font-bold text-gray-800">Delivery</span>
                  </div>

                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-3 border-2 border-blue-100 animate-float-delayed-3">
                    <ShieldCheckIcon className="h-10 w-10 text-blue-600" />
                    <span className="font-bold text-gray-800">Secure</span>
                  </div>

                  {/* Connecting Lines */}
                  <svg className="absolute inset-0 w-full h-full -z-10" xmlns="http://www.w3.org/2000/svg">
                    <line x1="50%" y1="20%" x2="20%" y2="50%" stroke="#1A73E8" strokeWidth="2" strokeDasharray="5,5" opacity="0.2" />
                    <line x1="50%" y1="20%" x2="80%" y2="50%" stroke="#1A73E8" strokeWidth="2" strokeDasharray="5,5" opacity="0.2" />
                    <line x1="50%" y1="20%" x2="50%" y2="90%" stroke="#1A73E8" strokeWidth="2" strokeDasharray="5,5" opacity="0.2" />
                  </svg>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#1A73E8] opacity-10 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#1A73E8] opacity-10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl mb-6 text-gray-900">
                Everything you need for modern logistics
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                A comprehensive suite combining route optimization and inventory management.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Route Optimization',
                  description: 'AI-powered algorithms balance emissions, fuel, weather, and delivery time for optimal routes.',
                  icon: MapIcon,
                  color: 'text-[#1A73E8]',
                  bg: 'bg-blue-50',
                  border: 'border-blue-200'
                },
                {
                  title: 'Inventory Tracking',
                  description: 'Real-time stock monitoring across all warehouse locations with automatic low-stock alerts.',
                  icon: CubeIcon,
                  color: 'text-[#1A73E8]',
                  bg: 'bg-blue-50',
                  border: 'border-blue-200'
                },
                {
                  title: 'Multi-Warehouse',
                  description: 'Seamlessly manage stock across multiple warehouses and transfer between locations.',
                  icon: GlobeAltIcon,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                  border: 'border-blue-200'
                },
                {
                  title: 'Smart Analytics',
                  description: 'Comprehensive dashboards with KPIs, charts, and insights for data-driven decisions.',
                  icon: ChartBarIcon,
                  color: 'text-[#1A73E8]',
                  bg: 'bg-blue-50',
                  border: 'border-blue-200'
                },
                {
                  title: 'Fleet Management',
                  description: 'Track vehicles, manage deliveries, and monitor fleet performance in real-time.',
                  icon: TruckIcon,
                  color: 'text-green-600',
                  bg: 'bg-green-50',
                  border: 'border-green-200'
                },
                {
                  title: 'Full Traceability',
                  description: 'Complete audit trail of every stock movement and delivery for total accountability.',
                  icon: CheckCircleIcon,
                  color: 'text-purple-600',
                  bg: 'bg-purple-50',
                  border: 'border-purple-200'
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className={`group relative overflow-hidden rounded-2xl bg-white p-8 shadow-md transition-all hover:shadow-xl hover:scale-105 border-2 ${feature.border} hover:-translate-y-2 duration-300`}
                >
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-[#1A73E8] via-[#1557b0] to-[#0d47a1] text-white relative overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
            <h2 className="font-display text-4xl font-bold sm:text-5xl lg:text-6xl mb-6">
              Ready to transform your logistics?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join businesses that trust Stock2Door for complete warehouse-to-customer operations.
            </p>
            <Link href={isLoggedIn ? '/dashboard' : '/login'}>
              <button className="h-16 px-12 text-lg bg-white text-[#1A73E8] shadow-2xl rounded-full font-bold hover:scale-110 transition-transform flex items-center gap-3 mx-auto">
                Get Started Now
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </Link>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Image
              src="/stock2door-logo.svg"
              alt="Stock2Door"
              width={140}
              height={35}
              className="object-contain"
            />
          </div>
          <p className="text-sm text-gray-600">
            &copy; 2025 Stock2Door. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link href="#" className="hover:text-[#1A73E8] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#1A73E8] transition-colors">Terms</Link>
            <Link href="#" className="hover:text-[#1A73E8] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
