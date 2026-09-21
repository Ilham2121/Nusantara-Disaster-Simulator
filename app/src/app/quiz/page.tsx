"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { earthquakeQuiz, eruptionQuiz, allQuizzes } from "@/data/quizzes";
import { QuizQuestion } from "@/simulation/types";

function QuizContent() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get("scenario");
  const disasterParam = searchParams.get("disaster");

  // Filter initial category
  const [selectedCategory, setSelectedCategory] = useState<"all" | "earthquake" | "eruption">(
    disasterParam === "eruption" || scenarioParam?.startsWith("er-")
      ? "eruption"
      : disasterParam === "earthquake" || scenarioParam?.startsWith("eq-")
      ? "earthquake"
      : "all"
  );

  const questions: QuizQuestion[] = useMemo(() => {
    if (selectedCategory === "earthquake") return earthquakeQuiz;
    if (selectedCategory === "eruption") return eruptionQuiz;
    return allQuizzes;
  }, [selectedCategory]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<{ isCorrect: boolean; selected: string }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelectOption = (key: string) => {
    if (isAnswered) return;
    setSelectedOption(key);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || isAnswered) return;

    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setHistory((prev) => [...prev, { isCorrect, selected: selectedOption }]);
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setHistory([]);
    setIsCompleted(false);
  };

  const handleCategorySwitch = (cat: "all" | "earthquake" | "eruption") => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setHistory([]);
    setIsCompleted(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-2xl mx-auto bg-[#0B0F14] text-[#F2F5F7]">
      {/* Header (§30) */}
      <div className="mb-8">
        <span className="text-xs font-mono uppercase text-[#57C7D9] font-medium tracking-wider block mb-1">
          Evaluasi Mandiri (§30)
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#F2F5F7] font-display">
          Seberapa baik kamu memahami skenarionya?
        </h1>
        <p className="text-xs text-[#A9B3BD] mt-1">
          Pertanyaan reflektif untuk menguji pemahaman proses geologi dan langkah mitigasi.
        </p>

        {/* Category Switcher */}
        {!isCompleted && (
          <div className="flex gap-2 mt-4">
            {(
              [
                { id: "all", label: "Semua Kategori" },
                { id: "earthquake", label: "Gempa Bumi" },
                { id: "eruption", label: "Erupsi Gunung Api" },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySwitch(cat.id)}
                className={`px-3 py-1.5 rounded-[8px] border text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#18212B] border-[#202B36] text-[#57C7D9]"
                    : "bg-[#111820] border-[#202B36] text-[#A9B3BD] hover:text-[#F2F5F7]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isCompleted ? (
        /* Quiz Completed Screen (§30 Format) */
        <div className="p-8 rounded-[14px] bg-[#111820] border border-[#202B36] text-left">
          <span className="text-xs font-mono uppercase tracking-wider text-[#57C7D9] block mb-2">
            Hasil Pemahaman
          </span>
          <h2 className="text-2xl font-bold text-[#F2F5F7] mb-2 font-display">
            {score} / {questions.length} benar
          </h2>
          <p className="text-xs text-[#A9B3BD] leading-relaxed mb-6">
            {score === questions.length
              ? "Kamu telah memahami seluruh konsep penting mengenai respons lingkungan dan prosedur keselamatan dalam skenario ini."
              : score >= Math.ceil(questions.length * 0.6)
              ? "Kamu sudah memahami dasar respons terhadap bencana dalam skenario ini. Beberapa detail teknis dapat diperdalam melalui pusat edukasi."
              : "Amati kembali hubungan parameter dengan guncangan di simulator untuk memperkuat pemahaman mitigasi."}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRestartQuiz}
              className="px-4 py-2.5 rounded-[10px] bg-[#18212B] hover:bg-[#202B36] border border-[#202B36] text-xs font-medium text-[#F2F5F7] transition-colors cursor-pointer"
            >
              Coba lagi
            </button>
            <Link
              href="/simulation/setup"
              className="px-4 py-2.5 rounded-[10px] bg-[#57C7D9] hover:bg-[#46B6C8] text-[#0B0F14] text-xs font-semibold transition-colors"
            >
              Eksplorasi skenario lain
            </Link>
            <Link
              href="/education"
              className="px-4 py-2.5 rounded-[10px] bg-[#111820] hover:bg-[#18212B] border border-[#202B36] text-xs font-medium text-[#A9B3BD] hover:text-[#F2F5F7] transition-colors"
            >
              Baca materi mitigasi
            </Link>
          </div>
        </div>
      ) : (
        /* Question Card Flow */
        <div className="space-y-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-[#6F7B86] font-mono">
            <span>
              Pertanyaan {currentIndex + 1} dari {questions.length}
            </span>
            <span className="capitalize text-[#A9B3BD]">
              Tingkat: {currentQ.difficulty}
            </span>
          </div>

          <div className="p-6 rounded-[14px] bg-[#111820] border border-[#202B36]">
            {/* Question Text */}
            <h3 className="text-base font-semibold text-[#F2F5F7] mb-6 leading-relaxed font-display">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5 mb-6">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrectAnswer = opt.key === currentQ.correctAnswer;

                let optionClass =
                  "border-[#202B36] bg-[#18212B]/40 hover:border-[#2C3B4A] text-[#A9B3BD] hover:text-[#F2F5F7]";

                if (isAnswered) {
                  if (isCorrectAnswer) {
                    optionClass = "border-[#63B98A]/50 bg-[#63B98A]/10 text-[#63B98A] font-medium";
                  } else if (isSelected && !isCorrectAnswer) {
                    optionClass = "border-[#D95C5C]/50 bg-[#D95C5C]/10 text-[#D95C5C]";
                  } else {
                    optionClass = "border-[#202B36] bg-[#18212B]/20 opacity-40";
                  }
                } else if (isSelected) {
                  optionClass = "border-[#57C7D9] bg-[#57C7D9]/10 text-[#F2F5F7]";
                }

                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`p-3.5 rounded-[10px] border transition-colors flex items-start gap-3 cursor-pointer text-xs leading-relaxed ${optionClass}`}
                  >
                    <span className="font-mono font-bold shrink-0">{opt.key}.</span>
                    <span>{opt.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Actions & Explanation */}
            {!isAnswered ? (
              <button
                disabled={!selectedOption}
                onClick={handleSubmitAnswer}
                className={`w-full py-2.5 px-4 rounded-[10px] text-xs font-semibold transition-colors ${
                  selectedOption
                    ? "bg-[#57C7D9] text-[#0B0F14] hover:bg-[#46B6C8] cursor-pointer"
                    : "bg-[#18212B] text-[#6F7B86] border border-[#202B36] cursor-not-allowed"
                }`}
              >
                Pilih jawaban
              </button>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* Explanation Card */}
                <div className="p-4 rounded-[10px] bg-[#18212B] border border-[#202B36]">
                  <div className="text-[11px] font-mono uppercase font-semibold text-[#57C7D9] mb-1">
                    Penjelasan Ilmiah:
                  </div>
                  <p className="text-xs text-[#A9B3BD] leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full py-2.5 px-4 rounded-[10px] bg-[#57C7D9] hover:bg-[#46B6C8] text-[#0B0F14] text-xs font-semibold transition-colors cursor-pointer"
                >
                  {currentIndex + 1 < questions.length ? "Pertanyaan berikutnya →" : "Lihat ringkasan evaluasi →"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center text-[#A9B3BD] text-xs font-mono">Memuat kuis...</div>}>
      <QuizContent />
    </Suspense>
  );
}
