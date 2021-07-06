
var ghpages = require('gh-pages');
var path = require('path');

ghpages.publish(path.join(__dirname, 'build'), {
    branch: 'gh-pages',
    user: {
        name: 'Harris Masood',
        email: 'harrismasood15@gmail.com'
    }
}, (err) => console.log(err));