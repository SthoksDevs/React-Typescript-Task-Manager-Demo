import { describe, expect, it } from 'vitest';
import { taskFormSchema } from './taskSchema';

describe('taskFormSchema', () => {
  it('accepts a valid title with no notes', () => {
    const result = taskFormSchema.safeParse({ title: 'Write tests', notes: '' });
    expect(result.success).toBe(true);
  });

  it('trims whitespace from the title', () => {
    const result = taskFormSchema.safeParse({ title: '  Write tests  ', notes: '' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Write tests');
    }
  });

  it('rejects an empty title', () => {
    const result = taskFormSchema.safeParse({ title: '', notes: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a title made entirely of whitespace', () => {
    const result = taskFormSchema.safeParse({ title: '   ', notes: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a title over 120 characters', () => {
    const result = taskFormSchema.safeParse({ title: 'a'.repeat(121), notes: '' });
    expect(result.success).toBe(false);
  });

  it('rejects notes over 500 characters', () => {
    const result = taskFormSchema.safeParse({ title: 'Valid title', notes: 'a'.repeat(501) });
    expect(result.success).toBe(false);
  });
});
