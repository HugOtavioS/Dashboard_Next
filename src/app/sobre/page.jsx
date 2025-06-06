'use client';

import Image from 'next/image';
import { Footer } from '@/components/Footer';
import { ParallaxSection } from '@/components/ParallaxSection';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section with SENAI logo - Fixed at the top with parallax background */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background parallax effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-100 to-white"
          style={{
            transform: 'translateY(0)', 
            backgroundSize: '200% 200%',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <Image 
            src="/senai-logo.png" 
            alt="Logo SENAI" 
            width={280} 
            height={150}
            className="mb-8"
            priority
          />
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">
            Projeto Integrador ADS SENAI
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Dashboard de visualização de dados desenvolvido pelos alunos do curso de Análise e Desenvolvimento de Sistemas
          </p>
          
          <div className="mt-12 animate-bounce">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="36" 
              height="36" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-blue-600"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      <main className="bg-gradient-to-b from-white to-gray-100">
        <div className="py-4"></div> {/* Spacer */}
        
        {/* Team Members Section - Reduced height with parallax */}
        <ParallaxSection speed={0.08} offset={40} minOpacity={0.8}>
          <div className="container mx-auto px-4">
            <Card className="rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden border-gray-200 bg-white backdrop-blur-sm shadow-lg">
              <CardHeader className="pt-8">
                <CardTitle className="text-center text-3xl text-gray-800">Nossa Equipe</CardTitle>
                <CardDescription className="text-center text-lg text-gray-600">
                  Alunos de Análise e Desenvolvimento de Sistemas do SENAI
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="flex justify-center gap-12 mt-6">
                    <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                      <div className="w-36 h-36 rounded-full bg-blue-100 mb-4 flex items-center justify-center shadow-md">
                        <span className="text-5xl text-blue-600">
                          <img src="assets/hugo.png" alt="Hugo Otávio" className="w-full h-full object-cover rounded-full" />
                        </span>
                      </div>
                      <h3 className="text-xl font-medium text-blue-600">Hugo Otávio</h3>
                      <p className="text-base text-gray-700 text-center mt-2">
                        Desenvolvedor BackEnd
                      </p>
                    </div>

                    <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                      <div className="w-36 h-36 rounded-full bg-blue-100 mb-4 flex items-center justify-center shadow-md">
                        <span className="text-5xl text-blue-600">
                          <img src="assets/misael.png" alt="Misael Morgado" className="w-full h-full object-cover rounded-full" />
                        </span>
                      </div>
                      <h3 className="text-xl font-medium text-blue-600">Misael Morgado</h3>
                      <p className="text-base text-gray-700 text-center mt-2">
                        Desenvolvedor FrontEnd
                      </p>
                    </div>

                    <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                      <div className="w-36 h-36 rounded-full bg-blue-100 mb-4 flex items-center justify-center shadow-md">
                        <span className="text-5xl text-blue-600">
                          <img src="assets/julio.png" alt="Júlio César" className="w-full h-full object-cover rounded-full" />
                        </span>
                      </div>
                      <h3 className="text-xl font-medium text-blue-600">Júlio César</h3>
                      <p className="text-base text-gray-700 text-center mt-2">
                        Desenvolvedor | Database
                      </p>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ParallaxSection>

        <div className="py-6"></div> {/* Spacer */}

        {/* Project Description Section - Reduced height with parallax */}
        <ParallaxSection speed={0.06} offset={50} minOpacity={0.8}>
          <div className="container mx-auto px-4">
            <Card className="rounded-lg border border-border bg-card text-card-foreground shadow-sm border-gray-200 bg-white backdrop-blur-sm shadow-lg">
              <CardHeader className="pt-8">
                <CardTitle className="text-center text-3xl text-gray-800">Sobre o Projeto</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none text-lg p-6 pb-8">
                <p className="text-gray-700 leading-relaxed">
                  Este é um projeto integrador desenvolvido pelos alunos Hugo Otávio, Júlio César e Misael Bonifácio do curso de Análise e Desenvolvimento de Sistemas do SENAI. 
                  O objetivo principal é aplicar os conhecimentos adquiridos durante o curso em um projeto prático que soluciona 
                  problemas reais, proporcionando uma experiência alinhada com as demandas do mercado de trabalho.
                </p>
                
                <p className="text-gray-700 leading-relaxed mt-6">
                  O dashboard desenvolvido permite a visualização e análise de dados importantes para o gerenciamento 
                  de recursos e tomada de decisões. Utilizamos tecnologias modernas como React, Next.js e TailwindCSS 
                  para criar uma interface intuitiva e responsiva que otimiza a experiência do usuário.
                </p>
                
                <p className="text-gray-700 leading-relaxed mt-6">
                  Nossa solução foi pensada para atender às necessidades objetivos propostos, proporcionando uma 
                  experiência de usuário agradável e funcional. O sistema conta com recursos de visualização de dados em tempo real, facilitando a interpretação de informações complexas através de uma interface amigável.
                </p>
              </CardContent>
            </Card>
          </div>
        </ParallaxSection>

        <div className="py-6"></div> {/* Spacer */}

        {/* Technologies Section - Reduced height with parallax */}
        <ParallaxSection speed={0.09} offset={60} minOpacity={0.8}>
          <div className="container mx-auto px-4">
            <Card className="rounded-lg border border-border bg-card text-card-foreground shadow-sm border-gray-200 bg-white backdrop-blur-sm shadow-lg">
              <CardHeader className="pt-8">
                <CardTitle className="text-center text-3xl text-gray-800">Tecnologias Utilizadas</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-6">
                  {[
                    "React", "Next.js", "TailwindCSS", 
                    "Node.js", "MySQL"
                  ].map((tech) => (
                    <div key={tech} className="p-6 bg-blue-50 rounded-lg shadow-md border border-blue-200 transform transition-all duration-300 hover:scale-105 hover:bg-blue-100">
                      <p className="font-semibold text-xl text-blue-600 text-center">{tech}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ParallaxSection>

        <div className="py-12"></div> {/* Spacer before footer */}
      </main>

      <Footer />
    </div>
  );
}