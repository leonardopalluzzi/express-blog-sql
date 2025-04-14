const data = require('../data/posts');
const connection = require('../data/db');

function index(req, res) {

    const sql = 'SELECT * FROM posts'

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'DB error' })
        res.json(results)
    })
}

function show(req, res) {

    const postSlug = req.params.slug.replaceAll('-', ' ')

    const sql = 'SELECT * FROM posts WHERE posts.title = ?'
    const sqlJoin = 'SELECT * FROM post_tag JOIN tags ON post_tag.tag_id = tags.id WHERE post_tag.post_id = ? '

    connection.query(sql, [postSlug], (err, postIdResult) => {
        if (err) return res.status(500).json({ message: 'DB error' });
        console.log(postIdResult);
        const queryPost = postIdResult[0]
        const postId = postIdResult[0].id
        //res.json(postId)

        connection.query(sqlJoin, [postId], (err, tagsResults) => {
            if (err) return res.status(500).json({ message: 'DB error' });
            console.log(tagsResults);

            const tagList = tagsResults.map(item => {
                const { id, label } = item
                return newItem = {
                    id,
                    label
                }
            })

            queryPost.tags = tagList
            res.json(queryPost)
        })
    })
}

function store(req, res) {

    const newPost = req.body

    const sql = 'INSERT INTO posts  (title, content, image) VALUES (?, ?, ?)'

    connection.query(sql, [newPost.title, newPost.content, newPost.image], (err, results) => {
        if (err) return res.status(500).json({ message: 'error' });
        res.json({ message: 'Post inserito con successo' })
    })
}

function update(req, res) {

    const newSlug = req.body.title.replaceAll(' ', '-').toLowerCase();
    let errorflag = false;

    //title input check
    data.forEach(post => {
        const postSlug = post.slug;
        //console.log(postSlug);

        if (newSlug == postSlug) {
            errorflag = true;
        }
    })
    //console.log(errorflag);

    const currentSlug = req.params.slug;
    const currentPost = data.find(post => post.slug == currentSlug);

    if (!currentPost) {
        return res.status(404).json({
            error: "Not found",
            message: "Post not found"
        })
    } else if (errorflag == true) {
        return res.status(403).json({
            error: 'Already exists',
            message: 'This post already exist'
        })
    } else {
        currentPost.title = req.body.title;
        currentPost.slug = newSlug;
        currentPost.content = req.body.content;
        currentPost.image = req.body.image;
        currentPost.tags = req.body.tags;

        //console.log(data.forEach(post => console.log(post.slug)));

        res.json(currentPost);
    }
}

function modify(req, res) {

    const currentSlug = req.params.slug;
    const currentPost = data.find(post => post.slug == currentSlug);

    if (!currentPost) {
        return res.status(404).json({
            error: "Not found",
            message: "Post not found"
        })
    } else {
        currentPost.content = req.body.content;
        currentPost.image = req.body.image;
        currentPost.tags = req.body.tags;

        //console.log(data.forEach(post => console.log(post.slug)));

        res.json(currentPost);
    }
}

function destroy(req, res) {
    const postSlug = req.params.slug.replaceAll('-', ' ');
    console.log(postSlug);

    const sql = 'DELETE FROM posts WHERE posts.title = ?'

    connection.query(sql, [postSlug], (err) => {
        if (err) return res.status(500).json({ message: 'DB error' });
        res.sendStatus(204)
    })
}



module.exports = {
    index,
    show,
    store,
    update,
    modify,
    destroy
}