import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from './styles.module.css';
import axios from 'axios';

export default function Chat() {
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([]);

    const localhost = 'http://localhost';
    const port = 3000;

    const baseUrl = `${localhost}:${port}`;

    async function auth() {
        return await axios.post(`${baseUrl}/api/v1/auth/login/basic/default`, {
            email: "pedro.bezerra@fabrica2s.com",
            password: "Brasil@2022"
        });
    }

    // 
    async function sendToBot(text, jwt) {
        const config = {
            headers: { Authorization: `Bearer ${jwt}` }
        };

        return await axios.post(`${baseUrl}/api/v1/bots/gloria/converse/pedro/secured?include=nlu,state,suggestions,decision`,
            {
                type: "text",
                text: text
            }, config);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (message.length === 0) {
            return
        }

        setConversation([...conversation, { text: message, type: 'sended' }]);
        setMessage('');

        await auth().then(async (res) => {
            const token = res.data.payload.jwt;

            await sendToBot(message, token).then((res) => {
                var responses = res.data.responses;
                responses = responses.map(response => {
                    return { text: response.text, type: 'received' };
                });

                setConversation((conversation) => {
                    var concated = conversation.concat(responses);
                    return concated
                });
            }).catch(err => {
                console.log('get response error:');
                console.log(err);
            })
        }).catch(err => {
            console.log('auth error:');
            console.log(err);
        });
    }

    function handleChange(e) {
        setMessage(e.target.value);
    }

    function handleKeyPress(e) {
        if (e.key === "Enter") {
            handleSubmit(e);
        }
    }

    useEffect(() => {
        var objScrDiv = document.getElementById('conversationContainer');
        objScrDiv.scrollTop = objScrDiv.scrollHeight;
    });

    return (
        <div>
            <div id='conversationContainer' className={styles.conversation}>
                {
                    conversation.map(msg => {
                        const style = msg.type == 'sended' ? styles.sended : styles.received;
                        return (
                            <div key={Math.random()} className={styles.conversationContainer}>
                                <div key={Math.random()} className={style}>{msg.text}</div>
                            </div>
                        )
                    })
                }
            </div>
            <Form className={styles.container} onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control value={message} as="textarea" rows={3} placeholder="Digite sua mensagem" onChange={handleChange} onKeyPress={handleKeyPress} />
                </Form.Group>

                <Button className='mt-3' type="submit">Enviar</Button>
            </Form>
        </div >
    );
}