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
  // Hungarian words - similar sounds to TRANSLATIONS
  'szia': ['sia', 'zia', 'szea', 'szila', 'sziá'],
  'viszlát': ['vislát', 'viszát', 'vislát', 'viszlót', 'viszlet'],
  'kérem': ['kérek', 'kérlek', 'kérem', 'kérém', 'kérom'],
  'köszönöm': ['köszönet', 'köszönök', 'köszönöd', 'köszönjük', 'köszönöm'],
  'igen': ['igaz', 'igén', 'iged', 'igék', 'igér'],
  'nem': ['nép', 'név', 'nez', 'nekem', 'neki'],
  'elnézést': ['elnéz', 'elnézés', 'elnézet', 'elnéző', 'elnézett'],
  'sajnálom': ['sajnál', 'sajnos', 'sajná', 'sajnálod', 'sajnálok'],
  'hol': ['hó', 'húr', 'hús', 'hol', 'holt'],
  'mennyibe': ['mennyi', 'menny', 'menybe', 'mennyit', 'mennybe'],
  
  // Spanish words - similar sounds to TRANSLATIONS
  'hola': ['cola', 'bola', 'lola', 'hoja', 'hora'],
  'adiós': ['adios', 'dios', 'arios', 'varios', 'radios'],
  'gracias': ['gracia', 'gracioso', 'graciosa', 'gracias', 'garcia'],
  'sí': ['si', 'así', 'casi', 'psi', 'ski'],
  'no': ['yo', 'lo', 'do', 'so', 'go'],
  'perdón': ['perdí', 'perdió', 'perdona', 'perdon', 'perdone'],
  'dónde': ['donde', 'conde', 'ronde', 'fonde', 'ponde'],
  'cuánto': ['cuanto', 'cuando', 'cuatro', 'cuarto', 'canto'],
  'quiero': ['quero', 'quieto', 'quiebro', 'quiera', 'quieres'],
  'agua': ['aguda', 'aguá', 'aguja', 'aguarda', 'aguanta']
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
  
  // Generate variations by changing vowels
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const baseVowels = base.match(/[aeiou]/g) || [];
  
  if (baseVowels.length > 0) {
    // Replace each vowel with other vowels
    for (let i = 0; i < Math.min(count, 5); i++) {
      let variation = base;
      const randomVowelIndex = Math.floor(Math.random() * baseVowels.length);
      const originalVowel = baseVowels[randomVowelIndex];
      const newVowel = vowels[Math.floor(Math.random() * vowels.length)];
      
      variation = variation.replace(originalVowel, newVowel);
      
      if (variation !== base && !similar.find(s => s.english === variation)) {
        similar.push({
          english: variation,
          translation: variation,
          pronunciation: variation
        });
      }
    }
  }
  
  // Generate variations by changing consonants
  const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'z'];
  
  while (similar.length < count) {
    let variation = base;
    const randomIndex = Math.floor(Math.random() * variation.length);
    const randomConsonant = consonants[Math.floor(Math.random() * consonants.length)];
    
    variation = variation.substring(0, randomIndex) + randomConsonant + variation.substring(randomIndex + 1);
    
    if (variation !== base && !similar.find(s => s.english === variation)) {
      similar.push({
        english: variation,
        translation: variation,
        pronunciation: variation
      });
    }
    
    // Prevent infinite loop
    if (similar.length >= 10) break;
  }
  
  return similar.slice(0, count);
};