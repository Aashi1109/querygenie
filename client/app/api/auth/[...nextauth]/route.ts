import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { ISession } from "@/types";
import config from "@/config";
import { createUser, getUserByQuery } from "@/action";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      authorization: {
        params: { prompt: "consent" },
      },
    }),
  ],
  callbacks: {
    async session({ session }: { session: ISession }) {
      const user = await getUserByQuery({ email: session.user.email });
      if (user?.data?.length) {
        session.user.id = user?.data[0].id;
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        if (profile) {
          // @ts-ignore
          const { email, name, picture, given_name, family_name } = profile;

          const user = await getUserByQuery({ email: profile.email });
          // console.log(user);
          if (!user || !user?.data?.length) {
            const createResult = await createUser(
              name!,
              email!,
              (given_name + family_name)?.toLowerCase(),
              picture!,
            );
            // console.log(createResult);
          }
        }
        return true;
      } catch (error) {
        console.error(`Error in signing in ${error}`);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
