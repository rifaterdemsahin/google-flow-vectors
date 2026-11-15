export type Scene = { id: 1 | 2 | 3 | 4 | 5 | 6; clip: string; text: string };

export const FPS = 24;
export const SCENE_FRAMES = 190; // 7.92s per clip

export const SCENES: Scene[] = [
  { id: 1, clip: 'clips/scene1.mp4', text: "How does an AI actually understand words? It doesn't read letters—it turns features into direction arrows on a giant map!" },
  { id: 2, clip: 'clips/scene2.mp4', text: 'Think of this horse as a base vector. Every single concept sits at its own specific spot on the coordinate grid.' },
  { id: 3, clip: 'clips/scene3.mp4', text: 'Add the "Wings" direction vector to the Horse... and the AI moves directly to the coordinate for Pegasus!' },
  { id: 4, clip: 'clips/scene4.mp4', text: 'Add the "Horn" direction vector instead... and the coordinate shifts straight to Unicorn!' },
  { id: 5, clip: 'clips/scene5.mp4', text: 'Which means... Pegasus, minus Wings, plus Horn, equals Unicorn! To an AI, concept logic is just basic geometry.' },
  { id: 6, clip: 'clips/scene6.mp4', text: 'Token 9246 is hiding inside! But... how do these vectors talk to each other? How DOES an AI understand concepts?' },
];
