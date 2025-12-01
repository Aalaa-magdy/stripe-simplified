"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  // Convert route param → Convex ID
  const courseId = params.courseId as Id<"courses">;

  const { user, isLoaded: isUserLoaded } = useUser();

  const userData = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  const courseData = useQuery(api.courses.getCourseById, {
    courseId,
  });

  const userAccess =
    useQuery(
      api.users.getUserAccess,
      userData
        ? {
            userId: userData._id,
            courseId,
          }
        : "skip"
    ) || { hasAccess: false };

  if (!isUserLoaded || courseData === undefined) {
    return <CourseDetailSkeleton />;
  }

  if (courseData === null) return notFound();

  return <div>page</div>;
}

function CourseDetailSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="w-full h-[600px] rounded-md" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
