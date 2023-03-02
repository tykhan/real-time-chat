// import ably
import Ably, { Types } from "ably";
import { useEffect } from 'react';

const ably = new Ably.Realtime.Promise({ authUrl: '/api/create_token' });

export function useChannel(channelName: string, callbackOnMessage: (message: Types.Message) => void) {
    const channel = ably.channels.get(channelName);

    useEffect(() => {
        channel.subscribe((msg) => {
            callbackOnMessage(msg);
        });

        // return () => channel.unsubscribe();
    }, []);

    return [channel, ably];
}