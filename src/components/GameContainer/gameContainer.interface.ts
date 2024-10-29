import { Level } from "../../models/level.model";

export interface GameContainerProps {
  level: Level;
  difficulty: number;
  onBackToHome: () => void;
  onRestartGame: () => void;
}