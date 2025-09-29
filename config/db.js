import dbConfig from './dbConfig.js'
import { Sequelize } from 'sequelize'

const sequelize = new Sequelize({
    database: dbConfig.DB,
    username: dbConfig.USER,
    host: dbConfig.HOST,
    password: dbConfig.PASSWORD,
    dialect: "mysql",
    logging: false
})

export default sequelize;