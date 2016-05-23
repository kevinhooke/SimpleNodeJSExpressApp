//based on steps in tutorial from
//https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

var express    = require('express');
var app        = express(); //init Express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var Contact        = require('./app/models/Contact');
mongoose.connect('mongodb://nodetest:nodetest@localhost:27017/nodetest');


//init bodyParser to extract properties from POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

//init Express Router
var router = express.Router();

//default/test route
router.get('/', function(req, res) {
    res.json({ message: 'App is running!' });
});

router.route('/contacts/:contact_id')
// retrieve contact: GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Contact.findById(req.params.contact_id, function(err, contact) {
            if (err)
                res.send(err);
            res.json(contact);
        });
    })
    // update contact: PUT http://localhost:8080/api/contacts/{id}
    .put(function(req, res) {
        Contact.findById(req.params.contact_id, function(err, contact) {
            if (err) {
            res.send(err);
            }
            else {
                contact.firstName = req.body.firstname;
                contact.lastName = req.body.lastname;
                contact.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Contact updated!' });
                })
            }
        });
    })
    //delete a contact
    .delete(function(req, res) {
        Contact.remove({
            _id: req.params.contact_id
        }, function(err, contact) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted contact' });
        });
    });

router.route('/contacts')
    // create contact: POST http://localhost:8080/api/contacts
    .post(function(req, res) {

        var contact = new Contact();
        contact.firstName = req.body.firstname;
        contact.lastName = req.body.lastname;

        contact.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Contact created!' });
        });

    })
    //GET all contacts: http://localhost:8080/api/contacts
    .get(function(req, res) {
        Contact.find(function(err, contacts) {
            if (err)
                res.send(err);

            res.json(contacts);
        });
    });



//associate router to url path
app.use('/api', router);

//start the Express server
app.listen(port);
console.log('Listening on port ' + port);