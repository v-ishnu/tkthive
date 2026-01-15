import { prisma } from "../../../config/prisma.js";

const migrateSlugs = async () => {
    try {
        console.log("Starting slug migration...");
        const events = await prisma.event.findMany({
            where: {
                OR: [
                    { slug: null },
                    { slug: "" }
                ]
            }
        });

        console.log(`Found ${events.length} events without slugs.`);

        for (const event of events) {
            let baseSlug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            if (!baseSlug) baseSlug = "event"; // Fallback if title is all special chars

            let slug = baseSlug;
            let count = 1;

            // Check for collision
            while (await prisma.event.findUnique({ where: { slug } })) {
                slug = `${baseSlug}-${count}`;
                count++;
            }

            await prisma.event.update({
                where: { id: event.id },
                data: { slug }
            });

            console.log(`Updated event "${event.title}" with slug: ${slug}`);
        }

        console.log("Migration complete.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await prisma.$disconnect();
    }
};

migrateSlugs();
