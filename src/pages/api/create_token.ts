import { Types } from 'ably';
import Ably from 'ably/promises';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Types.TokenRequest>) {
    const ably = new Ably.Realtime.Promise(process.env.ABLY_API_KEY!);
    await ably.connection.once('connected');
    const tokenRequestData = await ably.auth.createTokenRequest({ clientId: 'real-time-chat' });

    res.status(200).json(tokenRequestData);
};