const express = require('express');

const Accounts = require('../data/accountsModel');

const router = express.Router();
////////////////////////////////////////////
router.post('/', validateAccount, (req, res) => {
    const changes = req.body;

    Accounts.insert(changes)
        .then(data => {
            console.log(data);
            res.status(201).json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: 'sorry, we ran into an error creating the Account',
            });
        });
});

////////////////////////////////////////////

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Accounts.findById(id)
        .then(data => {
            if (data.length != 0) {
                res.status(200).json(data);
            } else {
                return res.status(400).json({
                    errorMessage: "The Account with ID could not be retrieved."
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: "The Account information could not be retrieved."
            });
        })
});

////////////////////////////////////////////

router.get('/', (req, res) => {
    // read the data from the database
    Accounts.find() // return a promise
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            console.log(error);
            // handle the error
            res.status(500).json({
                errorMessage: 'The Account information could not be retrieved.',
            });
        });
});

////////////////////////////////////////////

router.delete('/:id', validateAccountId, (req, res) => {
    const id = req.params.id;

    Accounts.remove(id)
        .then(deleted => {
            res.status(200).json(deleted);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: "The Account could not be removed"
            });
        });
});
////////////////////////////////////////////

router.put('/:id', validateAccountId, (req, res) => {
    const changes = req.body;
    Accounts.update(req.params.id, changes)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                errorMessage: 'The Account information could not be modified.',
            });
        });
});
////////////////////////////////////////////

//custom middleware

function validateAccountId(req, res, next) {
    Accounts.findById(req.params.id)
        .then(data => {
            if (data.length == 0) {
                return res.status(400).json({
                    errorMessage: "invalid Account id"
                });
            }
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                errorMessage: "The Account information could not be retrieved."
            });
        })
    next();
}

function validateAccount(req, res, next) {
    const changes = req.body;
    if (!changes || !changes.name || !changes.budget ) {
        return res.status(400).json({ errorMessage: 'missing required  field' });
    }
    next();
}
module.exports = router;
