import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import Teacher from "../../../../public/models/mongoose/users";
import connectToDatabase from "@/connect";
import {redirect} from 'next/navigation' 
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      await connectToDatabase();
      const userExist = await Teacher.findOne({ Email: user.email });
      if (!userExist) {
        // Instead of redirecting here, return false to indicate sign-in failure
        return true; // This will prevent the sign-in and trigger the error
      }
      
      return true; // User exists, allow sign-in
    },
  },
  
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
