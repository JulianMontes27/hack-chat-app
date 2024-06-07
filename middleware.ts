import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that should be protected
// const isProtectedRoute = createRouteMatcher([
//   "/",
//   "/api/uploadthing", // Add any additional routes here
// ]); // Update clerkMiddleware to manually protect routes

export default clerkMiddleware();

// export const config = {
//   matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };
