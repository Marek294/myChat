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

                    chat.set('name', displayName);
                }
            })

            res.json(chats);
        }
    })
});

router.get('/:id', authenticate, (req,res) => {
    Chat.query({
        where: { id: req.params.id }
    }).fetch({withRelated: ['messages']}).then(chat => {
        if(chat) {
            if(chat.get('members').indexOf(req.currentUser.id) > -1) {
                res.json(chat);
            } else res.status(403).json({errors: 'You have no access to this chat'});
        } else res.status(403).json({errors: 'There is no chat with such id'});
    })
});

router.get('/:friendId', authenticate, (req,res) => {
    const members = [req.currentUser.id, parseInt(req.params.friendId)];

    const reverseMembers = [parseInt(req.params.friendId), req.currentUser.id];

    Chat.query( qb => {
        qb.where('members', '=' , members).orWhere('members', '=' , reverseMembers);
    }).fetch({withRelated: ['messages']}).then(chat => {
        if(chat) {
            const index = chat.get('name').indexOf(req.currentUser.get('username'));
            if(index > -1) {
                let displayName = chat.get('name');
                index > 0   ? displayName = displayName.substr(0,index-1) + displayName.substr(index+req.currentUser.get('username').length,displayName.length)
                    : displayName = displayName.substr(req.currentUser.get('username').length+1,displayName.length);

                chat.set('name', displayName);
            }

            res.json(chat);
        } else res.status(403).json({errors: 'There is no chat with this friend'});
    })
});

export default router;