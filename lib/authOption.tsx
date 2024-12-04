import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any) {
                const { email, password } = credentials;

                if (!email || !password) {
                    throw new Error("All fields are required");
                }

                try {
                    const response = await axios.post('https://solert.mach-india.com/api/v1/users/login', { email, password });
                    const user = response.data;

                    if (!user) {
                        throw new Error("Invalid credentials");
                    }

                    return user;
                } catch (error) {
                    throw new Error("Authentication failed");
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.userId = token.id as string;
            session.user.name = token.name;
            return session;
        }
    },

    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
        signOut: '/',
        error: '/'
    },
    session: {
        strategy: "jwt"
    }
};

export default authOptions;
