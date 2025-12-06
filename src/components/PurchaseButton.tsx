"use client";

import { useUser } from "@clerk/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import { useAction, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
const PurchaseButton = ({courseId}:{courseId: Id<"courses">}) => {
  const {user} = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession)
  const userData = useQuery(api.users.getUserByClerkId, user ? {clerkId: user?.id ?? ""} : "skip")

  const userAccess = useQuery(api.users.getUserAccess, userData ? {userId: userData._id, courseId: courseId} : "skip") || {hasAccess: false}
   
   const handlePurchase = async() =>{
      if(!user) return alert("Please sign in to purchase this course")
      setIsLoading(true)
      try{
        const { checkoutUrl } = await createCheckoutSession({courseId})
        if(checkoutUrl){
          window.location.href = checkoutUrl ?? ""
        } 
        else{
          throw new Error("Failed to create checkout session")
        }
      }
      catch(error :any){
        //todo: handle error
        if(error.message.includes("Rate limit exceeded.")){
            toast.error("Rate limit exceeded. Please try again later.")
        }
        else{
          toast.error(error.message || "Failed to purchase course. Please try again.")
        }

      }finally{
        setIsLoading(false)
      }
   }
   if(!userAccess.hasAccess){
     return (
      <Button variant={"outline"} className="flex items-center gap-2" onClick={handlePurchase} disabled={isLoading} >
         Enroll Now 
      </Button>
     )
   }

   if(userAccess.hasAccess){
     return (
        <Button variant={"outline"} className="flex items-center gap-2">Enrolled </Button>
     )
   }
   if(isLoading){
     return (
      <Button>
          <Loader2Icon className="mr-2 size-4 animate-spin" />
          Loading...
      </Button>
     )
   }
  return (
    <div>PurchaseButton</div>
  )
}

export default PurchaseButton