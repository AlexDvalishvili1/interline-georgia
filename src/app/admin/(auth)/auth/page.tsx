"use client";

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "@/contexts/AuthContext";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {toast} from "sonner";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {z} from "zod";

const ADMIN_EMAIL_DOMAIN = "@admin.local";

const loginSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export default function Page() {
    const router = useRouter();
    const {user, isLoading: authLoading, signIn} = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // ✅ Redirect if already logged in (in an effect)
    useEffect(() => {
        if (!authLoading && user) {
            router.push("/admin");
        }
    }, [authLoading, user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = loginSchema.safeParse({username, password});
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                const key = err.path[0];
                if (key) fieldErrors[String(key)] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);

        const email = `${username}${ADMIN_EMAIL_DOMAIN}`;
        const {error} = await signIn(email, password);

        setIsLoading(false);

        if (error) {
            if (error.message.includes("Invalid login credentials")) {
                toast.error("Invalid username or password");
            } else {
                toast.error(error.message);
            }
            return;
        }

        toast.success("Logged in successfully");
        router.push("/admin");
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-accent"/>
            </div>
        );
    }

    // While redirecting an already-logged-in user, don't flash the login form
    if (user) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-heading">Admin Panel</CardTitle>
                    <CardDescription>Sign in to access the admin panel</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={errors.username ? "border-destructive" : ""}
                                autoComplete="username"
                            />
                            {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                            </div>
                            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : null}
                            Sign In
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        <a href="/" className="hover:text-accent transition-colors">
                            ← Back to website
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}