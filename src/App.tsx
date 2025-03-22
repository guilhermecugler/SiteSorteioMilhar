import React, { useState, useEffect, useRef } from 'react';
import { Settings2 } from 'lucide-react';
import ConfigScreen from './components/ConfigScreen';
import DrawScreen from './components/DrawScreen';
import PasswordModal from './components/PasswordModal';

interface LotteryConfig {
  targetNumber: string;
  date: string;
  branch: string;
  prize: string;
  drawDelay: number;
}

interface DrawScreenRef {
  beginDrawingProcess: () => void;
}

const DEFAULT_CONFIG: LotteryConfig = {
  targetNumber: '8944',
  date: '19/03/2025',
  branch: 'VITORIA-PE',
  prize: 'R$19.000,00',
  drawDelay: 2000
};

function App() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordAction, setPasswordAction] = useState<'config' | 'draw' | null>(null);
  const drawScreenRef = useRef<DrawScreenRef>(null);
  const [config, setConfig] = useState<LotteryConfig>(DEFAULT_CONFIG);

  const handleSettingsClick = () => {
    setPasswordAction('config');
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    setIsAuthenticated(true);
    if (passwordAction === 'config') {
      setIsConfigOpen(true);
    }
  };

  const handleConfigSave = (newConfig: LotteryConfig) => {
    setConfig(newConfig);
    setIsConfigOpen(false);
  };

  // Show password modal when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setShowPasswordModal(true);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated && showPasswordModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-500">
        <PasswordModal
          onSuccess={handlePasswordSuccess}
          onClose={() => {}} // Disable close button when not authenticated
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-500">
      <nav className="bg-white/10 backdrop-blur-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Sorteio de Milhar</h1>
          <button
            onClick={handleSettingsClick}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            title="Configurações"
          >
            <Settings2 className="text-white" size={24} />
          </button>
        </div>
      </nav>

      {showPasswordModal && isAuthenticated && (
        <PasswordModal
          onSuccess={handlePasswordSuccess}
          onClose={() => setShowPasswordModal(false)}
        />
      )}

      {isConfigOpen ? (
        <ConfigScreen
          config={config}
          onSave={handleConfigSave}
          onClose={() => setIsConfigOpen(false)}
        />
      ) : (
        <DrawScreen 
          config={config}
          setShowPasswordModal={setShowPasswordModal}
          setPasswordAction={setPasswordAction}
          ref={drawScreenRef}
        />
      )}
    </div>
  );
}

export default App;