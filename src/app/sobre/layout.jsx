export const metadata = {
  title: 'Sobre - Projeto Integrador ADS SENAI',
  description: 'Informações sobre o projeto e equipe',
};

export default function SobreLayout({ children }) {
  return (
    <div className="bg-transparent">
      {children}
    </div>
  );
}
