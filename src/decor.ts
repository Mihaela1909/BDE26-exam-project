import { animateOut, restartAnimation } from './animations';

/** Where and how one background flower is drawn. Sizes and positions are CSS lengths. */
export interface FlowerSpec {
  left: string;
  top: string;
  size: string;
  rotate: number;
  flip: 1 | -1;
  /** Which of the theme's flower colors to use: `--flower-1` to `--flower-3` */
  color: 1 | 2 | 3;
  /** Seconds before the flower starts to bloom */
  delay: number;
}

/** A random number generator like `Math.random`, so tests can pass a predictable one. */
export type Random = () => number;

const between = (random: Random, min: number, max: number): number => min + random() * (max - min);

/** The three big flowers from the design; only their bloom timing is random. */
export const createMainFlowerSpecs = (random: Random = Math.random): FlowerSpec[] => [
  { left: '71vw', top: '4vh', size: '38vw', rotate: -12, flip: 1, color: 1, delay: between(random, 0.1, 1.2) },
  { left: '-11vw', top: '42vh', size: '30vw', rotate: 18, flip: -1, color: 2, delay: between(random, 0.1, 1.2) },
  { left: '78vw', top: 'calc(106vh - 21vw)', size: '28vw', rotate: -24, flip: 1, color: 3, delay: between(random, 0.1, 1.2) },
];

/** A small flower at a random spot along the left or right edge, so it stays mostly beside the card. */
export const createRandomFlowerSpec = (random: Random = Math.random): FlowerSpec => {
  const onLeft = random() < 0.5;

  return {
    left: `${Math.round(onLeft ? between(random, -5, 12) : between(random, 80, 95))}vw`,
    top: `${Math.round(between(random, 0, 88))}vh`,
    size: `${Math.round(between(random, 7, 13))}vw`,
    rotate: Math.round(between(random, -45, 45)),
    flip: random() < 0.5 ? 1 : -1,
    color: (Math.floor(random() * 3) + 1) as FlowerSpec['color'],
    delay: between(random, 0.6, 2.4),
  };
};

/** A big flower at a random spot near the left or right edge, partly off-screen like in the design. */
export const createRandomBigFlowerSpec = (random: Random = Math.random): FlowerSpec => {
  const onLeft = random() < 0.5;

  return {
    left: `${Math.round(onLeft ? between(random, -16, -4) : between(random, 66, 80))}vw`,
    top: `${Math.round(between(random, -10, 70))}vh`,
    size: `${Math.round(between(random, 26, 38))}vw`,
    rotate: Math.round(between(random, -40, 40)),
    flip: random() < 0.5 ? 1 : -1,
    color: (Math.floor(random() * 3) + 1) as FlowerSpec['color'],
    delay: between(random, 0.3, 1.5),
  };
};

/** How long a flower stays before it wilts, in milliseconds. */
export const randomLifetime = (random: Random = Math.random): number => Math.round(between(random, 9, 16) * 1000);

/** Moves `flower` to `spec`. */
export const applyFlowerSpec = (flower: HTMLElement, spec: FlowerSpec): void => {
  flower.style.setProperty('--left', spec.left);
  flower.style.setProperty('--top', spec.top);
  flower.style.setProperty('--size', spec.size);
  flower.style.setProperty('--rotate', `${spec.rotate}deg`);
  flower.style.setProperty('--flip', String(spec.flip));
  flower.style.setProperty('--color', `var(--flower-${spec.color})`);
  flower.style.setProperty('--delay', `${spec.delay.toFixed(2)}s`);
};

/**
 * Lets `flower` wilt after a random time and bloom again at a new spot from `nextSpec`, over and over.
 * Every flower gets its own timer, so they come and go at different moments.
 */
export const keepReblooming = (flower: HTMLElement, nextSpec: () => FlowerSpec, random: Random = Math.random): void => {
  const cycle = async (): Promise<void> => {
    flower.classList.remove('reblooming');
    await animateOut(flower, 'wilting', 1000);
    flower.classList.remove('wilting');
    applyFlowerSpec(flower, nextSpec());
    restartAnimation(flower, 'reblooming');
    setTimeout(cycle, randomLifetime(random));
  };

  setTimeout(cycle, randomLifetime(random));
};

/** Creates one flower element for `spec`. */
export const createFlower = (spec: FlowerSpec): HTMLSpanElement => {
  const flower = document.createElement('span');
  flower.className = 'flower';
  applyFlowerSpec(flower, spec);
  return flower;
};
