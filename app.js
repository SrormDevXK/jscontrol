const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)

// Порт и база данных
const PORT = 3000
const DATABASE_NAME = "node_project"

/**
 * Модели для работы с Mongoose
 */
const MyModel = require('./models/Model')

/**
 * Статичная папка
 */
app.use(express.static('static'))

/**
 * Синхронизация сессии и MongoDB
 */
const store = new MongoStore({
    collection: 'sessions', // название коллекции в бд
    uri: `mongodb://localhost/${DATABASE_NAME}` // ключ для соединения с бд
})
app.use(session({
    secret: 'shpnodejs',
    resave: false,
    saveUninitialized: true,
    store: store, // синхронизация сессий и MongoDB
}))


/**
 * Настройка Handlebars для генерации шаблонов
 */
const hbs = handlebars.create({ 
    defaultLayout: 'main',
    extname: 'hbs'
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'pages')


/**
 * Подключенные Middlewares
 */
// Корректная обработка данных в теле запроса (req.body)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// При каждом запросе вызывается кастомный Middleware sayUserBody
app.use(sayUserBody)


/**
 * Маршруты для работы со страницами
 */
// Главный маршрут содержит в себе обработку Middleware sayMyMiddle
app.get('/', sayMyMiddle, (req, res) => {
    res.render('index')
})
app.get('/auth', (req, res) => {
    res.render('auth')
})
app.get('/tickets', (req, res) => {
    res.render('tickets')
})


/**
 * Маршруты для обработки запросов
 */
app.post('/api/form1', (req, res) => {
    // Вернуть ответом принятые в запросе данные
    res.json(req.body)
})
app.post('/api/form2/:id', (req, res) => {
    // Вернуть ответом динамический параметр ID из URL
    res.json(req.params.id)
})

/**
 * Middlewares
 */
// Выводит в консоль тело запроса пользователя
function sayUserBody(req, res, next) {
    console.log(req.body)
    next()
} 
function sayMyMiddle(req, res, next) {
    console.log('Сработал мой Middleware')
    next()
} 



/**
 * Функция дла подключение к MongoDB и запуска сервера
 * @param {Number} PORT Порт для запуска сервера
 * @param {String} DATABASE_NAME Название базы данных
 */
async function startServer() {
    await mongoose.connect(`mongodb://localhost/${DATABASE_NAME}`)
        .then(() => {
            console.log('Успешное подключение к MongoDB')
            app.listen(PORT, () => console.log(`Сервер запущен на ${PORT} порту`))
        })
        .catch(err => console.log(err))
}
// Вызов функции запуска с аргументами для установки порта и подключения к конкретной базе данных
startServer()