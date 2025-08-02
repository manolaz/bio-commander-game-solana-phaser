'use client';
import { UmiProvider } from "@/providers/UmiProvider";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter";
import { TipLinkModalTheme, TipLinkWalletModalProvider, WalletDisconnectButton, WalletMultiButton } from "@tiplink/wallet-adapter-react-ui";
import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import GameWorld from "@/components/GameWorld";
import WorldNavigation from "@/components/WorldNavigation";

const Game = dynamic(() => import('@/components/Game'), { ssr: false });

require('@tiplink/wallet-adapter-react-ui/styles.css');

type GameView = 'world' | 'navigation' | 'game';

export default function Home() {
  const [currentView, setCurrentView] = useState<GameView>('world');
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('heart');
  
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const adapter = useMemo(() => new TipLinkWalletAdapter({
    title: "Bio Commander Game",
    clientId: "694bf97c-d2ac-4dfc-a786-a001812658df",
    theme: 'dark'
  }), []);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update time on client side
  useEffect(() => {
    if (!isClient) return;

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [isClient]);

  const handleEnterZone = (zoneId: string) => {
    setSelectedZone(zoneId);
    setCurrentView('game');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'world':
        return <GameWorld onEnterZone={handleEnterZone} />;
      case 'navigation':
        return <WorldNavigation onEnterZone={handleEnterZone} />;
      case 'game':
        return <Game selectedZone={selectedZone} />;
      default:
        return <GameWorld onEnterZone={handleEnterZone} />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[adapter]} autoConnect>
          <TipLinkWalletModalProvider title="Bio Commander Game" logoSrc="/assets/logo.png" theme={TipLinkModalTheme.DARK}>
            <UmiProvider>
              {/* Navigation Header */}
              <div className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm border-b border-gray-700">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-white">🌌 Bio Commander</h1>
                    
                    {/* View Navigation */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentView('world')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                          currentView === 'world'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        🌍 World Map
                      </button>
                      <button
                        onClick={() => setCurrentView('navigation')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                          currentView === 'navigation'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        📊 Progress
                      </button>
                      <button
                        onClick={() => setCurrentView('game')}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                          currentView === 'game'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        🎮 Play Game
                      </button>
                    </div>
                  </div>
                  
                  {/* Wallet Connection */}
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-300">
                      <span className="mr-2">🪙</span>
                      <span>Solana Wallet</span>
                    </div>
                    <WalletMultiButton className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors" />
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="pt-20">
                {renderCurrentView()}
              </div>

              {/* Footer */}
              <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm border-t border-gray-700 p-4">
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <div className="flex items-center space-x-6">
                    <span>🎮 Bio Commander Game</span>
                    <span>🦠 Defend the Human Body</span>
                    <span>⚡ Powered by Solana</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span>🌌 Current View: {currentView}</span>
                    <span>🕐 {isClient ? currentTime : 'Loading...'}</span>
                  </div>
                </div>
              </div>
            </UmiProvider>
          </TipLinkWalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </main>
  )
}
