import type { FunFact } from "@/types";

// ─── Fun fact data ─────────────────────────────────────────────────────────────
// Add more entries here freely — image should be a transparent PNG in /public/fun-facts/
// The image overflows above the pill — head/top pokes out, bottom is anchored to pill floor.

export const FUN_FACTS: FunFact[] = [
  {
    id:        1,
    text:      "Linus Torvalds created Git in just 10 days — out of pure frustration with existing version control systems.",
    image:     "https://res.cloudinary.com/dhslusvuk/image/upload/v1777003137/linus_gbwcbx.png",
    imageAlt:  "Linus Torvalds",
    imageSide: "right",
    gradient:  ["#071a0e", "#0a2e12"],
    accent:    "#22c55e",
  },
  {
    id:        2,
    text:      "The first computer 'bug' was a literal one — a moth trapped in a relay of the Harvard Mark II in 1947.",
    image:     "https://res.cloudinary.com/dhslusvuk/image/upload/v1777003147/moth_fz21jj.png",
    imageAlt:  "A moth",
    imageSide: "left",
    gradient:  ["#1a0a28", "#2a0d3a"],
    accent:    "#a855f7",
  },
  // {
  //   id:        3,
  //   text:      "Python was named after Monty Python's Flying Circus, not the snake.",
  //   image:     "/fun-facts/python-logo.png",
  //   imageAlt:  "Python logo",
  //   imageSide: "right",
  //   gradient:  ["#071020", "#0a1a30"],
  //   accent:    "#3b82f6",
  // },
  // {
  //   id:        4,
  //   text:      "Tim Berners-Lee made the World Wide Web completely royalty-free.",
  //   image:     "/fun-facts/tim.png",
  //   imageAlt:  "Tim Berners-Lee",
  //   imageSide: "right",
  //   gradient:  ["#1a1005", "#2a1f08"],
  //   accent:    "#f59e0b",
  // },
  // {
  //   id:        5,
  //   text:      "The first 1 GB hard drive weighed 550 lbs and cost $40,000.",
  //   image:     "/fun-facts/harddrive.png",
  //   imageAlt:  "Old hard drive",
  //   imageSide: "left",
  //   gradient:  ["#05141a", "#082030"],
  //   accent:    "#06b6d4",
  // },
  // {
  //   id:        6,
  //   text:      "The word 'Wi-Fi' means absolutely nothing — invented by a branding firm.",
  //   image:     "/fun-facts/wifi.png",
  //   imageAlt:  "WiFi symbol",
  //   imageSide: "right",
  //   gradient:  ["#1a0508", "#2a080c"],
  //   accent:    "#ef4444",
  // },
  // {
  //   id:        7,
  //   text:      "NASA's Apollo 11 computer had 4 KB of RAM. Your browser tab uses more.",
  //   image:     "/fun-facts/apollo.png",
  //   imageAlt:  "Apollo mission",
  //   imageSide: "left",
  //   gradient:  ["#06060f", "#0d0d2a"],
  //   accent:    "#818cf8",
  // },
  // {
  //   id:        8,
  //   text:      "The average person unlocks their phone 96 times a day.",
  //   image:     "/fun-facts/phone.png",
  //   imageAlt:  "Smartphone",
  //   imageSide: "right",
  //   gradient:  ["#0a1a10", "#0d2a18"],
  //   accent:    "#34d399",
  // },
];