"use client"
import Image from "next/image";
import * as React from "react"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 text-gray-800">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 bg-white border-b border-gray-200 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-blue-600 hover:text-blue-700" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-gray-300" />
              <h1 className="text-xl font-medium text-blue-600">Projeto Integrador - Dashboard SENAI</h1>
            </div>
          </header>
          
          <main className="px-6 py-8">
            <div className="max-w-4xl mx-auto">
              <section className="mb-12 text-center">
                <div className="mb-6">
                  <Image 
                    src="/senai-logo.png" 
                    alt="Logo SENAI" 
                    width={220} 
                    height={100}
                    className="mx-auto"
                    priority
                  />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4">
                  Dashboard de Produção
                </h1>
                <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                  Projeto integrador desenvolvido pelos alunos do curso de Análise e Desenvolvimento de Sistemas do SENAI Taubaté
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link 
                    href="/dashboard" 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Acessar Dashboard
                  </Link>
                  <Link 
                    href="/sobre" 
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-blue-600 border border-blue-200 rounded-lg font-medium transition-colors"
                  >
                    Sobre o Projeto
                  </Link>
                </div>
              </section>
              
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="bg-gray-50 rounded-lg border-gray-200 shadow-lg p-4 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Visualização de Dados</CardTitle>
                    <CardDescription className="text-gray-500">Monitoramento em tempo real</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Acompanhe métricas importantes do processo de produção com visualizações claras e intuitivas.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 rounded-lg border-gray-200 shadow-lg p-4 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Análise de Peças</CardTitle>
                    <CardDescription className="text-gray-500">Estatísticas e tendências</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Acompanhe a produção de peças por cor, tamanho e material, identificando tendências e oportunidades.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 rounded-lg border-gray-200 shadow-lg p-4 overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Tecnologias Utilizadas</CardTitle>
                    <CardDescription className="text-gray-500">Stack de desenvolvimento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">
                      Projeto desenvolvido com React, Next.js, TailwindCSS e integração com backend Node.js e MySQL.
                    </p>
                  </CardContent>
                </Card>
              </section>
              
              <section className="text-center mb-8">
                <h2 className="text-2xl font-bold text-blue-600 mb-2">
                  Desenvolvido por
                </h2>
                <p className="text-gray-700">
                  Alunos do curso de Análise e Desenvolvimento de Sistemas - SENAI
                </p>
              </section>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
