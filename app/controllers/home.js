
module.exports = {
    root: (req, res) => {
          res.send('Hello World');
    }
    , publicExample: (req, res) => {
        res.send("It's public data");
    }
    , privateExample: (req, res) => {
        res.send("It's private data");
    }
      
};