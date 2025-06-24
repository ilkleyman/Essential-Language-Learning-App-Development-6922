// Utility functions for generating similar sounding words and random words

export const generateSimilarSoundingWords = (targetWord, allWords, count = 3) => {
  const target = targetWord.toLowerCase();
  
  // Common sound patterns for similarity matching
  const getSoundPatterns = (word) => {
    const patterns = [];
    
    // Rhyming patterns (same ending)
    if (word.length >= 2) {
      patterns.push(word.slice(-2)); // last 2 letters
      patterns.push(word.slice(-3)); // last 3 letters
    }
    
    // Starting sounds
    if (word.length >= 2) {
      patterns.push(word.slice(0, 2)); // first 2 letters
    }
    
    // Vowel patterns
    const vowels = word.match(/[aeiou]/g) || [];
    if (vowels.length > 0) {
      patterns.push(vowels.join(''));
    }
    
    // Consonant clusters
    const consonantClusters = word.match(/[bcdfghjklmnpqrstvwxyz]{2,}/g) || [];
    patterns.push(...consonantClusters);
    
    return patterns;
  };

  const targetPatterns = getSoundPatterns(target);
  
  // Score words by similarity
  const scoredWords = allWords
    .filter(word => word.english.toLowerCase() !== target)
    .map(word => {
      const wordPatterns = getSoundPatterns(word.english.toLowerCase());
      let score = 0;
      
      // Check for pattern matches
      targetPatterns.forEach(pattern => {
        if (pattern.length >= 2) {
          wordPatterns.forEach(wordPattern => {
            if (pattern === wordPattern) {
              score += pattern.length; // Longer matches get higher scores
            }
          });
        }
      });
      
      // Bonus for similar length
      const lengthDiff = Math.abs(target.length - word.english.length);
      if (lengthDiff <= 1) score += 2;
      if (lengthDiff <= 2) score += 1;
      
      // Bonus for shared letters in same positions
      const minLength = Math.min(target.length, word.english.length);
      for (let i = 0; i < minLength; i++) {
        if (target[i] === word.english.toLowerCase()[i]) {
          score += 1;
        }
      }
      
      return { word, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Return the top similar words
  return scoredWords.slice(0, count).map(item => item.word);
};

export const generateRandomWords = (excludeWord, allWords, count = 3) => {
  return allWords
    .filter(word => word.english !== excludeWord.english)
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

// Predefined similar sounding word groups for common words
export const similarSoundingGroups = {
  // Car-like sounds
  car: ['bar', 'far', 'jar', 'star', 'card', 'cart', 'care', 'core'],
  
  // Cat-like sounds  
  cat: ['bat', 'hat', 'rat', 'sat', 'mat', 'pat', 'fat', 'chat'],
  
  // House-like sounds
  house: ['mouse', 'horse', 'course', 'hours', 'houses', 'housing'],
  
  // Water-like sounds
  water: ['winter', 'waiter', 'weather', 'wetter', 'walter', 'wonder'],
  
  // Food-like sounds
  food: ['mood', 'good', 'wood', 'hood', 'stood', 'foot', 'fool'],
  
  // Hello-like sounds
  hello: ['yellow', 'bellow', 'fellow', 'hollow', 'pillow', 'willow'],
  
  // Thank-like sounds
  thank: ['bank', 'tank', 'rank', 'blank', 'think', 'thick'],
  
  // Please-like sounds
  please: ['peace', 'place', 'plane', 'plate', 'play', 'plaza'],
  
  // Where-like sounds
  where: ['wear', 'were', 'care', 'dare', 'fair', 'hair', 'pair'],
  
  // Help-like sounds
  help: ['kelp', 'yelp', 'held', 'hell', 'helm', 'hemp']
};

export const getSimilarSounds = (word, count = 3) => {
  const wordLower = word.toLowerCase();
  
  // Check if we have predefined similar sounds
  if (similarSoundingGroups[wordLower]) {
    return similarSoundingGroups[wordLower]
      .sort(() => Math.random() - 0.5)
      .slice(0, count)
      .map(w => ({ english: w, translation: w, pronunciation: w })); // Mock structure
  }
  
  // Generate algorithmic similar sounds if no predefined group exists
  return generateAlgorithmicSimilarWords(word, count);
};

const generateAlgorithmicSimilarWords = (word, count) => {
  const base = word.toLowerCase();
  const similar = [];
  
  // Generate rhyming variations
  const endings = ['ar', 'er', 'or', 'ing', 'ed', 'ly', 'tion', 'ness'];
  const beginnings = ['pre', 'un', 'de', 're', 'over', 'under', 'out'];
  
  // Try different endings
  if (base.length > 2) {
    const root = base.slice(0, -2);
    endings.forEach(ending => {
      if (similar.length < count) {
        similar.push({
          english: root + ending,
          translation: root + ending,
          pronunciation: root + ending
        });
      }
    });
  }
  
  // Try different beginnings
  beginnings.forEach(beginning => {
    if (similar.length < count) {
      similar.push({
        english: beginning + base,
        translation: beginning + base,
        pronunciation: beginning + base
      });
    }
  });
  
  return similar.slice(0, count);
};