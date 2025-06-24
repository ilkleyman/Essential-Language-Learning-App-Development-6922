import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './components/LanguageSelector';
import JourneySelector from './components/JourneySelector';
import QuizCard from './components/QuizCard';
import RoundSummary from './components/RoundSummary';
import HighScores from './components/HighScores';
import MasteryScreen from './components/MasteryScreen';
import StageDowngradeMessage from './components/StageDowngradeMessage';
import SafeIcon from './common/SafeIcon';
import { languages } from './data/languages';
import { SpacedRepetitionManager } from './utils/spacedRepetition';
import { AudioManager } from './utils/audio';
import { generateSimilarSoundingWords, generateRandomWords, getSimilarSounds } from './utils/wordUtils';
import * as FiIcons from 'react-icons/fi';

const { FiTrophy, FiHome, FiVolume2 } = FiIcons;

function App() {
  const [gameState, setGameState] = useState('language-select'); // language-select, journey-select, quiz, round-summary, mastery
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState('bronze');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [roundWords, setRoundWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [roundStats, setRoundStats] = useState({
    correctAnswers: 0,
    totalWords: 0,
    newWords: 0,
    partiallyMastered: 0,
    fullyMastered: 0,
    totalResponseTime: 0,
    responses: [] // Track individual response times
  });
  const [showHighScores, setShowHighScores] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [masteredWord, setMasteredWord] = useState(null);
  const [stageDowngrade, setStageDowngrade] = useState(null);
  const [progress, setProgress] = useState({ bronze: 0, silver: 0, gold: 0 });
  const [srManager] = useState(new SpacedRepetitionManager());
  const [audioManager] = useState(new AudioManager());
  const [waitingForDowngradeMessage, setWaitingForDowngradeMessage] = useState(false);

  // Stage names mapping
  const stageNames = {
    1: 'Duo Pick',
    2: 'Trio Choice',
    3: 'Quad Quest',
    4: 'Speedy Four',
    5: 'Audio Duo',
    6: 'Audio Trio',
    7: 'Audio Quad',
    8: 'Wild Card',
    9: 'Sound Clash'
  };

  useEffect(() => {
    // Load saved data
    srManager.load();
    loadHighScores();
    loadProgress();
  }, []);

  const loadHighScores = () => {
    const saved = localStorage.getItem('highScores');
    if (saved) {
      setHighScores(JSON.parse(saved));
    }
  };

  const saveHighScore = (score) => {
    const newScore = {
      name: 'Player',
      score: score.totalScore,
      accuracy: score.accuracy,
      language: languages[selectedLanguage].name,
      level: selectedLevel,
      date: Date.now()
    };

    const updated = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setHighScores(updated);
    localStorage.setItem('highScores', JSON.stringify(updated));

    // Check if it's a new high score (top 3)
    const isHighScore = updated.indexOf(newScore) < 3;
    if (isHighScore) {
      audioManager.play('trumpet');
    }
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('learningProgress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  };

  const saveProgress = () => {
    localStorage.setItem('learningProgress', JSON.stringify(progress));
  };

  const getCurrentLevel = () => {
    // Determine current level based on progress
    if (progress.bronze < 20) return 'bronze';
    if (progress.silver < 30) return 'silver';
    return 'gold';
  };

  const generateQuiz = (word, stage) => {
    const allWords = languages[selectedLanguage].words[selectedLevel];

    // Determine number of options and behavior based on stage
    let numOptions, timeLimit = null, audioMode = false, useRandomWords = false, useSimilarSounds = false;

    switch (stage) {
      case 1: // Duo Pick
        numOptions = 2;
        break;
      case 2: // Trio Choice
        numOptions = 3;
        break;
      case 3: // Quad Quest
        numOptions = 4;
        break;
      case 4: // Speedy Four
        numOptions = 4;
        timeLimit = 5;
        break;
      case 5: // Audio Duo
        numOptions = 2;
        audioMode = true;
        break;
      case 6: // Audio Trio
        numOptions = 3;
        audioMode = true;
        break;
      case 7: // Audio Quad
        numOptions = 4;
        audioMode = true;
        break;
      case 8: // Wild Card
        numOptions = 4;
        audioMode = true;
        useRandomWords = true;
        break;
      case 9: // Sound Clash
        numOptions = 4;
        audioMode = true;
        useSimilarSounds = true;
        break;
      default:
        numOptions = 2;
    }

    // Create incorrect options based on stage
    let incorrectOptions = [];

    if (useSimilarSounds) {
      // Stage 9: Use similar sounding words to the TRANSLATION (answer), not the question
      const similarWords = getSimilarSounds(word.translation, numOptions - 1);
      incorrectOptions = similarWords.map(w => w.translation || w.english);
    } else if (useRandomWords) {
      // Stage 8: Use random words from the language (mix all levels)
      const allLanguageWords = [
        ...(languages[selectedLanguage].words.bronze || []),
        ...(languages[selectedLanguage].words.silver || []),
        ...(languages[selectedLanguage].words.gold || [])
      ];
      const randomWords = generateRandomWords(word, allLanguageWords, numOptions - 1);
      incorrectOptions = randomWords.map(w => w.translation);
    } else {
      // Stages 1-7: Use words from same level
      incorrectOptions = allWords
        .filter(w => w.english !== word.english)
        .sort(() => Math.random() - 0.5)
        .slice(0, numOptions - 1)
        .map(w => w.translation);
    }

    let options, audioOptions, correctAnswer, correctAnswerIndex;

    if (audioMode) {
      // Create all options (correct + incorrect)
      const allOptions = [word.translation, ...incorrectOptions];
      
      // Shuffle the options to randomize positions
      const shuffledOptions = [...allOptions].sort(() => Math.random() - 0.5);
      
      // Find where the correct answer ended up after shuffling
      correctAnswerIndex = shuffledOptions.findIndex(option => option === word.translation);
      
      // audioOptions is the shuffled sequence (this is what gets spoken in order)
      audioOptions = shuffledOptions;
      
      // Options shown to user are "Option 1", "Option 2", etc.
      options = shuffledOptions.map((_, index) => `Option ${index + 1}`);
      
      // The correct answer is the option number where the correct translation is located
      correctAnswer = `Option ${correctAnswerIndex + 1}`;
    } else {
      // Regular mode - create shuffled options array
      options = [word.translation, ...incorrectOptions]
        .sort(() => Math.random() - 0.5);
      
      audioOptions = [];
      correctAnswer = word.translation;
      correctAnswerIndex = options.findIndex(option => option === word.translation);
    }

    return {
      question: word.english,
      options,
      correctAnswer,
      correctAnswerIndex,
      stage,
      stageName: stageNames[stage],
      timeLimit,
      audioMode,
      audioOptions,
      word
    };
  };

  const startRound = () => {
    const wordsToReview = srManager.getWordsForReview(
      languages[selectedLanguage].words[selectedLevel],
      20
    );

    let selectedWords = [];
    if (wordsToReview.length >= 20) {
      selectedWords = wordsToReview.slice(0, 20);
    } else {
      // Fill remaining slots with random words
      const allWords = languages[selectedLanguage].words[selectedLevel];
      const remainingWords = allWords
        .filter(word => !wordsToReview.find(w => w.english === word.english))
        .sort(() => Math.random() - 0.5);
      
      selectedWords = [...wordsToReview, ...remainingWords].slice(0, 20);
    }

    setRoundWords(selectedWords);
    setCurrentWordIndex(0);
    setRoundStats({
      correctAnswers: 0,
      totalWords: 0,
      newWords: 0,
      partiallyMastered: 0,
      fullyMastered: 0,
      totalResponseTime: 0,
      responses: []
    });
    setGameState('quiz');
  };

  const handleAnswer = (correct, responseTime = 3) => {
    const currentWord = roundWords[currentWordIndex];
    const wordData = srManager.updateWord(currentWord.english, correct);

    // Convert responseTime from milliseconds to seconds if needed
    const responseTimeInSeconds = responseTime > 100 ? responseTime / 1000 : responseTime;

    // Update stats with corrected timing
    setRoundStats(prev => ({
      ...prev,
      correctAnswers: prev.correctAnswers + (correct ? 1 : 0),
      totalWords: prev.totalWords + 1,
      totalResponseTime: prev.totalResponseTime + responseTimeInSeconds,
      responses: [...prev.responses, responseTimeInSeconds]
    }));

    // Show stage downgrade message if word moved down
    if (wordData.stageChanged && wordData.stageDirection === 'down') {
      setStageDowngrade({
        word: currentWord,
        previousStage: wordData.previousStage,
        newStage: wordData.stage
      });
      setWaitingForDowngradeMessage(true);
      return; // Don't proceed to next question yet
    }

    // Check if word was mastered (stage 8 is mastery, but can continue to stage 9)
    if (wordData.stage === 8 && !wordData.mastered) {
      wordData.mastered = true;
      setMasteredWord(currentWord);
      setGameState('mastery');
      audioManager.play('levelUp');
      return;
    }

    // Move to next word or end round
    proceedToNextQuestion();

    // Save progress
    srManager.save();
  };

  const proceedToNextQuestion = () => {
    if (currentWordIndex < roundWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      endRound();
    }
  };

  const handleDowngradeMessageComplete = () => {
    setStageDowngrade(null);
    setWaitingForDowngradeMessage(false);
    
    // Check if word was mastered after showing downgrade message
    const currentWord = roundWords[currentWordIndex];
    const wordData = srManager.getWordData(currentWord.english);
    
    if (wordData.stage === 8 && !wordData.mastered) {
      wordData.mastered = true;
      setMasteredWord(currentWord);
      setGameState('mastery');
      audioManager.play('levelUp');
      return;
    }

    // Now proceed to next question
    proceedToNextQuestion();
    
    // Save progress
    srManager.save();
  };

  const endRound = () => {
    // Calculate final stats
    const allWords = languages[selectedLanguage].words[selectedLevel];
    const finalStats = srManager.getStats(allWords);

    // Calculate scores with corrected formula
    const accuracy = Math.round((roundStats.correctAnswers / roundStats.totalWords) * 100);
    
    // Fix timing calculations - ensure we're working in seconds
    const avgResponseTime = roundStats.responses.length > 0 
      ? roundStats.responses.reduce((sum, time) => sum + time, 0) / roundStats.responses.length
      : 3;
    
    const totalTime = roundStats.responses.reduce((sum, time) => sum + time, 0);

    // New scoring algorithm (out of 1000)
    // 60% accuracy, 20% speed (lower is better), 20% total time (lower is better)
    const accuracyScore = (accuracy / 100) * 600; // 0-600 points
    
    // Speed score - optimal response time is 1-3 seconds
    const speedScore = Math.max(0, 200 - (Math.max(0, avgResponseTime - 1) * 40)); // 0-200 points
    
    // Total time score - optimal total time is 20-60 seconds for 20 questions
    const timeScore = Math.max(0, 200 - (Math.max(0, totalTime - 20) * 2)); // 0-200 points
    
    const totalScore = Math.round(accuracyScore + speedScore + timeScore);

    const updatedStats = {
      ...roundStats,
      ...finalStats,
      accuracy,
      avgResponseTime,
      totalTime,
      accuracyScore: Math.round(accuracyScore),
      speedScore: Math.round(speedScore),
      timeScore: Math.round(timeScore),
      totalScore
    };

    setRoundStats(updatedStats);

    // Save high score
    saveHighScore(updatedStats);

    // Update progress
    const newProgress = { ...progress };
    newProgress[selectedLevel] = finalStats.fullyMastered;
    setProgress(newProgress);
    saveProgress();

    setGameState('round-summary');
  };

  const playAudio = (text) => {
    const langCode = selectedLanguage === 'spanish' ? 'es-ES' : 'hu-HU';
    audioManager.speak(text, langCode);
  };

  useEffect(() => {
    if (gameState === 'quiz' && roundWords.length > 0 && !waitingForDowngradeMessage) {
      const currentWord = roundWords[currentWordIndex];
      const wordData = srManager.getWordData(currentWord.english);
      const quiz = generateQuiz(currentWord, wordData.stage);
      setCurrentQuiz(quiz);
    }
  }, [gameState, currentWordIndex, roundWords, waitingForDowngradeMessage]);

  const resetGame = () => {
    setGameState('language-select');
    setSelectedLanguage(null);
    setSelectedLevel('bronze');
    setCurrentQuiz(null);
    setRoundWords([]);
    setCurrentWordIndex(0);
    setMasteredWord(null);
    setStageDowngrade(null);
    setWaitingForDowngradeMessage(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Language Master
          </motion.h1>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHighScores(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <SafeIcon icon={FiTrophy} className="w-5 h-5 text-gold-500" />
              <span className="font-medium text-gray-700">High Scores</span>
            </motion.button>

            {gameState !== 'language-select' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <SafeIcon icon={FiHome} className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-700">Home</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {gameState === 'language-select' && (
            <motion.div
              key="language-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageSelect={(lang) => {
                  setSelectedLanguage(lang);
                  setSelectedLevel(getCurrentLevel());
                  setGameState('journey-select');
                }}
              />
            </motion.div>
          )}

          {gameState === 'journey-select' && (
            <motion.div
              key="journey-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <JourneySelector
                language={languages[selectedLanguage]}
                onContinue={startRound}
                progress={progress}
                currentLevel={getCurrentLevel()}
              />
            </motion.div>
          )}

          {gameState === 'quiz' && currentQuiz && !waitingForDowngradeMessage && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-4 text-center">
                <div className="text-lg font-semibold text-gray-600">
                  Question {currentWordIndex + 1} of 20
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
                    style={{ width: `${((currentWordIndex + 1) / 20) * 100}%` }}
                  />
                </div>
              </div>

              <QuizCard
                question={currentQuiz.question}
                options={currentQuiz.options}
                correctAnswer={currentQuiz.correctAnswer}
                correctAnswerIndex={currentQuiz.correctAnswerIndex}
                stage={currentQuiz.stage}
                stageName={currentQuiz.stageName}
                onAnswer={handleAnswer}
                timeLimit={currentQuiz.timeLimit}
                audioMode={currentQuiz.audioMode}
                audioOptions={currentQuiz.audioOptions}
                onPlayAudio={playAudio}
              />
            </motion.div>
          )}

          {gameState === 'round-summary' && (
            <motion.div
              key="round-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RoundSummary
                stats={roundStats}
                onContinue={startRound}
                onMainMenu={() => setGameState('journey-select')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showHighScores && (
          <HighScores
            scores={highScores}
            onClose={() => setShowHighScores(false)}
          />
        )}

        {gameState === 'mastery' && masteredWord && (
          <MasteryScreen
            word={masteredWord}
            onContinue={() => {
              setMasteredWord(null);
              if (currentWordIndex < roundWords.length - 1) {
                setCurrentWordIndex(prev => prev + 1);
                setGameState('quiz');
              } else {
                endRound();
              }
            }}
          />
        )}

        {stageDowngrade && (
          <StageDowngradeMessage
            word={stageDowngrade.word}
            previousStage={stageDowngrade.previousStage}
            newStage={stageDowngrade.newStage}
            onComplete={handleDowngradeMessageComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;