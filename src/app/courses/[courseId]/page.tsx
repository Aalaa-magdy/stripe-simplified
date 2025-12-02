"use client";

import { use } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { notFound } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FileText, FileTextIcon, Lock, PlayCircle } from "lucide-react";
import PurchaseButton from "@/components/PurchaseButton";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: Id<"courses"> }>;
}) {
  const { courseId } = use(params);
  const { user, isLoaded: isUserLoaded } = useUser();

  // Wait for user to be loaded AND have an ID
  const isAuthenticated = isUserLoaded && user?.id;

  // Only fetch user data if authenticated
  const userData = useQuery(
    api.users.getUserByClerkId,
    isAuthenticated ? { clerkId: user.id } : "skip"
  );

  // Only check access if we have user data
  const userAccess = useQuery(
    api.users.getUserAccess,
    userData && isAuthenticated
      ? {
          userId: userData._id,
          courseId: courseId as Id<"courses">,
        }
      : "skip"
  ) || { hasAccess: false };

  const courseData = useQuery(api.courses.getCourseById, {
    courseId: courseId as Id<"courses">,
  });

  console.log("Auth state:", {
    isUserLoaded,
    userId: user?.id,
    isAuthenticated,
    userData,
    userAccess
  });

  // Show loading while authentication is being established
  if (!isUserLoaded || courseData === undefined || userData === undefined) {
    return <CourseDetailSkeleton />;
  }

  if (courseData === null) return notFound();

  return (
  <div className="container mx-auto py-8 px-4">
    <Card className="max-w-4xl mx-auto">

      <CardHeader>
         <Image
          src={courseData.imageUrl}
          alt={courseData.title}
          width={1200}
          height={600}
          className="rounded-md object-cover w-full"/>

      </CardHeader>
      <CardContent>
        <CardTitle className="text-3xl font-bold mb-4">{courseData.title}</CardTitle>
         {
          userAccess.hasAccess ? (
            <>   
              <p className="text-gray-600 mb-6">{courseData.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 <Button className="flex items-center justify-center space-x-2">
                    <PlayCircle className="w-5 h-5"/>
                    <span>Start Course</span> 
                 </Button>
                 <Button variant="outline" className="flex items-center justify-center space-x-2">
                   <span>Download Materials</span>
                 </Button>
              </div>
              <h3 className="text-xl font-semibold mb-4">Course Modules</h3>
                <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                       <FileTextIcon className="size-5 text-gray-500"/>
                       <span>Introduction to Advanced Patterns</span> "
                    </li>
                    <li className="flex items-center space-x-2">
                       <FileText className="w-5 h-5 text-gray-500"/>
                        <span>Module 1: Deep Dive into React</span>
                    </li>
                </ul>
            </>
          ):(
            <div className="text-center">
               <div className="flex flex-col items-center space-y-4 ">
                  <Lock className="w-16 h-16 text-gray-400"/>
                  <p className="text-lg text-gray-600">You do not have access to this course.</p>
                  <p className="text-gray-500 max-w-md">Please purchase the course or subscribe to gain access to all courses.</p>
                  <p className="text-gray-500 mb-4">${courseData.price.toFixed(2)}</p>
                  <PurchaseButton courseId={courseId} />
               </div>
            </div>
          )
         }
      </CardContent>
    </Card>

  </div>)
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
