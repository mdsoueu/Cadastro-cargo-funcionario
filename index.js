const Sequelize = require('sequelize');
const expresss = require('express');
const servidor = expresss();
servidor.use(expresss.json());

/* Armazena a conexão com o BD */
const conexao = new Sequelize('nodejs', 'root', 'root', {
    /* nome do BD, user, senha  */
    host: 'localhost',
    dialect: 'mysql'
});

conexao.authenticate().then(() => {
    /* com o then() eu consigo a resposta que deu certo */
    console.log('Conectado com sucesso.')
}).catch((erro) => {
    /* com o catch eu consigo a resposta que deu errado */
    console.log('Erro: ', erro)
});

/*nome da tabela */
const Cargo = conexao.define('cargos', {
    /* coluna com cada tipo e atributo */
    codigo: {
        type: Sequelize.INTEGER, /* Sequelize é uma classe */
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    descricao: {
        type: Sequelize.STRING(150),
        allowNull: false
    }

}, { timestamps: false });

/*nome da tabela */
const Usuario = conexao.define('usuario', {
    /* coluna com cada tipo e atributo */
    codigo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING(150),
        allowNull: false
    },
    idade: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    cargoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Cargo,
            key: 'codigo'
        }
    }
}, { timestamps: false });

// ou 
// Usuario.belongsTo(Cargo);
// Cargo.hasMany(Usuario);

Cargo.sync({
    alter: true
});

Usuario.sync({
    alter: true
});

/********** CARGO **********/
/* GET */
/*http://localhost:4300/principalCargo */
servidor.get('/principalCargo', async (requisicao, resposta) => {
    const cargos = await Cargo.findAll();
    resposta.send(cargos);
});
/* POST */
/*http://localhost:4300/principalCargo */
servidor.post('/principalCargo', (requisicao, resposta) => {
    const descricao = requisicao.body.descricao;

    Cargo.create({ descricao: descricao }).then(() => {
        resposta.send('Cadastrado feito.');
    }).catch((erro) => {
        resposta.send('Ocorreu erro: ' + erro);
    })

});
/* PUT */
/*http://localhost:4300/principalCargo/4 */
servidor.put('/principalCargo/:id', (requisicao, resposta) => {
    const id = requisicao.params.id;
    const descricao = requisicao.body.descricao;

    Cargo.findOne({ where: { codigo: id } }).then(cargo => {
        if (!cargo) {
            resposta.status(404).send('Cargo não encontrado.');
        } else {
            // Atualizar a descrição do cargo
            cargo.update({ descricao: descricao }).then(() => {
                resposta.send('Cargo atualizado.');
            }).catch(erro => {
                resposta.status(500).send('Erro ao atualizar o cargo: ' + erro);
            });
        }
    }).catch((erro) => {
        resposta.send('Ocorreu um erro ao atualizar o cargo: ' + erro);
    });
});
/* DELETE */
/*http://localhost:4300/principalCargo/3 */
servidor.delete('/principalCargo/:id', (requisicao, resposta) => {
    const id = requisicao.params.id;

    Cargo.findOne({ where: { codigo: id } }).then(cargo => {
        if (!cargo) {
            resposta.status(404).send('Cargo não encontrado.');
        } else {
            // Atualizar a descrição do cargo
            cargo.destroy().then(() => {
                resposta.send('Cargo deletado.');
            }).catch(erro => {
                resposta.status(500).send('Erro ao deletar o cargo: ' + erro);
            });
        }
    }).catch((erro) => {
        resposta.send('Ocorreu um erro ao deletar o cargo: ' + erro);
    });
});

/********** USUÁRIO **********/
/* GET */
/* http://localhost:4300/principalUsuario */
servidor.get('/principalUsuario', async (requisicao, resposta) => {
    const pessoa = await Usuario.findAll();
    resposta.send(pessoa);
});
/* POST */
/* http://localhost:4300/principalUsuario */
servidor.post('/principalUsuario', (requisicao, resposta) => {
    const nome = requisicao.body.nome;
    const idade = requisicao.body.idade;
    const cargoId = requisicao.body.cargoId;

    Usuario.create({ nome: nome, idade: idade, cargoId:cargoId }).then(() => {
        resposta.send('Cadastrado de usuário feito.');
    }).catch((erro) => {
        resposta.send('Ocorreu erro: ' + erro);
    })

});
/* PUT */
/* http://localhost:4300/principalUsuario/1 */
servidor.put('/principalUsuario/:id', (requisicao, resposta) => {
    const id = requisicao.params.id;
    const nome = requisicao.body.nome;
    const idade = requisicao.body.idade;
    const cargoId = requisicao.body.cargoId;

    Cargo.findOne({ where: { codigo: id } }).then(usuario => {
        if (!usuario) {
            resposta.status(404).send('Usuário não encontrado.');
        } else {
            usuario.update({ nome: nome, idade: idade, cargoId:cargoId }).then(() => {
                resposta.send('Usuário atualizado.');
            }).catch(erro => {
                resposta.status(500).send('Erro ao atualizar usuário: ' + erro);
            });
        }
    }).catch((erro) => {
        resposta.send('Ocorreu um erro ao atualizar usuário: ' + erro);
    });
});
/* DELETE */
/* http://localhost:4300/principalUsuario/1 */
servidor.delete('/principalUsuario/:id', (requisicao, resposta) => {
    const id = requisicao.params.id;

    Usuario.findOne({ where: { codigo: id } }).then(usuario => {
        if (!usuario) {
            resposta.status(404).send('Usuário não encontrado.');
        } else {
            usuario.destroy().then(() => {
                resposta.send('Usuário deletado.');
            }).catch(erro => {
                resposta.status(500).send('Erro ao deletar usuário: ' + erro);
            });
        }
    }).catch((erro) => {
        resposta.send('Ocorreu um erro ao deletar usuário: ' + erro);
    });
});

servidor.listen(4300, () => {
    console.log('Meu primeiro servidor na porta 4300.');
});