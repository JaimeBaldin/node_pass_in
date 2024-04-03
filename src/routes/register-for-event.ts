import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";

export async function registerForEvent(app: FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events/:eventId/attendees', {
            schema: {
                body: z.object({
                    name: z.string().min(4),
                    email: z.string().email(),
                }),
                params: z.object({
                    eventId: z.string().uuid(),
                }),
                response: {
                    201: z.object({
                        attendeeId: z.number(),
                    })
                }
            }
        }, async (request, reply) => {
            const { eventId } = request.params;
            const { name, email } = request.body;

            const attendeeFromEmail = await prisma.attendee.findUnique({
                where: {
                    email_eventId: {
                        email,
                        eventId,
                    
                    }
                }
            })

            if(attendeeFromEmail){
                throw new Error("This email already registered for this event");
            }

            const attendee =  await prisma.attendee.create({
                data: {
                    name,
                    email,
                    eventId,
                }
            })

            return reply.status(201).send({attendeeId: attendee.id});
        })
}