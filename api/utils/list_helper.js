const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
    let likes = 0;

    if (blogs.length === 1) {
        return (likes = blogs[0].likes);
    }

    blogs.forEach((blog) => (likes += blog?.likes));
    return likes;
};

const favoriteBlog = (blogs) => {
    const sortedArray = [...blogs].sort((a, b) => b.likes - a.likes);

    return {
        title: sortedArray[0].title,
        author: sortedArray[0].author,
        likes: sortedArray[0].likes,
    };
};

const mostBlogs = (blogs) => {
    return Object.entries(
        blogs.reduce((a, b) => {
            const author = b.author;
            a[author] ? (a[author] += 1) : (a[author] = 1);
            return a;
        }, {})
    )
        .map((author) => ({
            author: author[0],
            blogs: author[1],
        }))
        .sort((a, b) => b.blogs - a.blogs)[0];
};

const mostLikes = (blogs) => {
    return Object.entries(
        blogs.reduce((a, b) => {
            const author = b.author;
            a[author] 
              ? a[author] += b.likes
              : a[author] = b.likes;
            return a;
        }, {})
    )
        .map((author) => ({
            author: author[0],
            likes: author[1],
        }))
        .sort((a, b) => b.likes - a.likes)[0];
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
