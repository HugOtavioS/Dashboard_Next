import Link from 'next/link';
import { Github, Linkedin, Home, User } from 'lucide-react';

const TeamMember = ({ name, github, linkedin }) => (
  <div className="flex flex-row-reverse gap-3 items-end">
    <p className="font-medium text-blue-600">{name}</p>
    <div className="flex gap-2 mt-1">
      {github && (
        <Link href={github} target="_blank" rel="noopener noreferrer">
          <Github className="h-5 w-5 text-gray-500 hover:text-blue-600 transition-colors" />
        </Link>
      )}
      {linkedin && (
        <Link href={linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-5 w-5 text-gray-500 hover:text-blue-600 transition-colors" />
        </Link>
      )}
    </div>
  </div>
);

export function Footer() {
  const teamMembers = [
    { 
      name: "Hugo Otávio", 
      github: "https://github.com/HugOtavioS/HugOtavioS", 
      linkedin: "https://www.linkedin.com/in/hugotavios/" 
    },
    { 
      name: "Misael Morgado", 
      github: "https://github.com/MisaelBM/MisaelBM", 
      linkedin: "https://www.linkedin.com/in/misael-bonifacio-morgado-921a7a268/" 
    },
    { 
      name: "Júlio César", 
      github: "https://github.com/membro3", 
      linkedin: "https://www.linkedin.com/in/julio-c%C3%A9sar-morais-64b91b159/" 
    },
  ];

  return (
    <footer className="w-full bg-gray-100 mt-10 py-12 shadow-sm border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex gap-24">
          <div>
            <h3 className="text-xl font-semibold text-blue-600 mb-6">Equipe do Projeto</h3>
            <div className="flex gap-6">
              {teamMembers.map((member, index) => (
                <TeamMember key={index} {...member} />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-blue-600 mb-6">Links Úteis</h3>
            <div className="grid auto-cols-auto grid-flow-col w-fit gap-4">
              {/* <div className="flex flex-col gap-3"> */}
                <Link href="/" className="flex w-fit px-4 items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <Home className="h-5 w-5" />
                  <span>Início</span>
                </Link>
                <Link href="/dashboard" className="flex w-fit px-4 items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
              {/* </div> */}
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Projeto Integrador - ADS SENAI</p>
        </div>
      </div>
    </footer>
  );
}