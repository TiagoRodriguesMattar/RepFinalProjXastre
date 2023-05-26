const {ipcRenderer} = require('electron');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const nome_comercial = document.querySelector('#nome_comercial');
const descricao = document.querySelector('#descricao');
const carga_horaria = document.querySelector('#carga_horaria');
const inicio_inscricoes = document.querySelector('#inicio_inscricoes');
const fim_inscricoes = document.querySelector('#fim_inscricoes');
const inicio_treinamento = document.querySelector('#inicio_inscricoes');
const fim_treinamento = document.querySelector('#fim_inscricoes');
const min_inscritos = document.querySelector('#min_inscritos');
const max_inscritos = document.querySelector('#max_inscritos');