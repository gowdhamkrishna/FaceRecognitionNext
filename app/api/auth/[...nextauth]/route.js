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
      if(!userExist){
        redirect('/createAccount');
      }
     
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
