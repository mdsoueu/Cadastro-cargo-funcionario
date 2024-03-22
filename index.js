const Sequelize = require('sequelize');
const expresss = require('express');
const servidor = expresss();

/* Armazena a conexão com o BD */
/* nome do BD, user, senha  */
const conexao = new Sequelize('nodejs', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

/* com o then() eu consigo a resposta que deu certo */
/* com o catch eu consigo a resposta que deu errado */
conexao.authenticate().then(() => {
    console.log('Conectado com sucesso.')
}).catch((erro) => {
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
    },
    funcao: {
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

/* GET - consulta */
servidor.get('/principalCargo', async (requisicao, resposta) => {
    const cargos = await Cargo.findAll();
    resposta.send(cargos);
});

/* POST - adicionar */
servidor.post('/principalCargo', (requisicao, resposta) => {
    const funcao = requisicao.body.funcao;
    const descricao = requisicao.body.descricao;

    Cargo.create({ descricao: descricao }).then(() => {
        resposta.send('Cadastrado feito.');

    }).catch((erro) => {
        resposta.send('Ocorreu erro: ' + erro);
    })

    Cargo.create({ funcao: funcao }).then(() => {
        resposta.send('Cadastrado feito.');

    }).catch((erro) => {
        resposta.send('Ocorreu erro: ' + erro);
    })
});

servidor.listen(4300, () => {
    console.log('Meu primeiro servidor na porta 4300.');
});