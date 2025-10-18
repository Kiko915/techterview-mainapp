// Recommendation algorithm for interview tracks

// Skill mappings for recommendation algorithm
export const skillMappings = {
  'Frontend Development': ['frontend', 'javascript', 'react', 'web', 'ui'],
  'Backend Development': ['backend', 'server', 'api', 'database', 'node'],
  'UI/UX Design': ['ui', 'ux', 'design', 'user', 'interface'],
  'UI/UX': ['ui', 'ux', 'design', 'user', 'interface'], // Added explicit UI/UX mapping
  'Data Science': ['data', 'algorithm', 'machine learning', 'analytics'],
  'Mobile Development': ['mobile', 'android', 'ios', 'app'],
  'DevOps': ['devops', 'cloud', 'deployment', 'docker', 'kubernetes'],
  'System Design': ['system', 'architecture', 'scalability', 'distributed']
};

/**
 * Get recommended track based on user skill area
 * @param {string} skillArea - User's skill area
 * @param {Array} availableTracks - Array of available tracks
 * @returns {Object|null} - Recommended track or null
 */
export const getRecommendedTrack = (skillArea, availableTracks) => {
  if (!skillArea || availableTracks.length === 0) return null;

  console.log('Starting recommendation algorithm with:', { skillArea, availableTracks });

  // Get keywords for the user's skill, with fallback to the skill itself
  const userSkillKeywords = skillMappings[skillArea] || [skillArea.toLowerCase()];
  console.log('User skill keywords:', userSkillKeywords);
  
  // Score tracks based on how well they match user's skill area
  const scoredTracks = availableTracks.map(track => {
    let score = 0;
    const trackTitle = track.title.toLowerCase();
    const trackDescription = track.description.toLowerCase();
    
    console.log(`Scoring track "${track.title}":`, { trackTitle, trackDescription });
    
    // Check title matches (higher weight)
    userSkillKeywords.forEach(keyword => {
      if (trackTitle.includes(keyword)) {
        score += 3;
        console.log(`  Title match for "${keyword}": +3 points`);
      }
      if (trackDescription.includes(keyword)) {
        score += 1;
        console.log(`  Description match for "${keyword}": +1 point`);
      }
    });

    // Bonus for beginner/intermediate tracks for better learning progression
    if (track.difficulty === 'Beginner') {
      score += 2;
      console.log(`  Beginner difficulty bonus: +2 points`);
    }
    if (track.difficulty === 'Intermediate') {
      score += 1;
      console.log(`  Intermediate difficulty bonus: +1 point`);
    }

    // Penalty for locked tracks
    if (track.isLocked) {
      score -= 5;
      console.log(`  Locked track penalty: -5 points`);
    }

    console.log(`  Final score for "${track.title}": ${score}`);
    return { ...track, score };
  });

  console.log('All scored tracks:', scoredTracks);

  // Sort by score and return the best match
  const bestMatch = scoredTracks
    .filter(track => track.score > 0)
    .sort((a, b) => b.score - a.score)[0];

  // If no perfect match, try to find a reasonable fallback
  if (!bestMatch && scoredTracks.length > 0) {
    // For UI/UX users, try to find frontend tracks as they often involve UI work
    if (skillArea.toLowerCase().includes('ui') || skillArea.toLowerCase().includes('ux')) {
      const frontendTrack = scoredTracks.find(track => 
        track.title.toLowerCase().includes('frontend') || 
        track.title.toLowerCase().includes('web') ||
        track.title.toLowerCase().includes('react')
      );
      if (frontendTrack) {
        console.log('Fallback: Found frontend track for UI/UX user:', frontendTrack);
        return frontendTrack;
      }
    }
    
    // General fallback: return the first beginner track if available
    const beginnerTrack = scoredTracks.find(track => track.difficulty === 'Beginner' && !track.isLocked);
    if (beginnerTrack) {
      console.log('Fallback: Found beginner track:', beginnerTrack);
      return beginnerTrack;
    }
    
    // Last resort: return any unlocked track
    const anyUnlockedTrack = scoredTracks.find(track => !track.isLocked);
    if (anyUnlockedTrack) {
      console.log('Fallback: Found any unlocked track:', anyUnlockedTrack);
      return anyUnlockedTrack;
    }
  }

  console.log('Best match found:', bestMatch);
  return bestMatch || null;
};