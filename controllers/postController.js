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

    const post = data.find(post => post.slug == req.params.slug);

    if (!post) {
        return res.status(404).json({
            error: 'Not found',
            messager: 'Post not found'
        })
    }

    //for loop implementation
    /*
    let post;
    for(let i = 0; i < data.length; i++){
        const reqPost = req.params.slug
        if(data[i].slug == reqPost){
            post = data[i];
            break;
        }
    }
    */

    res.json(post);
}

function store(req, res) {

    //title input check
    data.forEach(post => {
        const inputSlug = req.body.title.replaceAll(' ', '-').toLowerCase();
        const postSlug = post.slug;

        if (inputSlug == postSlug) {
            return res.status(403).json({
                error: 'Already exists',
                message: 'This post already exist'
            })
        }
    })
    //create new slug
    const newSlug = req.body.title.replaceAll(' ', '-').toLowerCase();
    console.log(newSlug);

    const newPost = {
        title: req.body.title,
        slug: newSlug,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }

    data.push(newPost);

    console.log(data);

    res.status(201);
    res.json(newPost);

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
    const postSlug = req.params.slug;
    //console.log(postSlug);

    const currentSlug = data.find(post => post.slug == postSlug);
    //console.log(currentSlug);

    if (!currentSlug) {
        return res.status(404).json({
            error: 'Not found',
            message: 'Post not found'
        })
    }

    data.forEach((post, i, arr) => {
        if (post.slug == postSlug) {
            console.log(currentSlug.slug, postSlug);

            arr.splice(arr.indexOf(post), 1);
        }
    })

    //console.log(currentSlug.slug, postSlug);
    res.sendStatus(204);
}



module.exports = {
    index,
    show,
    store,
    update,
    modify,
    destroy
}