const Sequelize = require('sequelize');
const db = require('../../config/sequelize.config');

class Patient extends Sequelize.Model {};

Patient.init({
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    birthDate: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'birthDate'
    },
    email:  {
        type: Sequelize.STRING,
        allowNull: false
    },
    postalCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    streetAddress: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, { sequelize: db, modelName: 'patients' });

module.exports = Patient;