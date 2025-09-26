
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { CaptionCard } from './components/CaptionCard';
import { Loader } from './components/Loader';
import { generateCaptions } from './services/geminiService';
import type { CaptionData } from './types';

const App: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [userText, setUserText] = useState<string>('');
  const [captions, setCaptions] = useState<CaptionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (images.length === 0) {
      setError('Por favor, carregue pelo menos uma imagem.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCaptions(null);

    try {
      const generatedCaptions = await generateCaptions(images, userText);
      setCaptions(generatedCaptions);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar as legendas. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [images, userText]);

  const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  );
  const FriendlyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  );
  const ProfessionalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-teal-600">ID Implantes</h1>
        <p className="text-lg text-gray-600 mt-2">Seu Assistente de Marketing Digital com IA</p>
      </header>
      
      <main className="w-full max-w-5xl bg-white p-6 sm:p-8 rounded-2xl shadow-lg transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="flex flex-col space-y-6">
            <div>
              <label className="text-lg font-semibold text-gray-700 mb-2 block">1. Carregue suas imagens</label>
              <ImageUploader onImagesUpload={setImages} />
            </div>
            <div>
              <label htmlFor="userText" className="text-lg font-semibold text-gray-700 mb-2 block">
                2. Adicione um texto de referência (Opcional)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Forneça um exemplo de texto para que a IA possa aprender seu estilo de escrita.
              </p>
              <textarea
                id="userText"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Cole aqui um exemplo de postagem sua..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isLoading || images.length === 0}
              className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/50 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Gerando...' : 'Gerar Legendas'}
            </button>
          </div>

          {/* Output Section */}
          <div className="flex flex-col justify-center items-center bg-gray-50 p-6 rounded-lg min-h-[300px]">
            {isLoading && <Loader />}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!isLoading && !error && captions && (
              <div className="w-full space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Legendas Sugeridas</h2>
                <CaptionCard title="Tom Informativo" content={captions.informative} icon={<InfoIcon />} />
                <CaptionCard title="Tom Amigável" content={captions.friendly} icon={<FriendlyIcon />} />
                <CaptionCard title="Tom Profissional" content={captions.professional} icon={<ProfessionalIcon />} />
              </div>
            )}
            {!isLoading && !error && !captions && (
              <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                <p className="mt-2 font-semibold">Suas legendas aparecerão aqui</p>
                <p className="text-sm">Complete os passos ao lado para começar.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="w-full max-w-5xl text-center mt-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} ID Implantes. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
