import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import UdpSocket from 'react-native-udp';
import { NetworkInfo } from 'react-native-network-info';

function ClientApp() {
    const [connectionStatus, setConnectionStatus] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [receivedMessage, setReceivedMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [customMessage, setCustomMessage] = useState('');
    const [targetIp, setTargetIp] = useState('');
    const [targetPort, setTargetPort] = useState('8888');

    useEffect(() => {
        const fetchIpAddress = async () => {
            const ip = await NetworkInfo.getIPV4Address();
            setIpAddress(ip);
        };

        fetchIpAddress();

        const client = UdpSocket.createSocket('udp4');
        client.bind(8887);

        client.on('message', (data, rinfo) => {
            const message = data.toString();
            setReceivedMessage(message);
            console.log('Message received:', message);
        });

        client.on('listening', () => {
            console.log('Client listening on port 8887');
            setConnectionStatus('Client listening on port 8887');
        });

        setSocket(client);

        return () => {
            socket && socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (!customMessage || !socket || !targetIp || !targetPort) return;

        socket.send(customMessage, undefined, undefined, parseInt(targetPort, 10), targetIp, (error) => {
            if (error) {
                console.log('Error sending the message:', error);
            } else {
                console.log('Message sent successfully');
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.statusText}>{connectionStatus}</Text>
            <Text style={styles.ipText}>Client IP Address: {ipAddress}</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter target IP"
                value={targetIp}
                onChangeText={setTargetIp}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter target port"
                value={targetPort}
                onChangeText={setTargetPort}
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Enter your message"
                value={customMessage}
                onChangeText={setCustomMessage}
            />
            <Button title="Send Message" onPress={sendMessage} />
            <Text style={styles.messageText}>Received Message: {receivedMessage}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5fcff',
    },
    statusText: {
        fontSize: 16,
        marginBottom: 20,
    },
    ipText: {
        fontSize: 16,
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        width: '100%',
    },
    messageText: {
        fontSize: 16,
        marginTop: 20,
        fontWeight: 'bold',
    },
});

export default ClientApp;