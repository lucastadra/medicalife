const Patient = require("../models/patientModel");
const { v4: uuidv4 } = require('uuid');
const AppError = require('../../shared/errors/appError');


exports.getAll = async () => {
    const patients =  await Patient.findAll();
    return patients;
}

exports.getById = async (patientId) => {
    if (!patientId) throw new AppError("Id de paciente não informado.", 400);

    const patientExists =  await Patient.findByPk(patientId);

    if (!patientExists) throw new AppError("Paciente não encontrado.", 404);

    return patientExists.toJSON();
}

exports.create = async (patient) => {
    if (!patient) throw new AppError("Dados de paciente não fornecidos.", 400);
    if (!patient.name) throw new AppError("O campo Nome deve ser preenchido.", 400);
    if (!patient.email) throw new AppError("O campo Email deve ser preenchido.", 400);
    if (!patient.birthDate) throw new AppError('O campo Data de Nascimento deve ser preenchido.', 400);

    if (!patient.city) throw new AppError("O campo Cidade deve ser preenchido.", 400);
    if (!patient.postalCode) throw new AppError("O campo CEP deve ser preenchido.", 400);
    if (!patient.state) throw new AppError("O campo Estado deve ser preenchido.", 400);
    if (!patient.streetAddress) throw new AppError('O campo Logradouro deve ser preenchido.', 400);

    const patientExists =  await Patient.findOne({ where: { email: patient.email }});

    if (patientExists) throw new AppError("Já existe um paciente registrado com esse email.", 409);

    const newPatient = await Patient.create({
        id: uuidv4(),
        name: patient.name,
        birthDate: new Date(patient.birthDate).toUTCString(),
        email: patient.email,
        postalCode: patient.postalCode ?? '',
        streetAddress: patient.streetAddress ?? '',
        city: patient.city ?? '',
        state: patient.state ?? ''
    });

    return newPatient.toJSON();
}

exports.update = async (patient, patientId) => {

    if (!patientId) throw new AppError("Id de paciente não informado.", 400);
    if (!patient) throw new AppError("Dados de paciente não fornecidos.", 400);
    if (!patient.name) throw new AppError("O campo Nome deve ser preenchido.", 400);
    if (!patient.email) throw new AppError("O campo Email deve ser preenchido.", 400);
    if (!patient.birthDate) throw new AppError('O campo Data de Nascimento deve ser preenchido.', 400);

    if (!patient.city) throw new AppError("O campo Cidade deve ser preenchido.", 400);
    if (!patient.postalCode) throw new AppError("O campo CEP deve ser preenchido.", 400);
    if (!patient.state) throw new AppError("O campo Estado deve ser preenchido.", 400);
    if (!patient.streetAddress) throw new AppError('O campo Logradouro deve ser preenchido.', 400);

    const patientExists = await Patient.findByPk(patientId);

    if (!patientExists) throw new AppError("Paciente não encontrado.", 404);
    
    /* Patient Info */
    const currentBirthDate = new Date(patientExists.birthDate).toUTCString();
    const newBirthDate = new Date(patient.birthDate).toUTCString();
    if (currentBirthDate !== newBirthDate) patientExists.birthDate = newBirthDate;
    patientExists.name = patient.name || patientExists.name;
    patientExists.email = patient.email || patientExists.email;

    /* Address */
    patientExists.postalCode = patient.postalCode || patientExists.postalCode.replace('-', '');
    patientExists.streetAddress = patient.streetAddress || patientExists.streetAddress;
    patientExists.city = patient.city || patientExists.city;
    patientExists.state = patient.state || patientExists.state;

    await patientExists.save();

    return patientExists.toJSON();
}

exports.delete = async (patientId) => {
    
    if (!patientId) throw new AppError("Id de paciente não informado.", 400);

    const patientExists =  await Patient.findByPk(patientId);

    if (!patientExists) throw new AppError("Paciente não encontrado.", 404);
    
    await patientExists.destroy();

}