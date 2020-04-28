import User from '../models/User';
import File from '../models/File';
import * as Yup from 'yup';

export default {
    async create(req, res) {
        
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'validation fails'});
        }
 
        const { name, email, password, provider } = req.body;
        const user_Exist = await User.findOne({ where: { email: email }});

        if(user_Exist){
            return res.status(400).json({ error: "user already exists. "});
        }

        const user = await User.create({
            name,
            email,
            password,
            provider,
        });

        res.json({ id: user.id, name: user.name, email: user.email, provider: user.provider });
    },

    async update(req, res) {
        
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field
            ),
            confirmPassword: Yup.string().when('password', (password, field) => 
                password ? field.required().oneOf([Yup.ref('password')]) : field
            ),
        });
        
        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'validation fails'});
        }
        
        const { email, oldPassword } = req.body;
        const user = await User.findByPk(req.userId); 

        if(email != user.email) {
            const user_Exist = await User.findOne({ where: { email: email }});

            if(user_Exist){
                return res.status(400).json({ error: "user already exists. "});
            }    
        }

        if(oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match'})
        }

        await user.update(req.body);

        const { id, name, avatar} = await User.findByPk(req.userId, {
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'path', 'url'],
                }
            ],
        });

        return res.json({id, name, email, avatar});
    }
}