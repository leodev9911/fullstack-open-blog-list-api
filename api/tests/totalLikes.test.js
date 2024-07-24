const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

describe('total likes', () => {
    const listBlog = [
        {
            id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
        }
    ]

    test('when receives only 1 blog totalLikes return that likes', () => {
        assert.strictEqual(listHelper.totalLikes(listBlog), 5);
    });
});
