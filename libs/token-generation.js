import database from "./database";

import {randomBytes} from 'crypto';
import {addMinutes} from 'date-fns';

export async function GenerateToken(userId){
    const token = randomBytes(32).toString('hex');
    const expiresAt = addMinutes(new Date(), 100);
    


    await database.passwordResetToken.upsert({
        where: {userId},
        update: {token, expiresAt},
        create: {userId, token, expiresAt},
    });
    return token;
}