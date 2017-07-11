import express from 'express';

import Chat from '../models/chat';

import authenticate from '../middlewares/authenticate';

let router = express.Router();

router.get('/all', authenticate, (req,res) => {
    let member = [];
    member.push(req.currentUser.id);

    Chat.query( qb => {
        qb.where('members', '@>', member);
    }).fetchAll().then(chats => {
        if(chats) {
            chats.map(chat => {
                const index = chat.get('name').indexOf(req.currentUser.get('username'));
                if(index > -1) {
                    let displayName = chat.get('name');
                    index > 0   ? displayName = displayName.substr(0,index-1) + displayName.substr(index+req.currentUser.get('username').length,displayName.length)
                                : displayName = displayName.substr(req.currentUser.get('username').length+1,displayName.length);
                    console.log(displayName);
                    chat.set('name', displayName);
                }
            })

            res.json(chats);
        }
    })
});

export default router;