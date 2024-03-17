const BlankController = {
    blank: (req, res) => {
        res.render('blank.hbs', {
            morris: true
        });
    },
};

module.exports = { BlankController };