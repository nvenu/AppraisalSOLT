import Image from 'next/image'
import { Building2 } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <img
                src="/images/solt-logo.svg"
                alt="Source of Life Technologies"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm font-semibold text-gray-900">
                Source of Life Technologies
              </p>
              <p className="text-xs text-gray-500">
                Employee Appraisal System
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500">
              © {currentYear} Source of Life Technologies. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Empowering Growth Through Feedback
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
