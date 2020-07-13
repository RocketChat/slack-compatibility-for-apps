import { UserType, IUser } from '@rocket.chat/apps-engine/definition/users';

export const userRepository: {[K: string]: IUser} = {
    'a-user-id': {
        id: 'a-user-id',
        name: 'A User',
        username: 'user.name',
        type: UserType.USER,
    } as IUser,
}
