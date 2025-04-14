function error_404(req, res, next){
    res.status(404).json({
        error: 'Not found',
        message: 'Page not found'
    })
}
module.exports = error_404;