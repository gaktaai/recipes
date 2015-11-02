//npm install zombie --save-dev

var Browser = require('zombie');

Browser.localhost(process.env.IP, process.env.PORT);

describe.only('User visits index page', function() {
    var browser = new Browser();
    
    before(function() {
        return browser.visit('/');
    });
});

describe('User visits new potion page', function (argument) {

    var browser = new Browser();
    
    before(function() {
        return browser.visit('/potions/new');
    });
    
    it('should go to the authentication page', function () {
        browser.assert.redirected();
        browser.assert.success();
        browser.assert.url({ pathname: '/login' });
    });
    
    it('should be able to login with correct credentials', function (done) {
        browser
            .fill('ss', 'ss')
            .fill('password', 'jelszo')
            .pressButton('button[type=submit]')
            .then(function () {
                browser.assert.redirected();
                browser.assert.success();
                browser.assert.url({ pathname: '/errors/list' });
                done();
            });
    });
});

it('should be successful', function() {
    Browser.assert.success();
});

it('should show the list page', function() {
    Browser.assert.text('div.jumbotron > div.page-header > h1', 'List of potions');
});