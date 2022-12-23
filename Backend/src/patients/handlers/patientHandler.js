'use strict';
const { corsHeader } = require('../../shared/headers/corsHeader');
const patientService = require('../services/patientService');

module.exports.getAll = async (event, context, callback) => {
  try {
    const patients = await patientService.getAll();
    return {
      headers: corsHeader,
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        patients: patients,
        message: 'Pacientes recuperados com sucesso.'
     })
    }
  } catch ( err) {
    return {
      headers: corsHeader,
      statusCode: err.statusCode,
      body: JSON.stringify({ success: false, message: err.message })
    }
  }
};

module.exports.getById = async (event, context, callback) => {
  const id = event.pathParameters.id;

  try {
    const patient = await patientService.getById(id);
    return {
      headers: corsHeader,
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        patient: patient,
        message: 'Paciente recuperado com sucesso.'
     })
    }
  } catch (err) {
    return {
      headers: corsHeader,
      statusCode: err.statusCode,
      body: JSON.stringify({ success: false, message: err.message })
    }
  }
};

module.exports.create = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body);

    const patient = await patientService.create(data);

    return {
      headers: corsHeader,
      statusCode: 201,
      body: JSON.stringify({ 
        success: true, 
        patient: patient, 
        message: "Paciente criado com sucesso."
     })
    }
  } catch (err) {
    return {
      headers: corsHeader,
      statusCode: err.statusCode,
      body: JSON.stringify({ success: false, message: err.message })
    } 
  }

};

module.exports.update = async (event, context, callback) => {
  const id = event.pathParameters.id;

  try {
    const data = JSON.parse(event.body);

    const patient = await patientService.update(data, id);

    return {
      headers: corsHeader,
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        patient: patient, 
        message: "Paciente atualizado com sucesso." 
      })
    };
  } catch (err) {
    return {
      headers: corsHeader,
      statusCode: err.statusCode,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};

module.exports.delete = async (event, context, callback) => {
  const id = event.pathParameters.id;

  try {
    await patientService.delete(id);

    return {
      headers: corsHeader,
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: "Paciente removido com sucesso." 
      })
    };
  } catch (err) {
    return {
      headers: corsHeader,
      statusCode: err.statusCode,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};

