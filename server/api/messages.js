import express from 'express';

import Chat from '../models/chat';
import Message from '../models/message';

import authenticate from '../middlewares/authenticate';

let router = express.Router();

router.post('/', authenticate, (req,res) => {
    const { chat_id, content } = req.body;
    const sender_id = req.currentUser.id;

    Message.forge({
        chat_id,
        sender_id,
        content
    }).save().then(message => {
        res.json(message);
    })
    .catch(err => {
        res.status(500).json({ errors: err });
    });
});

router.get('/:chatId', authenticate, (req,res) => {
    const p1 = Message.query({
                    where: { chat_id: req.params.chatId }
                }).fetchAll();

    const p2 = Chat.query({
                    where: { id: req.params.chatId }
                }).fetch();

    Promise.all([p1,p2]).then(values => {
        if(values[1]) {
            if(values[1].get('members').indexOf(req.currentUser.id) > -1) {
                res.json(values[0]);
            } else res.status(403).json({errors: 'You have no access to this chat'});
        } else res.status(403).json({errors: 'There is no chat with such id'});
    });
});

export default router;