export interface AIIconData {
  id: string;
  name: string;
  icon: string; // we can use lucide-react names or beautiful custom SVG representations
  color: string;
  // Starting scattered coordinates in percentages
  startX: number; // e.g., -30 to 130
  startY: number; // e.g., -30 to 130
  rotation: number; // random rotation degree
  speedMultiplier: number; // slight physics feel difference
}

export interface SyllabusItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // lucide icon name
  duration: string;
  badge: string;
}

export interface ContrarianStatement {
  id: string;
  boldHeader: string;
  body: string;
  stat?: string;
  highlightWords: string[];
}

export interface WaitlistSubmission {
  name: string;
  email: string;
  timestamp: number;
}
