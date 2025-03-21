import React, { useState } from 'react';

interface LotteryConfig {
  targetNumber: string;
  date: string;
  branch: string;
  prize: string;
  drawDelay: number;
}

interface ConfigScreenProps {
  config: LotteryConfig;
  onSave: (config: LotteryConfig) => void;
  onClose: () => void;
}

function ConfigScreen({ config, onSave, onClose }: ConfigScreenProps) {
  const [formData, setFormData] = useState(config);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!/^\d{4}$/.test(formData.targetNumber)) {
      setError('Por favor, insira exatamente 4 dígitos para o número');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Configurar Sorteio</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
              Número da Milhar (4 dígitos)
            </label>
            <input
              type="text"
              id="number"
              value={formData.targetNumber}
              onChange={(e) => {
                setFormData({ ...formData, targetNumber: e.target.value });
                setError('');
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              maxLength={4}
              pattern="\d*"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Data do Sorteio
            </label>
            <input
              type="text"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
              Filial
            </label>
            <input
              type="text"
              id="branch"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="prize" className="block text-sm font-medium text-gray-700 mb-1">
              Prêmio
            </label>
            <input
              type="text"
              id="prize"
              value={formData.prize}
              onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="drawDelay" className="block text-sm font-medium text-gray-700 mb-1">
              Tempo entre sorteios: {formData.drawDelay / 1000} segundos
            </label>
            <input
              type="range"
              id="drawDelay"
              min="500"
              max="5000"
              step="500"
              value={formData.drawDelay}
              onChange={(e) => setFormData({ ...formData, drawDelay: Number(e.target.value) })}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfigScreen;