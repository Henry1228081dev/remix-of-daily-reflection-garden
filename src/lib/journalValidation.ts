export interface ValidationResult {
  isValid: boolean;
  reasons: string[];
}

// Validate journal entry for spam/gibberish
export const validateJournalEntry = (text: string): ValidationResult => {
  const trimmed = text.trim();
  const reasons: string[] = [];
  
  if (!trimmed) {
    return { isValid: false, reasons: ["Entry is empty"] };
  }

  // Check for repeated single characters (like "sssss" or ".......")
  if (/^(.)\1{4,}$/i.test(trimmed)) {
    reasons.push("Entry contains only repeated characters");
  }

  // Check for patterns like "S.S.S." or "a.b.c.d"
  if (/^([a-z]\.){2,}[a-z]?\.?$/i.test(trimmed.replace(/\s/g, ''))) {
    reasons.push("Entry appears to be random letters with periods");
  }

  // Check for mostly non-letter characters
  const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
  const totalChars = trimmed.replace(/\s/g, '').length;
  if (totalChars > 3 && letterCount / totalChars < 0.3) {
    reasons.push("Entry contains too few actual letters");
  }

  // Check for very short entries with no real words
  const words = trimmed.split(/\s+/).filter(w => w.length > 2 && /[a-zA-Z]{2,}/.test(w));
  if (trimmed.length > 5 && words.length < 2) {
    reasons.push("Entry doesn't contain meaningful words");
  }

  // Check for keyboard smashing (random consonant clusters)
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(trimmed)) {
    reasons.push("Entry appears to be keyboard smashing");
  }

  // Check for repeating patterns like "abcabc" or "123123"
  if (/^(.{1,4})\1{2,}$/i.test(trimmed.replace(/\s/g, ''))) {
    reasons.push("Entry contains repetitive patterns");
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
};
