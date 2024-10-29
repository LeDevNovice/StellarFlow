import { Level } from "../../models/level.model";

export interface LevelSelectorProps {
  onSelectLevel: (level: Level) => void;
}