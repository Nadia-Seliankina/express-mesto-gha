// Вынесем логику ответов в отдельный модуль

// const { mainPageMarkup, submitSuccessMarkup } = require('./views');

// const todos = [];

// const getMainPage = (req, res) => {
// res.writeHead(200, {
// 'Content-Type': 'text/html'
// });

// res.end(mainPageMarkup);
// };

// const postForm = (req, res) => {
// let body = '';

// req.on('data', (chunk) => {
// body += chunk;
// });

// req.on('end', () => {

// todos.push(body.split('=')[1]);
// console.log(todos);

// верните успешный ответ с разметкой submitSuccessMarkup
// res.writeHead(200, {
// 'Content-Type': 'text/html'
// });

// res.end(submitSuccessMarkup);
// });
// };

// const router = (req, res) => {
// if (req.url === '/submit' && req.method === 'POST') {
// postForm(req, res);
// }

// if (req.url === '/' && req.method === 'GET') {
// getMainPage(req, res);
// }
// };

// module.exports = {
// router
// };

// module.exports = {
// getMainPage,
// postForm
// };
