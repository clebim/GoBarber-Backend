import { Model, DataTypes } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

//criando model usando extends model
class Appointment extends Model {
    static init(sequelize){
        super.init({
            date: DataTypes.DATE,
            canceled_at: DataTypes.DATE,
            past: {
                type: DataTypes.VIRTUAL,
                get() {
                    return isBefore(this.date, new Date());
                },
            },
            cancelable: {
                type: DataTypes.VIRTUAL,
                get() {
                    return isBefore(new Date(), subHours(this.date, 2) );
                }
            }
        }, 
        {
            sequelize,
        });

       return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user'});
        this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider'});
    }

    
}

export default Appointment;
