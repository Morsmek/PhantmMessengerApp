import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { useIdentityStore } from '@/stores/identityStore';
import { useToastStore } from '@/stores/toastStore';
import { ConfettiEffect } from '@/components/ConfettiEffect';

interface LocationState {
  words: string[];
}

interface QuizRound {
  targetIndex: number;
  options: string[];
  correctAnswer: string;
}

export function PassphraseConfirmScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const words = state?.words || [];
  const addToast = useToastStore((s) => s.addToast);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const rounds = useMemo<QuizRound[]>(() => {
    if (words.length !== 20) return [];
    const usedIndices = new Set<number>();
    const result: QuizRound[] = [];

    while (result.length < 3) {
      let targetPos: number;
      do { targetPos = Math.floor(Math.random() * 20); } while (usedIndices.has(targetPos));
      usedIndices.add(targetPos);

      const correctWord = words[targetPos];
      const wrongWords: string[] = [];
      const usedWrong = new Set<number>([targetPos]);
      while (wrongWords.length < 3) {
        let wPos: number;
        do { wPos = Math.floor(Math.random() * 20); } while (usedWrong.has(wPos));
        usedWrong.add(wPos);
        wrongWords.push(words[wPos]);
      }

      const allOptions = [correctWord, ...wrongWords];
      for (let i = allOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
      }

      result.push({ targetIndex: targetPos + 1, options: allOptions, correctAnswer: correctWord });
    }
    return result;
  }, [words]);

  const [currentRound, setCurrentRound] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [correctFlash, setCorrectFlash] = useState(false);

  const round = rounds[currentRound];

  const handleSelect = (option: string) => {
    if (completed || correctFlash) return;
    setSelectedOption(option);
    setIsWrong(false);
  };

  const handleConfirm = () => {
    if (!selectedOption || !round || correctFlash) return;

    if (selectedOption === round.correctAnswer) {
      setIsWrong(false);
      setCorrectFlash(true);
      if (currentRound < rounds.length - 1) {
        setTimeout(() => {
          setCurrentRound((prev) => prev + 1);
          setSelectedOption(null);
          setCorrectFlash(false);
        }, 600);
      } else {
        setTimeout(() => {
          setCompleted(true);
          setShowConfetti(true);
          useIdentityStore.setState({ isOnboarded: true });
          addToast('Identity created successfully!', 'success');
          setTimeout(() => {
            navigate('/chats', { replace: true });
          }, 2000);
        }, 600);
      }
    } else {
      setIsWrong(true);
    }
  };

  if (words.length !== 20) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]" style={{ background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Error: No recovery phrase found.</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-[100dvh] relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <ConfettiEffect trigger={showConfetti} />

      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none transition-opacity duration-1000"
        style={{
          background: completed
            ? 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(233,30,99,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Progress Bar */}
      <div className="px-5 pt-6 relative z-10">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--bg-surface)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: i < currentRound ? '100%' : i === currentRound ? '0%' : '0%',
                  background: i < currentRound ? 'var(--success)' : i === currentRound ? 'var(--accent-pink)' : 'var(--text-muted)',
                  opacity: i > currentRound ? 0.3 : 1,
                  animation: i === currentRound && !completed && !correctFlash ? 'shimmer-sweep 2s linear infinite' : 'none',
                }}
              />
            </div>
          ))}
        </div>
        <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
          {completed ? 'Complete!' : `Step ${currentRound + 1} of 3`}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 relative z-10">
        {completed ? (
          <div className="flex flex-col items-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-scale-in animate-neon-glow-strong"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                animationDelay: '100ms',
                animationFillMode: 'both',
              }}
            >
              <Sparkles size={36} style={{ color: 'var(--success)' }} />
            </div>
            <h2
              className="text-2xl font-bold animate-fade-in"
              style={{ color: 'var(--text-primary)', animationDelay: '300ms', animationFillMode: 'both' }}
            >
              All Correct!
            </h2>
            <p
              className="text-sm mt-2 animate-fade-in"
              style={{ color: 'var(--text-secondary)', animationDelay: '400ms', animationFillMode: 'both' }}
            >
              Your identity is secured. Welcome to Phantm.
            </p>
            {/* Loading bar to auto-redirect */}
            <div className="w-48 h-1 rounded-full mt-6 overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, var(--accent-pink), var(--success))',
                  animation: 'shimmer-sweep 2s ease-out forwards',
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <p
              className="text-sm text-center uppercase tracking-wider animate-fade-in"
              style={{ color: 'var(--text-secondary)', animationFillMode: 'both' }}
            >
              Pick the correct word
            </p>
            <h2
              className="text-4xl font-bold mt-3 text-center animate-scale-in"
              style={{
                color: 'var(--accent-pink)',
                fontFamily: 'var(--font-mono)',
                textShadow: '0 0 20px rgba(233, 30, 99, 0.3)',
                animationDelay: '100ms',
                animationFillMode: 'both',
              }}
            >
              Word #{round?.targetIndex}
            </h2>
            <p
              className="text-sm mt-2 text-center max-w-xs animate-fade-in"
              style={{ color: 'var(--text-muted)', animationDelay: '200ms', animationFillMode: 'both' }}
            >
              Which of these was word number {round?.targetIndex} in your recovery phrase?
            </p>

            {/* Options Grid - 2x2 with staggered entrance */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-8">
              {round?.options.map((option, i) => {
                const isSelected = selectedOption === option;
                const showCorrect = isSelected && correctFlash;
                const showError = isSelected && isWrong;

                return (
                  <button
                    key={`${currentRound}-${i}`}
                    onClick={() => handleSelect(option)}
                    className={`relative rounded-xl py-5 px-4 text-center text-base font-medium transition-all active:scale-[0.97] ${
                      mounted ? 'animate-scale-in' : 'opacity-0'
                    }`}
                    style={{
                      background: showCorrect
                        ? 'rgba(16, 185, 129, 0.15)'
                        : showError
                        ? 'rgba(239, 68, 68, 0.15)'
                        : isSelected
                        ? 'rgba(233, 30, 99, 0.1)'
                        : 'var(--bg-surface)',
                      border: `2px solid ${
                        showCorrect
                          ? 'var(--success)'
                          : showError
                          ? 'var(--error)'
                          : isSelected
                          ? 'var(--accent-pink)'
                          : 'rgba(61, 61, 77, 0.4)'
                      }`,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      boxShadow: showCorrect
                        ? '0 0 16px rgba(16, 185, 129, 0.3)'
                        : showError
                        ? '0 0 16px rgba(239, 68, 68, 0.3)'
                        : isSelected
                        ? '0 0 12px rgba(233, 30, 99, 0.2)'
                        : 'none',
                      animationDelay: `${300 + i * 100}ms`,
                      animationFillMode: 'both',
                    }}
                  >
                    {option}
                    {showCorrect && (
                      <Check
                        size={18}
                        className="absolute top-2 right-2"
                        style={{ color: 'var(--success)' }}
                      />
                    )}
                    {showError && (
                      <AlertCircle
                        size={18}
                        className="absolute top-2 right-2"
                        style={{ color: 'var(--error)' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Error Message */}
            {isWrong && (
              <div className="flex items-center gap-2 mt-4 animate-shake">
                <AlertCircle size={16} style={{ color: 'var(--error)' }} />
                <p className="text-sm" style={{ color: 'var(--error)' }}>
                  Incorrect. Try again.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirm Button */}
      {!completed && (
        <div className="px-5 pb-8 relative z-10">
          <button
            onClick={handleConfirm}
            disabled={!selectedOption || correctFlash}
            className="w-full h-14 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all animate-fade-in"
            style={{
              background: selectedOption ? 'var(--accent-pink)' : 'var(--text-muted)',
              color: selectedOption ? '#fff' : 'var(--bg-primary)',
              opacity: selectedOption && !correctFlash ? 1 : 0.5,
              boxShadow: selectedOption ? '0 0 20px rgba(233, 30, 99, 0.3)' : 'none',
              animationDelay: '700ms',
              animationFillMode: 'both',
            }}
          >
            {currentRound < 2 ? 'Next' : 'Confirm'}
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
