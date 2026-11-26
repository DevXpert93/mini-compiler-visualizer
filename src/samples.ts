export const DEFAULT_SAMPLE = 'let x = 5;\nlet y = x + 10;\nprint(y);';

export const EXAMPLES = {
  basic: DEFAULT_SAMPLE,
  arithmetic: 'let a = 2 + 3 * (4 - 1);\nlet b = a / 2;\nprint(b);',
  error: 'let n = 5;\nlet bad = n @ 2;\nprint(bad);',
} as const;
