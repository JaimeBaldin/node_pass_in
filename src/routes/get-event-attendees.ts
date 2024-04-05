import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId/attendees', {
            schema: {
                params: z.object({
                    eventId: z.string().uuid()
                }),

                querystring: z.object({
                    pageIndex: z.string().nullable().default('0').transform(Number),
                }),

                response:{},
            }
        }, async (request, reply) =>{
           const { eventId } = request.params
           const { pageIndex } = request.query

           const attendees = await prisma.attendee.findMany({
            select:{
                id: true,
                name: true,
                email: true,
                createdAt: true,
                checkIn: {
                    select: {
                        createdAt: true
                    }
                }
            },
            where: {
                    eventId,
                },
                take: 10,
                skip: pageIndex * 10,
           })

           return reply.send({
                attendees: attendees.map(attendee => {
                    return {
                        id: attendee.id,
                        name: attendee.name,
                        email: attendee.email,
                        createdAt: attendee.createdAt,
                        checkedInAt: attendee.checkIn?.createdAt
                    }
                })
           })
            
        })
}