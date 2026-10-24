import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { PREGUNTAS_QUIZ } from '../data/quiz';
import { cofradeAudio } from '../utils/audio';

interface QuizTabProps {
  onAskCapataz: (query: string) => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({ onAskCapataz }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentQ = PREGUNTAS_QUIZ[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQ.correcta) {
      setScore(prev => prev + 10);
      cofradeAudio.playLlamador(true);
    } else {
      cofradeAudio.playLlamador(false);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < PREGUNTAS_QUIZ.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCompleted(false);
  };

  const getRank = (finalScore: number) => {
    const maxScore = PREGUNTAS_QUIZ.length * 10;
    const pct = finalScore / maxScore;
    if (pct === 1) return { title: '¡Capataz Mayor de Granada!', desc: 'Conoces cada rincón del Darro, cada chicotá y cada silencio de la ciudad.', color: 'text-[var(--accent-gold)]' };
    if (pct >= 0.75) return { title: '¡Contraguía Experimentado!', desc: 'Dominas las 32 hermandades y sus momentos cumbre.', color: 'text-[var(--accent-gold)]' };
    if (pct >= 0.5) return { title: '¡Costalero Valiente!', desc: 'Buen conocedor de la Semana Santa granadina, con garra en los varales.', color: 'text-[var(--text-primary)]' };
    return { title: '¡Hermano de Luz!', desc: 'Estás aprendiendo los secretos cofrades. ¡Pregúntale a El Capataz para profundizar!', color: 'text-[var(--text-secondary)]' };
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="editorial-card rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[var(--accent-gold)] uppercase font-semibold block mb-1">
            Certamen de Sabiduría Cofrade
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--accent-gold)]" />
            <span>Trivia Cofrade Granadina</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-serif-book">
            Demuestra tu sabiduría sobre las 32 cofradías, templos y tradiciones nazaríes.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-[var(--text-muted)] block uppercase font-cinzel">Puntos</span>
          <span className="font-mono tabular-nums text-xl sm:text-2xl font-bold text-[var(--accent-gold)]">
            {score} <span className="text-xs text-[var(--text-muted)] font-serif-book font-normal">/ {PREGUNTAS_QUIZ.length * 10}</span>
          </span>
        </div>
      </div>

      {!completed ? (
        <div className="editorial-card rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Progress bar */}
          <div>
            <div className="flex justify-between items-center text-xs text-[var(--accent-gold)] font-cinzel mb-1.5 font-bold">
              <span>Pregunta {currentIndex + 1} de {PREGUNTAS_QUIZ.length}</span>
              <span className="font-mono tabular-nums">{Math.round(((currentIndex) / PREGUNTAS_QUIZ.length) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)] overflow-hidden">
              <div 
                className="h-full bg-[var(--accent-gold)] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / PREGUNTAS_QUIZ.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question text */}
          <div>
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug">
              {currentQ.pregunta}
            </h3>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.opciones.map((opcion, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === currentQ.correcta;

              let btnStyle = 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]/60';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500/10 border-emerald-600 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-500 font-semibold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-500/10 border-rose-600 text-rose-800 dark:text-rose-300 ring-1 ring-rose-500';
                } else {
                  btnStyle = 'bg-[var(--bg-card-subtle)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-50';
                }
              }

              return (
                <button
                  key={i}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(i)}
                  className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between ${btnStyle} active:scale-[0.99]`}
                >
                  <span className="font-serif-book">{opcion}</span>
                  {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation by El Capataz when answered */}
          {isAnswered && (
            <div className="bg-[var(--bg-card-subtle)] p-4 rounded-xl border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xs font-bold text-[var(--accent-gold)]">
                  Palabra del Capataz Granadino:
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-serif-book">
                {currentQ.explicacion}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => onAskCapataz(`Explícame de forma concisa más detalles sobre: ${currentQ.pregunta}`)}
                  className="text-xs text-[var(--accent-gold)] hover:text-[var(--accent-gold-hover)] underline flex items-center gap-1 font-bold font-cinzel"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Preguntar a fondo a la IA</span>
                </button>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] font-cinzel font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-[var(--accent-gold-hover)] transition ml-auto"
                >
                  <span>{currentIndex + 1 === PREGUNTAS_QUIZ.length ? 'Ver Resultados' : 'Siguiente'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Quiz Finished Screen */
        <div className="editorial-card rounded-2xl p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <h3 className="font-cinzel text-2xl font-bold text-[var(--text-primary)] mb-1">
              ¡Chicotá Completada!
            </h3>
            <p className="text-xs text-[var(--text-secondary)] font-serif-book">Has completado el certamen cofrade de Granada</p>
          </div>

          <div className="bg-[var(--bg-card-subtle)] p-5 rounded-2xl border border-[var(--border-subtle)] max-w-md mx-auto space-y-2">
            <span className="text-xs text-[var(--accent-gold)] font-cinzel uppercase font-bold tracking-wider">Tu Rango Cofrade</span>
            <h4 className={`font-cinzel text-xl font-bold ${getRank(score).color}`}>
              {getRank(score).title}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-serif-book">
              {getRank(score).desc}
            </p>
            <div className="text-2xl font-cinzel font-bold text-[var(--accent-gold)] pt-2 border-t border-[var(--border-subtle)] font-mono tabular-nums">
              {score} / {PREGUNTAS_QUIZ.length * 10} puntos
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-[var(--accent-gold)] text-[var(--accent-gold-contrast)] font-cinzel font-bold text-xs flex items-center gap-2 hover:bg-[var(--accent-gold-hover)] shadow-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repetir Quiz</span>
            </button>
            <button
              onClick={() => onAskCapataz('Ponme a prueba con una curiosidad difícil sobre la Semana Santa de Granada y dame su respuesta concisa.')}
              className="px-5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--accent-gold)]/10 border border-[var(--border-subtle)] text-[var(--accent-gold)] font-cinzel font-bold text-xs flex items-center gap-2 transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Pedirle un reto a la IA</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
