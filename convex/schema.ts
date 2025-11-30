import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";
import { title } from "process";

export default defineSchema({

    users: defineTable({
        email: v.string(),
        name: v.string(),
        clerkId : v.string(),
    }).index("by_clerkId", ["clerkId"]),

    courses : defineTable({
        title: v.string(),
        description: v.string(),
        price: v.number(),
        imageUrl: v.string(),
    }),
});