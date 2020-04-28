/*import { DataTypes } from 'sequelize';
import connection from '../../database/index'

const User = connection.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    provider: DataTypes.BOOLEAN,

}, {})

export default User;
*/
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

//criando model usando extends model
class User extends Model {
    static init(sequelize){
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.VIRTUAL,
            password_hash: DataTypes.STRING,
            provider: DataTypes.BOOLEAN,
        }, 
        {
            sequelize,
        });

        this.addHook('beforeSave', async (user) => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });

        return this;
    }

    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar'});
    }
    
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;





