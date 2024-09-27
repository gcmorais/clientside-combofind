import Image from "next/image";
import localFont from "next/font/local";
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useState } from 'react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setShowResults(true); // Mostra resultados imediatamente
    setLoading(true); // Define loading como true
    try {
      const response = await fetch(`https://localhost:7233/api/Collection?search=${encodeURIComponent(query)}`);
    
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    
      const result = await response.json(); // Extrai a resposta como JSON
    
      // Verifica se a resposta foi bem-sucedida
      if (result.success) {
        // Divide a query em palavras
        const queryWords = query.toLowerCase().split(" ");
  
        const filteredGuns = result.data.flatMap(item => {
          // Verifica se alguma palavra da query coincide com a cor
          const colorMatches = queryWords.some(word => item.color.toLowerCase() === word);
  
          // Filtra as armas que têm o nome correspondente a qualquer palavra da query
          const gunMatches = item.guns.filter(gun => 
            queryWords.some(word => gun.name.toLowerCase().includes(word))
          );
  
          // Se a cor coincidir, retorna todas as armas da coleção
          if (colorMatches) {
            return item.guns; // Retorna todas as armas se a cor coincidir
          }
          
          // Se não houver coincidência de cor, mas houver armas que coincidem com os nomes, retorna essas armas
          return gunMatches.length > 0 ? gunMatches : []; // Retorna apenas as armas que coincidem com o nome
        }).filter(gun => gun); // Filtra valores falsy para evitar undefined
      
        setFilteredItems(filteredGuns); // Atualiza o estado com as armas filtradas
      } else {
        console.error('Erro na resposta:', result.message);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false); // Define loading como false após a busca
    }
  };
  
  
  
  const handleClear = () => {
    setQuery('');
    setShowResults(false);
    setFilteredItems([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {showResults && filteredItems.length > 0 ? (
        <Button className="mt-4 ml-5 bg-blue-600" onClick={handleClear}>
          Voltar
        </Button>
      ) : null}
      <div className={`${geistSans.variable} ${geistMono.variable} flex flex-col justify-between min-h-screen p-8 gap-16 font-[family-name:var(--font-geist-sans)]`}>
        {loading ? (
          <div>Carregando...</div>
        ) : showResults ? (
          filteredItems.length > 0 ? (
            <div className="flex flex-col items-center w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl">
                {filteredItems.map((item) => {
                  return (
                    <div key={item.id} className="bg-gray-900 p-5 rounded-xl">
                      <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-md" />
                      <div className="text-left">
                        <h3 className="text-2xl font-sans font-bold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.averagePrice)}
                        </h3>
                        <p className="text-xs text-neutral-400">Média de preço (steam)</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-neutral-400 mt-5">{item.classType}</p>
                        <h3 className="text-md font-sans font-bold">{item.name}</h3>
                        <p className="text-xs text-neutral-400 mt-2">{item.condition}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center flex-col justify-center w-full">
                <Image aria-hidden src="/combofind-logo.png" alt="Globe icon" width={20} height={0} />
              </div>
              <div className="flex items-center flex-col justify-center w-full">
                <p className="text-lg text-gray-500">Nenhum resultado encontrado para "{query}". Tente outra busca!</p>
                <Button className="mt-4 ml-5 bg-blue-600" onClick={handleClear}>
                  Voltar
                </Button>
              </div>
            </>
          )
        ) : (
          <main className="flex flex-col gap-8 row-start-2 items-center w-full">
            <Image aria-hidden src="/combofind-logo.png" alt="Globe icon" width={150} height={0} />
            <div className="flex items-center w-4/12">
              <Input
                type="text"
                placeholder="Ex: Inventário Vermelho, Vermelho, Xadrez Imperial"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <Button
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                onClick={handleSearch}
              >
                <Image className="dark:invert" src="/search-icon.svg" alt="Vercel logomark" width={20} height={20} />
                Buscar
              </Button>
            </div>
            <p className="text-sm text-center font-[family-name:var(--font-geist-mono)]">
              Busque a cor ou skin desejada.
            </p>
          </main>
        )}
        <footer className="flex gap-6 flex-wrap items-center justify-center mt-10">
          <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="#" target="_blank" rel="noopener noreferrer">
            <Image aria-hidden src="/coffee-cup.png" alt="Window icon" width={16} height={16} />
            Me pague um café
          </a>
          <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="#" target="_blank" rel="noopener noreferrer">
            <Image aria-hidden src="/admin-icon.png" alt="Globe icon" width={16} height={16} />
            Admin →
          </a>
        </footer>
      </div>
    </>
  );
}
