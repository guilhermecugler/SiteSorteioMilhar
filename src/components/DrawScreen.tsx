import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

interface LotteryConfig {
  targetNumber: string;
  date: string;
  branch: string;
  prize: string;
  drawDelay: number;
}

interface DrawScreenProps {
  config: LotteryConfig;
  setShowPasswordModal: (show: boolean) => void;
  setPasswordAction: (action: 'config' | 'draw' | null) => void;
}

const DrawScreen = forwardRef(({ config, setShowPasswordModal, setPasswordAction }: DrawScreenProps, ref) => {
  const [currentNumbers, setCurrentNumbers] = useState(['0', '0', '0', '0']);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [drawnNumbers, setDrawnNumbers] = useState<string[]>([]);
  
  const generateRandomDigit = () => {
    return Math.floor(Math.random() * 10).toString();
  };

  const startDrawing = () => {
    if (isDrawing) return; // Prevent starting while already drawing
    setIsDrawing(true);
    setCurrentDigitIndex(0);
    setDrawnNumbers([]);
    setCurrentNumbers(['0', '0', '0', '0']);
  };

  const beginDrawingProcess = useCallback(() => {
    startDrawing();
  }, []);

  // Expose beginDrawingProcess to parent
  useImperativeHandle(ref, () => ({
    beginDrawingProcess
  }));

  // Effect for continuous animation of undrawn numbers
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isDrawing) {
      intervalId = setInterval(() => {
        setCurrentNumbers(prev => {
          const newNumbers = [...prev];
          // Only animate numbers that haven't been drawn yet
          for (let i = currentDigitIndex; i < 4; i++) {
            newNumbers[i] = generateRandomDigit();
          }
          return newNumbers;
        });
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isDrawing, currentDigitIndex]);

  // Effect for drawing process
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isDrawing && currentDigitIndex < 4) {
      const targetDigits = config.targetNumber.split('');
      
      timeoutId = setTimeout(() => {
        // Draw the current digit
        setDrawnNumbers(prev => [...prev, targetDigits[currentDigitIndex]]);
        setCurrentNumbers(prev => {
          const newNumbers = [...prev];
          newNumbers[currentDigitIndex] = targetDigits[currentDigitIndex];
          return newNumbers;
        });

        // Move to next digit
        if (currentDigitIndex < 3) {
          setCurrentDigitIndex(prev => prev + 1);
        } else {
          setIsDrawing(false);
        }
      }, config.drawDelay);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isDrawing, currentDigitIndex, config.targetNumber, config.drawDelay]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <table className="w-full mb-8 border-collapse">
          <thead className="bg-black/10 backdrop-blur-sm">
            <tr>
              <th className="py-2 px-4 text-white">Data do Sorteio</th>
              <th className="py-2 px-4 text-white">Filial</th>
              <th className="py-2 px-4 text-white">Prêmio</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="py-2 px-4 text-center text-black">{config.date}</td>
              <td className="py-2 px-4 text-center text-black">{config.branch}</td>
              <td className="py-2 px-4 text-center text-black font-bold">{config.prize}</td>
            </tr>
          </tbody>
        </table>
        
        <div className="relative">
          <div className="text-white text-xl font-bold mb-4 text-center">NÚMEROS SORTEADOS:</div>
          <div className="bg-black border-2 border-yellow-400 rounded-lg p-8">
            <div className="flex justify-center gap-4">
              {currentNumbers.map((digit, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 rounded-full ${
                    index < drawnNumbers.length
                      ? 'bg-yellow-400'
                      : 'bg-yellow-300'
                  } ${
                    index === currentDigitIndex && isDrawing
                      ? 'animate-pulse'
                      : ''
                  } flex items-center justify-center transition-colors duration-300`}
                >
                  <span className="text-4xl font-bold text-black">{digit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Invisible button covering bottom of screen */}
      <div 
        onClick={startDrawing}
        className="fixed bottom-0 left-0 right-0 h-32 cursor-default"
      />
    </div>
  );
});

DrawScreen.displayName = 'DrawScreen';

export default DrawScreen;