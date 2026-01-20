import { getResponse } from '@/actions/ai/chat';
import { describe, expect, it } from 'vitest';

describe('ai response', () => {
    it('should return a valid response', async () => {
        const response = await getResponse('hello');
        expect(response).toBe('hello');
    });
});