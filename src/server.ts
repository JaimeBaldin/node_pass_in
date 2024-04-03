import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { createEventRoute } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";


const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEventRoute)
app.register(registerForEvent)

app.listen({port: 3333}).then(() => {
    console.log("Server is running on port 3333");
});