"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
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
import Link from "next/link";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed.");
                setLoading(false);
                return;
            }

            //Automatically sign in user after registration
            const signInResponse = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (signInResponse?.error) {
                setError("Sign-in failed. Please try logging in manually.");
            } else {
                router.push("/");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (

        <Card className="w-full max-w-sm mx-auto">
            <CardHeader>
                <CardTitle>Register to create a new account</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    {error && <div className="text-red-600 mb-4">{error}</div>}
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
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

                            <Label htmlFor="password">Password</Label>


                            <Input
                                id="password"
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required />
                        </div>
                        <div className="grid gap-2">

                            <Label htmlFor="password">Confirm Password</Label>


                            <Input
                                id="confirmpassword"
                                type="password"
                                placeholder="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required />
                        </div>
                    </div>
                    <Button type="submit" className="w-full mt-4" disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <p className="mt-4">Have an account <Link href={"/login"} className="text-blue-500">click here</Link></p>
            </CardFooter>
        </Card>
    )
}
export default Register;