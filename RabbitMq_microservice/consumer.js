import amqp from "amqplib";

async function startConsumer() {
    const queue = 'user_registered';
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue,{durable : false});

    console.log('Waiting for message in queue:',queue);
    channel.consume(queue,(msg)=>{
        if(msg !==null){
            const content = msg.content.toString();
            console.log('Welcome Email Event',content);
            channel.ack(msg);
        }
    })
}

startConsumer().catch(console.error);