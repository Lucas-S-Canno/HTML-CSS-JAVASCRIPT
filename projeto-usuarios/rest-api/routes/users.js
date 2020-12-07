let NeDB = require('nedb');
let db = new NeDB({
    filename: 'users.db',
    autoload: true,
});

module.exports = (app) => {

    let route = app.route('/users');
    let routeId = app.route('/users/:id');

    route.get((req, res) => { //buscar dados de todos os usuários
        db.find({}).sort({
            name: 1
        }).exec((err, user) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user);
            }
        });
    });

    routeId.get((req, res) => { //buscar dados de um único usuário
        db.findOne({
            _id: req.params.id
        }).exec((err, user) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user);
            }
        });
    });

    route.post((req, res) => { //acrescentar um novo usuário
        if (!app.utils.validator.user(app, req, res)) return false; //se retorna false na função, então retorna false na execução do post
        db.insert(req.body, (err, user) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(user);
            }
        });
    });

    routeId.put((req, res) => { //update de dados
        if (!app.utils.validator.user(app, req, res)) return false;
        db.update({
            _id: req.params.id
        }, req.body, err => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(Object.assign(req.body, req.params)); //req.body mostra os dados ca conta e o req.params o id, o assign é usado para juntar os dois dados
            }
        });
    });

    routeId.delete((req, res) => {
        db.remove({
            _id: req.params.id
        }, {}, err => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(req.params); //req.body mostra os dados ca conta e o req.params o id, o assign é usado para juntar os dois dados
            }
        });
    });

};