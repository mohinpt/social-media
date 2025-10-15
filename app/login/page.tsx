"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        console.log("form submitted");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError(res.error);
        } else {
            router.push("/");
        }
    };

    return (
        <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    {error && <div className="text-red-600 mb-4">{error}</div>}
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>
                    </div>
                    <Button type="submit" className="w-full mt-4">
                        Login
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <p className="mt-4">Don't Have an account <Link href={"/register"} className="text-blue-500">click here</Link></p>
            </CardFooter>
        </Card>
    )
}

export default Login;
