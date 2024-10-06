import Image from "next/image";
import localFont from "next/font/local";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { DotSelector } from "../components/ui/dotSelector";
import { useEffect, useState } from "react";
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

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
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filteredGuns, setFilteredGuns] = useState([]);
  const [budget, setBudget] = useState("Medium");
  const [loading, setLoading] = useState(false);
  const [filteredSkins, setFilteredSkins] = useState([]);
  const [availableSkins, setAvailableSkins] = useState([]);
  const [availableCollections, setAvailableCollections] = useState([]);

  useEffect(() => {
    const fetchSkins = async () => {
      try {
        const response = await fetch("https://localhost:7233/api/Collection");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();

        const allGuns = result.data.flatMap((item) => item.guns);
        setAvailableSkins(allGuns);
      } catch (error) {
        console.error("Erro ao buscar skins:", error);
      }
    };

    fetchSkins();
  }, []);

  const handleSearch = async () => {
    setShowResults(true);
    setLoading(true);
    try {
      const response = await fetch(`https://localhost:7233/api/Collection?search=${encodeURIComponent(query)}&budget=${budget}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setAvailableCollections(result.data);

      if (result.success) {
        // Normalizar a query do usuário para garantir correspondência exata
        const normalizedQuery = query.toLowerCase().trim();

        // Filtrar coleções que possuem a skin exata
        const filteredCollections = result.data.filter((collection) => {
          // Filtrar as guns da coleção que correspondem à pesquisa exata
          const matchingGuns = collection.guns.filter(
            (gun) => gun.name.toLowerCase().trim() === normalizedQuery
          );
          // Se houver "guns" correspondentes, manter a coleção
          return matchingGuns.length > 0;
        });

        const filteredGuns = filteredCollections
          .filter((collection) => collection.budget === budget) // Filtra as coleções com o budget igual ao estado
          .flatMap((collection) => collection.guns); // Depois, extrai as armas de cada coleção filtrada

        // Agora temos as coleções filtradas
        setFilteredGuns(filteredGuns);
        setAvailableCollections(filteredCollections);
      } else {
        console.error("Erro na resposta:", result.message);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setShowResults(false);
    setFilteredGuns([]);
    setBudget("Medium");
    setFilteredSkins([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 3) {
      // Filtrar skins que correspondem à query e remover duplicatas
      const filtered = availableSkins
        .filter((skin) => skin.name.toLowerCase().includes(value.toLowerCase()))
        .reduce((uniqueSkins, currentSkin) => {
          // Usar um Set para garantir que apenas skins únicas sejam adicionadas
          if (!uniqueSkins.some((skin) => skin.name === currentSkin.name)) {
            uniqueSkins.push(currentSkin);
          }
          return uniqueSkins;
        }, [])
        .slice(0, 7); // Limitar a exibição a 7 skins

      setFilteredSkins(filtered);
    } else {
      setFilteredSkins([]);
    }
  };

  const handleSelectSkin = (skin) => {
    setQuery(skin.name);
    setFilteredSkins([]);
  };

  return (
    <>
      {showResults && filteredGuns.length > 0 ? (
        <div className="flex items-baseline gap-4">
          <Button className="mt-4 ml-5 bg-blue-600" onClick={handleClear}>
            Voltar
          </Button>
          <p className="text-md text-gray-500">
            Resultados encontrados para: "{query}" e com budget "{budget}".
          </p>
        </div>
      ) : null}
      <div
        className={`${geistSans.variable} ${geistMono.variable} flex flex-col justify-between items-center h-[90vh] font-[family-name:var(--font-geist-sans)]`}
      >
        {loading ? (
          <div
            role="status"
            className="flex items-center justify-center min-h-screen"
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : showResults ? (
          filteredGuns.length > 0 ? (
            <>
              <div className="w-full mt-10">
                {availableCollections.map((c) => {
                  return (
                    <Accordion
                      type="single"
                      collapsible
                      className="w-full max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg border border-gray-700"
                      key={c.id}
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="flex justify-between items-center p-4 bg-gray-700 rounded-t-lg hover:bg-gray-600 transition-colors duration-200 text-lg text-white font-semibold">
                          <span>Inventário {c.color}</span>
                          <svg
                            className="w-6 h-6 text-white transform transition-transform duration-300 group-aria-expanded:rotate-180"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </AccordionTrigger>

                        <AccordionContent className="bg-gray-800 p-6 rounded-b-lg transition-all duration-300 ease-in-out">
                          <div className="flex flex-col items-center w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                              {c.guns.map((gun) => (
                                <div
                                  key={gun.id}
                                  className="bg-gray-900 p-5 rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700"
                                >
                                  <div className="h-32 flex justify-center items-center">
                                    <img
                                      src={gun.image}
                                      alt={gun.name}
                                      className="w-full object-cover rounded-md"
                                    />
                                  </div>

                                  <div className="mt-4 text-left">
                                    <h3 className="text-2xl font-bold text-white">
                                      {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      }).format(gun.averagePrice ?? 0)}
                                    </h3>
                                    <p className="text-xs text-neutral-400">
                                      Média de preço (steam)
                                    </p>
                                  </div>
                                  <div className="text-left mt-2">
                                    <p className="text-xs text-neutral-400">
                                      {gun.classType}
                                    </p>
                                    <h3 className="text-lg font-semibold text-white">
                                      {gun.name}
                                    </h3>
                                    <p className="text-xs text-neutral-400 mt-1">
                                      {gun.condition}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center flex-col justify-center w-full h-[95vh] gap-6">
              <Image
                aria-hidden
                src="/combofind-logo.png"
                alt="Globe icon"
                width={20}
                height={0}
              />
              <p className="text-lg text-gray-500">
                Nenhum resultado encontrado para "{query}" e com budget "
                {budget}". Tente outra busca!
              </p>
              <Button className="mt-4 ml-5 bg-blue-600" onClick={handleClear}>
                Voltar
              </Button>
            </div>
          )
        ) : (
          <main className="flex flex-col gap-8 row-start-2 items-center w-full p-8 mt-36">
            <Image
              aria-hidden
              src="/combofind-logo.png"
              alt="Globe icon"
              width={150}
              height={0}
            />
            <div className="relative w-4/12">
              <Input
                type="text"
                placeholder="Ex: Inventário Vermelho, Vermelho, Xadrez Imperial"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              {filteredSkins.length > 0 && (
                <ul className="absolute bg-gray-800 shadow-lg z-10 w-full max-h-60 overflow-y-auto border border-gray-300 mt-1 rounded-lg">
                  {filteredSkins.map((skin, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSkin(skin)}
                      className="cursor-pointer hover:bg-gray-900 p-2"
                    >
                      {skin.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-col items-center gap-6">
              <p className="text-sm text-center font-[family-name:var(--font-geist-mono)]">
                Selecione o budget desejado:
              </p>
              <DotSelector onSelect={setBudget} />
            </div>
            <div className="flex gap-4 items-center flex-col sm:flex-row">
              <Button
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                onClick={handleSearch}
              >
                <Image
                  className="dark:invert"
                  src="/search-icon.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20}
                />
                Buscar
              </Button>
            </div>
          </main>
        )}
        <footer className="flex gap-6 flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/coffee-cup.png"
              alt="Window icon"
              width={16}
              height={16}
            />
            Me pague um café
          </a>
          <Link href="/login" passHref>
            <div
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/admin-icon.png"
                alt="Globe icon"
                width={16}
                height={16}
              />
              Admin →
            </div>
          </Link>
        </footer>
      </div>
    </>
  );
}
