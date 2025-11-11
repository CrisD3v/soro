/**
 * Landing Page - Página principal de SORO
 */

import { NavBar } from '@/components/molecules/NavBar/NavBar';
import { FeaturesSection } from '@/components/organisms/FeaturesSection/FeaturesSection';
import { HeroSection } from '@/components/organisms/HeroSection/HeroSection';
import { PricingSection } from '@/components/organisms/PricingSection/PricingSection';
import { TestimonialsSection } from '@/components/organisms/TestimonialsSection/TestimonialsSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-purple-500">SO</span>
              <span className="text-purple-400">RO</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Sistema de Gestión Inteligente de Recursos
            </p>
            <p className="text-sm text-gray-500">
              © 2024 SORO. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
