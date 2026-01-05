"use client";

import {useEffect, useState} from "react";
import {supabase} from "@/integrations/supabase/client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {FileText, Eye, EyeOff, TrendingUp} from "lucide-react";

interface Stats {
    total: number;
    published: number;
    drafts: number;
}

const Page = () => {
    const [stats, setStats] = useState<Stats>({total: 0, published: 0, drafts: 0});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch all posts count
                const {count: totalCount} = await supabase
                    .from("posts")
                    .select("*", {count: "exact", head: true});

                // Fetch published posts count
                const {count: publishedCount} = await supabase
                    .from("posts")
                    .select("*", {count: "exact", head: true})
                    .eq("is_published", true);

                setStats({
                    total: totalCount || 0,
                    published: publishedCount || 0,
                    drafts: (totalCount || 0) - (publishedCount || 0),
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Posts",
            value: stats.total,
            icon: FileText,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            title: "Published",
            value: stats.published,
            icon: Eye,
            color: "text-accent",
            bgColor: "bg-accent/10",
        },
        {
            title: "Drafts",
            value: stats.drafts,
            icon: EyeOff,
            color: "text-gold",
            bgColor: "bg-gold/10",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to Interline admin panel</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat) => (
                    <Card key={stat.title} className="hover-lift">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                <stat.icon className={`w-4 h-4 ${stat.color}`}/>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">
                                {isLoading ? "..." : stat.value}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5"/>
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <a
                            href="/admin/posts/new"
                            className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group"
                        >
                            <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                                Create New Post
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Add a new offer, promotion, or news article
                            </p>
                        </a>
                        <a
                            href="/admin/posts"
                            className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group"
                        >
                            <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                                Manage Posts
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Edit, publish, or delete existing posts
                            </p>
                        </a>
                        <a
                            href="/admin/settings"
                            className="p-4 rounded-lg border border-border hover:border-accent hover:bg-accent/5 transition-all group"
                        >
                            <h3 className="font-semibold mb-1 group-hover:text-accent transition-colors">
                                Site Settings
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Update company info, contacts, social links
                            </p>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;