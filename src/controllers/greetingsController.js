const WelcomeController = {
    helloWorld: (req, res) => {
        res.json({
            message: "Hello, World!",
        });
    },
    helloRahul: (req, res) => {
        res.json({
            message: "Hello, Rahul!",
        });
    }
};

module.exports = { WelcomeController };