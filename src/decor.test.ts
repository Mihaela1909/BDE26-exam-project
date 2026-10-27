import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  applyFlowerSpec,
  createFlower,
  createMainFlowerSpecs,
  createRandomBigFlowerSpec,
  createRandomFlowerSpec,
  keepReblooming,
  randomLifetime,
  type FlowerSpec,
} from './decor';

/** Always returns the same "random" number, so the results are predictable. */
const fixed = (value: number) => (): number => value;

describe('createMainFlowerSpecs', () => {
  it('creates the three big flowers from the design, in their three colors', () => {
    const specs = createMainFlowerSpecs(fixed(0.5));

    expect(specs.map((spec) => spec.color)).toEqual([1, 2, 3]);
    expect(specs.every((spec) => spec.delay >= 0.1 && spec.delay <= 1.2)).toBe(true);
  });
});

describe('createRandomFlowerSpec', () => {
  it('puts the flower along the left edge for low random numbers', () => {
    const spec = createRandomFlowerSpec(fixed(0));

    expect(spec.left).toBe('-5vw');
    expect(spec.top).toBe('0vh');
    expect(spec.size).toBe('7vw');
    expect(spec.color).toBe(1);
  });

  it('puts the flower along the right edge for high random numbers', () => {
    const spec = createRandomFlowerSpec(fixed(0.99));

    expect(parseInt(spec.left, 10)).toBeGreaterThanOrEqual(80);
    expect(spec.color).toBe(3);
    expect(spec.delay).toBeLessThanOrEqual(2.4);
  });
});

describe('applyFlowerSpec / createFlower', () => {
  const spec: FlowerSpec = { left: '10vw', top: '20vh', size: '9vw', rotate: -30, flip: -1, color: 2, delay: 0.5 };

  it('stores the spec in CSS variables that the bloom animation uses', () => {
    const flower = createFlower(spec);

    expect(flower.className).toBe('flower');
    expect(flower.style.getPropertyValue('--left')).toBe('10vw');
    expect(flower.style.getPropertyValue('--rotate')).toBe('-30deg');
    expect(flower.style.getPropertyValue('--flip')).toBe('-1');
    expect(flower.style.getPropertyValue('--color')).toBe('var(--flower-2)');
    expect(flower.style.getPropertyValue('--delay')).toBe('0.50s');
  });

  it('can move an existing flower somewhere else', () => {
    const flower = createFlower(spec);

    applyFlowerSpec(flower, { ...spec, left: '90vw' });

    expect(flower.style.getPropertyValue('--left')).toBe('90vw');
  });
});

describe('createRandomBigFlowerSpec', () => {
  it('keeps big flowers big and near the edges', () => {
    const left = createRandomBigFlowerSpec(fixed(0));
    const right = createRandomBigFlowerSpec(fixed(0.99));

    expect(left.left).toBe('-16vw');
    expect(left.size).toBe('26vw');
    expect(parseInt(right.left, 10)).toBeGreaterThanOrEqual(66);
    expect(parseInt(right.size, 10)).toBeLessThanOrEqual(38);
  });
});

describe('randomLifetime', () => {
  it('lasts between 9 and 16 seconds', () => {
    expect(randomLifetime(fixed(0))).toBe(9000);
    expect(randomLifetime(fixed(1))).toBe(16000);
  });
});

describe('keepReblooming', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('wilts after its lifetime and blooms again at the next spot', async () => {
    vi.useFakeTimers();
    const flower = createFlower({ left: '10vw', top: '20vh', size: '9vw', rotate: 0, flip: 1, color: 1, delay: 0 });
    const next: FlowerSpec = { left: '85vw', top: '50vh', size: '11vw', rotate: 20, flip: -1, color: 3, delay: 0.5 };

    keepReblooming(flower, () => next, fixed(0));

    await vi.advanceTimersByTimeAsync(9000);
    expect(flower.classList.contains('wilting')).toBe(true);

    await vi.advanceTimersByTimeAsync(1000);
    expect(flower.classList.contains('wilting')).toBe(false);
    expect(flower.classList.contains('reblooming')).toBe(true);
    expect(flower.style.getPropertyValue('--left')).toBe('85vw');
  });
});
