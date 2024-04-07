import { prisma } from '../src/lib/prisma'

async function seed() {
    await prisma.event.create({
        data:{
            id:'d2d74e4b-6bfa-4539-8a9a-aa4b486266a6',
            title: 'My Event',
            slug: 'my-event',  
            details: 'This is my event',
            maximumAttendees: 120,
        }
    })
}
    seed().then (() =>{
        console.log('seeded')
        prisma.$disconnect()
    })
