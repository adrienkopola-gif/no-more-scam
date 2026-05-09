import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";

interface QuizQuestion {
  id: number;
  questionText: string;
  scenarioImageUrl: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    questionText:
      "A taxi driver in Marrakech refuses to use the meter and quotes you 200 MAD for a 5-minute ride. What should you do?",
    scenarioImageUrl: "/assets/generated/quiz-taxi-scam.dim_600x400.png",
    options: [
      "Accept the price to avoid conflict",
      "Negotiate firmly or find another taxi",
      "Pay and report later",
      "Walk instead",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Always insist on the meter or agree on a price before entering. Standard short rides in Marrakech cost 10-20 MAD.",
  },
  {
    id: 2,
    questionText:
      'A "student" approaches you offering to show you a carpet school for free. What is this likely?',
    scenarioImageUrl: "/assets/generated/quiz-carpet-shop.dim_600x400.png",
    options: [
      "A genuine cultural experience",
      "A common tourist trap leading to a high-pressure sales pitch",
      "A legitimate school tour",
      "A government tourism program",
    ],
    correctAnswerIndex: 1,
    explanation:
      'This is a classic scam. The "free tour" leads to a carpet shop where you\'ll face intense pressure to buy overpriced items.',
  },
  {
    id: 3,
    questionText:
      "You're offered 1000 MAD for 100 euros. The official rate is about 10.8 MAD per euro. Should you accept?",
    scenarioImageUrl: "/assets/generated/quiz-currency.dim_600x400.png",
    options: [
      "Yes, it's a great deal",
      "No, it's below the official rate and likely a scam",
      "It depends on the person",
      "Only if they show ID",
    ],
    correctAnswerIndex: 1,
    explanation:
      "100 euros at the official rate is about 1080 MAD. Accepting 1000 MAD means losing money, and street exchange is illegal.",
  },
  {
    id: 4,
    questionText:
      'A spice seller gives you a "free gift" of spices and then demands payment. What should you do?',
    scenarioImageUrl: "/assets/generated/quiz-market-pricing.dim_600x400.png",
    options: [
      "Pay whatever they ask",
      "Politely return the gift and walk away",
      "Argue loudly",
      "Call the police immediately",
    ],
    correctAnswerIndex: 1,
    explanation:
      'Unsolicited "gifts" are a common pressure tactic. You can politely return items and leave without obligation.',
  },
  {
    id: 5,
    questionText:
      'Someone claims to be a "licensed guide" and offers to take you to the medina. How do you verify?',
    scenarioImageUrl: "/assets/generated/quiz-fake-guide.dim_600x400.png",
    options: [
      "Trust them if they seem friendly",
      "Ask to see their official guide badge/card",
      "Follow them anyway",
      "Ignore all guides",
    ],
    correctAnswerIndex: 1,
    explanation:
      "Official guides carry a badge issued by the Ministry of Tourism. Always verify credentials before hiring.",
  },
];

export default function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = quizQuestions[currentQuestion];
  const progress = (currentQuestion / quizQuestions.length) * 100;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correctAnswerIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 >= quizQuestions.length) {
      setCompleted(true);
    } else {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-6">
        <Trophy className="h-16 w-16 mx-auto text-amber-500" />
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <p className="text-muted-foreground">
          You scored{" "}
          <span className="font-bold text-foreground">
            {score}/{quizQuestions.length}
          </span>{" "}
          ({percentage}%)
        </p>
        <div className="bg-muted rounded-xl p-4">
          {percentage >= 80 ? (
            <p className="text-green-600 font-medium">
              Excellent! You're well-prepared to travel safely in Morocco.
            </p>
          ) : percentage >= 60 ? (
            <p className="text-amber-600 font-medium">
              Good job! Review the explanations to improve your awareness.
            </p>
          ) : (
            <p className="text-destructive font-medium">
              Keep learning! Read the tips and try again.
            </p>
          )}
        </div>
        <Button onClick={handleReset} className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        <h1 className="text-xl font-bold">Scam Awareness Quiz</h1>
        <Badge variant="outline" className="ml-auto text-xs">
          {currentQuestion + 1}/{quizQuestions.length}
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="space-y-4">
        <img
          src={question.scenarioImageUrl}
          alt="Scenario"
          className="w-full h-40 object-cover rounded-xl"
        />

        <h2 className="text-base font-semibold">{question.questionText}</h2>

        <div className="space-y-2">
          {question.options.map((option, index) => {
            let variant: "outline" | "default" | "destructive" | "secondary" =
              "outline";
            if (selectedAnswer !== null) {
              if (index === question.correctAnswerIndex) variant = "default";
              else if (index === selectedAnswer) variant = "destructive";
            }
            return (
              <Button
                key={option}
                variant={variant}
                className="w-full text-left justify-start h-auto py-3 px-4 text-sm"
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                <span className="mr-2 font-bold">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {selectedAnswer !== null &&
                  index === question.correctAnswerIndex && (
                    <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
                  )}
                {selectedAnswer === index &&
                  index !== question.correctAnswerIndex && (
                    <XCircle className="h-4 w-4 ml-auto text-destructive" />
                  )}
              </Button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 space-y-2">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Explanation:
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {question.explanation}
            </p>
          </div>
        )}

        {selectedAnswer !== null && (
          <Button onClick={handleNext} className="w-full">
            {currentQuestion + 1 >= quizQuestions.length
              ? "See Results"
              : "Next Question"}
          </Button>
        )}
      </div>
    </div>
  );
}
