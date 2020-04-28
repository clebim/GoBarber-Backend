import Notification from '../Schemas/Notification';
import User from '../models/User';

export default {
    async index(req, res){
        const checkProvider = await User.findOne({
            where: { id: req.userId, provider: true }
        });
        
        if(!checkProvider){
            return res.status(401)
            .json({ error: "Only provider can load notifications"});
        };

        const notifications = await Notification.find({
            user: req.userId,
        }).sort({ createdAt: 'desc' }).limit(20);
        
        return res.json(notifications);
    },

    async update(req, res) {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true },
        )
        return res.json(notification);
    }
}