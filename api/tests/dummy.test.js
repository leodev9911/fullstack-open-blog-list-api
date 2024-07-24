const { describe, test } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
    const blogs = [];

    const results = listHelper.dummy(blogs);
    assert.strictEqual(results, 1);
})