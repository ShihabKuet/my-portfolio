export interface FunFact {
  id:         number;
  text:       string;
  image:      string;             // transparent-bg PNG in /public/fun-facts/
  imageAlt:   string;
  imageSide:  "left" | "right";
  gradient:   [string, string];   // [from, to] hex colors for pill bg
  accent:     string;             // hex — border glow + label color
}