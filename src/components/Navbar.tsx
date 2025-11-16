import { BookOpenIcon, GraduationCap, ZapIcon } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center py-4 px-6 bg-backgound border-b ">  
        <Link href="/" className="text-2xl font-extrabold text-primary flex items-center gap-2">
            MasterClass 
            <GraduationCap className="w-6 h-6 text-primary" />
        </Link>

        <div className='flex items-center space-x-1 sm:space-x-4'>
             <Link href={"/courses"}
                className ="flex items-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors">
                <BookOpenIcon className="w-5 h-5"/>
                <span className="hidden sm:inline">Courses</span>
             </Link>
               <Link href={"/pro"}
                className ="flex items-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors">
                <ZapIcon className="w-5 h-5"/>
                <span className="hidden sm:inline">Pro</span>
             </Link>
        </div>
    </nav>
  );
}