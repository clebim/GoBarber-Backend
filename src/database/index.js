import { Sequelize }from 'sequelize';


import database from '../config/database';
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const connection = new Sequelize(database);

User.init(connection); //passa a coneçao de usar classe no MODEL;
File.init(connection);
Appointment.init(connection);

User.associate(connection.models);
Appointment.associate(connection.models);


export default connection;


