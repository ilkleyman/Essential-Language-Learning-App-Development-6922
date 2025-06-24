// Spaced Repetition Algorithm using SM-2 (SuperMemo 2)
export class SpacedRepetitionManager {
  constructor() {
    this.words = new Map();
  }

  // Initialize or get word data
  getWordData(wordId) {
    if (!this.words.has(wordId)) {
      this.words.set(wordId, {
        id: wordId,
        stage: 1,
        easiness: 2.5,
        interval: 1,
        repetitions: 0,
        nextReview: Date.now(),
        lastReviewed: null,
        correctStreak: 0,
        totalAttempts: 0,
        correctAttempts: 0,
        mastered: false
      });
    }
    return this.words.get(wordId);
  }

  // Update word after answer
  updateWord(wordId, correct) {
    const word = this.getWordData(wordId);
    word.totalAttempts++;
    word.lastReviewed = Date.now();

    if (correct) {
      word.correctAttempts++;
      word.correctStreak++;
      
      // Always advance stage when answer is correct (up to stage 9)
      if (word.stage < 9) {
        word.stage = Math.min(word.stage + 1, 9);
      }
      
      // Mark as mastered at stage 8 (but can continue to stage 9 for retention)
      if (word.stage >= 8) {
        word.mastered = true;
      }

      // SM-2 algorithm for spaced repetition
      if (word.repetitions === 0) {
        word.interval = 1;
      } else if (word.repetitions === 1) {
        word.interval = 6;
      } else {
        word.interval = Math.round(word.interval * word.easiness);
      }

      word.repetitions++;
      word.nextReview = Date.now() + (word.interval * 24 * 60 * 60 * 1000);

      // Adjust easiness factor
      word.easiness = Math.max(1.3, word.easiness + (0.1 - (5 - 4) * (0.08 + (5 - 4) * 0.02)));
    } else {
      word.correctStreak = 0;
      
      // Move back one stage on incorrect answer (but not below 1)
      word.stage = Math.max(1, word.stage - 1);
      
      // If moved back from stage 8+, no longer considered mastered
      if (word.stage < 8) {
        word.mastered = false;
      }
      
      // Reset timing
      word.repetitions = 0;
      word.interval = 1;
      word.nextReview = Date.now();
      word.easiness = Math.max(1.3, word.easiness - 0.2);
    }

    return word;
  }

  // Get words that need review
  getWordsForReview(allWords, count = 20) {
    const now = Date.now();
    const wordsNeedingReview = [];

    allWords.forEach(word => {
      const wordData = this.getWordData(word.english);
      if (wordData.nextReview <= now) {
        wordsNeedingReview.push({
          ...word,
          wordData
        });
      }
    });

    // Sort by priority (overdue words first, then by stage)
    wordsNeedingReview.sort((a, b) => {
      const aOverdue = now - a.wordData.nextReview;
      const bOverdue = now - b.wordData.nextReview;
      
      if (aOverdue !== bOverdue) {
        return bOverdue - aOverdue; // More overdue first
      }
      return a.wordData.stage - b.wordData.stage; // Lower stage first
    });

    return wordsNeedingReview.slice(0, count);
  }

  // Get statistics
  getStats(allWords) {
    const stats = {
      newWords: 0,
      partiallyMastered: 0,
      fullyMastered: 0,
      totalWords: allWords.length,
      averageStage: 0,
      totalStages: 0,
      journeyProgress: 0
    };

    let totalProgress = 0;

    allWords.forEach(word => {
      const wordData = this.getWordData(word.english);
      
      if (wordData.totalAttempts === 0) {
        stats.newWords++;
      } else if (wordData.mastered) {
        stats.fullyMastered++;
      } else {
        stats.partiallyMastered++;
      }

      stats.totalStages += wordData.stage;
      
      // Calculate journey progress (stage / 9 * 100) for each word
      totalProgress += (wordData.stage / 9) * 100;
    });

    stats.averageStage = stats.totalStages / stats.totalWords;
    stats.journeyProgress = Math.round(totalProgress / stats.totalWords);

    return stats;
  }

  // Save/Load from localStorage
  save() {
    const data = Array.from(this.words.entries());
    localStorage.setItem('spacedRepetitionData', JSON.stringify(data));
  }

  load() {
    const data = localStorage.getItem('spacedRepetitionData');
    if (data) {
      const entries = JSON.parse(data);
      this.words = new Map(entries);
    }
  }
}