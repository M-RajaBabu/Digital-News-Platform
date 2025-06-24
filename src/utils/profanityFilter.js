// Basic profanity filter - in production, use a more sophisticated library
const profanityList = [
  'badword1', 'badword2', 'badword3', // Add actual profanity words
  'spam', 'scam', 'fake'
];

const profanityFilter = {
  // Check if text contains profanity
  containsProfanity: (text) => {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return profanityList.some(word => lowerText.includes(word));
  },

  // Filter profanity from text (replace with asterisks)
  filterText: (text) => {
    if (!text) return text;
    let filteredText = text;
    profanityList.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filteredText = filteredText.replace(regex, '*'.repeat(word.length));
    });
    return filteredText;
  },

  // Moderate comment based on content
  moderateComment: (content) => {
    const hasProfanity = profanityFilter.containsProfanity(content);
    const isTooShort = content.length < 3;
    const isTooLong = content.length > 1000;
    const hasExcessiveCaps = (content.match(/[A-Z]/g) || []).length > content.length * 0.7;

    if (hasProfanity || isTooShort || isTooLong || hasExcessiveCaps) {
      return {
        approved: false,
        reason: hasProfanity ? 'profanity' : 
                isTooShort ? 'too_short' : 
                isTooLong ? 'too_long' : 'excessive_caps'
      };
    }

    return { approved: true };
  }
};

module.exports = profanityFilter; 