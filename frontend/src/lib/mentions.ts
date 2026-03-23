import { Mention } from '../types/api';

// Regex to match [[Entity Name]] mentions
const MENTION_REGEX = /\[\[([^\[\]]+)\]\]/g;

export function extractMentions(content: string): Mention[] {
  const mentions: Mention[] = [];
  let match;

  while ((match = MENTION_REGEX.exec(content)) !== null) {
    const entityTitle = match[1].trim();
    const position = match.index;
    const length = match[0].length;

    mentions.push({
      entityId: '', // Will be resolved later
      entityTitle,
      position,
      length,
    });
  }

  return mentions;
}

// Find all unique entity mentions in content
export function getUniqueMentions(content: string): string[] {
  const mentions = new Set<string>();
  const regex = /\[\[([^\[\]]+)\]\]/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    mentions.add(match[1].trim());
  }

  return Array.from(mentions);
}

// Replace mention text with link format (for storing/processing)
export function replaceMentionWithId(content: string, mentionTitle: string, entityId: string): string {
  return content.replace(
    new RegExp(`\\[\\[${mentionTitle}\\]\\]`, 'g'),
    `[[${mentionTitle}:${entityId}]]`
  );
}

// Extract entity ID from mention
export function extractEntityId(mention: string): string | null {
  const match = mention.match(/\[\[.*:(.+?)\]\]/);
  return match ? match[1] : null;
}

// Render mention text for display
export function highlightMentions(content: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\[\[([^\[\]]+)\]\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    // Add mention as highlighted span
    const mentionTitle = match[1];
    parts.push(
      <span key={match.index} className="bg-accent/20 text-accent font-semibold px-1.5 py-0.5 rounded inline-block">
        @{mentionTitle}
      </span>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts.length === 0 ? content : parts;
}
