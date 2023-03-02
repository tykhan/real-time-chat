import React, { FormEvent, KeyboardEvent, MutableRefObject, Ref, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useChannel } from '@/hooks/useChannel.hook';
import styles from './Chat.module.scss';
import { Types } from 'ably';

export default function Chat () {
    const [messageText, setMessageText] = useState("");
    const [receivedMessages, setMessages] = useState<Types.Message[]>([]);
    const messageTextIsEmpty = messageText.trim().length === 0;
    const inputBox: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);
    const chatBodyRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

    const [channel, ably] = useChannel("chat-demo", (message) => {
        setMessages(prev => [...prev, message]);
    });

    useLayoutEffect(() => {
        chatBodyRef && chatBodyRef.current?.scrollTo({ top: chatBodyRef.current?.clientHeight });
    }, [receivedMessages]);

    useEffect(() => {
        (channel as Types.RealtimeChannelPromise).history().then((response) => {
            const sortedByDate = response.items.sort((a, b) => b.timestamp - a.timestamp);
    
            setMessages(sortedByDate);
        })
    }, []);



    const sendChatMessage = (text: string) => {
        (channel as Types.RealtimeChannelPromise).publish({
            name: "chat-message",
            data: text
        });

        setMessageText('');
        inputBox.current?.focus();
    };

    const handleFormSubmission = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        sendChatMessage(messageText);
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key !== 'Enter' || messageTextIsEmpty) return;

        sendChatMessage(messageText);
        event.preventDefault();
    };

    console.log(receivedMessages);

    const messages = receivedMessages.map((message, index) => {
        const author = message.connectionId === (ably as Types.RealtimePromise).connection.id ? "me" : "other";
        const date = new Date(message.timestamp).toLocaleTimeString();


        return (
            <div className={styles.messageWrapper} key={message.id}>
                <div className={styles.message}>
                    {message.data}
                </div>
                <div className={styles.msgDate}>{date}</div>
            </div>
            // </div>
                // {/* <div key={index} className={styles.message} data-author={author}>
                //     {message.data}
                // </div> */}
        );
    });
    
    return (
        <div className={styles.chatsContainer}>
            <h1 className={styles.chatsHeader}>Live Chat</h1>

            <div className={styles.chatBody} ref={chatBodyRef}>
                {messages}
                {/* <div ref={(element) => { messageEnd = element; }}></div> */}
                {/* // empty element to control scroll to bottom */}
            </div>

            <form onSubmit={handleFormSubmission} className={styles.form}>
                <textarea
                    ref={inputBox}
                    value={messageText}
                    placeholder="Type a message..."
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className={styles.textarea}
                ></textarea>
                <button type="submit" className={styles.button} disabled={messageTextIsEmpty}>
                    Send
                </button>
            </form>
        </div>
    )
}