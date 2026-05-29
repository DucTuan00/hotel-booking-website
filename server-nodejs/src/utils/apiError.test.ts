import test from 'node:test';
import assert from 'node:assert/strict';
import ApiError from './apiError';

test('ApiError stores status code, code, data, message, and stack', () => {
    const data = { field: 'email' };
    const error = new ApiError('Invalid input', 400, 'VALIDATION_ERROR', data);

    assert.equal(error.message, 'Invalid input');
    assert.equal(error.statusCode, 400);
    assert.equal(error.code, 'VALIDATION_ERROR');
    assert.equal(error.data, data);
    assert.ok(error instanceof Error);
    assert.equal(typeof error.stack, 'string');
});
