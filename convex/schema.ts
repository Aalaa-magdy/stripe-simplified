import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";
import { title } from "process";

export default defineSchema({

    users: defineTable({
        email: v.string(),
        name: v.string(),
        clerkId : v.string(),
        stripeCustomerId: v.string(),
        currentSubscriptionId: v.optional(v.id("subscriptions")),
    }).index("by_clerkId", ["clerkId"]).index("by_stripeCustomerId", ["stripeCustomerId"]),

    courses : defineTable({
        title: v.string(),
        description: v.string(),
        price: v.number(),
        imageUrl: v.string(),
    }),

    purchases: defineTable({
        userId: v.id("users"),
        courseId: v.id("courses"),
        amount : v.number(),
        purchaseDate : v.number(),
        stripePurchaseId : v.string(),
    }).index("by_userId_and_courseId", ["userId", "courseId"]),

    subscriptions: defineTable({
        userId: v.id("users"),
        planType: v.union(v.literal("month"), v.literal("year")),
        currentPeroidStart: v.number(),
        currentPeroidEnd: v.number(),
        stripeSubscriptionId: v.string(),
        status: v.string(),
        cancelAtPeriodEnd: v.boolean(),
    }).index("by_stripeSubscriptionId", ["stripeSubscriptionId"]),
});