const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const transactionRoute = require('./routes/transactions')
const listRoute = require('./routes/lists')

module.exports = (app,express) => {
    app.use(express.json())
    app.use('/api/auth',authRoute)
    app.use('/api/users',userRoute)
    app.use('/api/transaction',transactionRoute)
    app.use('/api/lists',listRoute)
}