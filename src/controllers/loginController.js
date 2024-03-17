const LoginController = {
    login: (req, res) => {
        res.render('login.hbs', {
            morris: true
        });
    },
};

module.exports = { LoginController };