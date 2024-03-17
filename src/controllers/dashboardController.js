const HomeController = {
    home: (req, res) => {
        res.render('index.hbs', {
            morris: true
        });
    },
};

module.exports = { HomeController };