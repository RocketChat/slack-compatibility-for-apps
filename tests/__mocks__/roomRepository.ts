import { RoomType, IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { userRepository } from './userRepository';

export const roomRepository: {[K: string]: IRoom} = {
    'a-room-id': {
        id: 'a-room-id',
        creator: userRepository['a-user-id'],
        slugifiedName: 'a-room',
        type: RoomType.CHANNEL,
        usernames: ['user.name'],
    }
}
