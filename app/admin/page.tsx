"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit,
  FileText,
  ArrowRight,
  Search,
  MoreVertical,
  Calendar,
  Clock,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminStatsCard } from "@/components/admin/AdminStatsCard";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const AdminDashboard = () => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchContext = async () => {
    const { data, error } = await supabase
      .from("app_knowledge")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching context:", error);
      toast.error("Failed to load knowledge base");
    } else {
      setContext(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContext();
  }, []);

  const filteredContext = context.filter((item) =>
    item.text?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI knowledge base and system context.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/feed-context">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Feed Context
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AdminStatsCard
          label="Knowledge Base Items"
          value={context.length}
          icon={BrainCircuit}
          description="Total context chunks indexed"
          trend={{ value: 12, isPositive: true }}
        />
        <AdminStatsCard
          label="Active Sources"
          value={Math.ceil(context.length / 3)} // Placeholder logic
          icon={FileText}
          description="Documents and text inputs"
        />
        <AdminStatsCard
          label="Last Update"
          value="Today"
          icon={Calendar}
          description="Most recent ingestion activity"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content: Knowledge Base List */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-md bg-card/50 backdrop-blur">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>Recently added context items</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search context..."
                  className="pl-9 bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary inline-block mb-2" />
                  <p>Loading context...</p>
                </div>
              ) : filteredContext.length > 0 ? (
                filteredContext.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group p-4 hover:bg-muted/50 transition-colors flex items-start gap-4"
                  >
                    <div className="mt-1 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase tracking-wider"
                        >
                          Text Source
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : "Recently"}
                        </span>
                      </div>
                      <p className="text-sm font-medium line-clamp-2 text-foreground/90 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <p>No knowledge base items found.</p>
                </div>
              )}
            </div>
          </CardContent>
          <Separator />
          <div className="p-4 bg-muted/10 text-center">
            <Link
              href="/admin/knowledge"
              className="text-xs font-semibold text-primary hover:underline flex items-center justify-center gap-1"
            >
              View all items <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>

        {/* Right Sidebar: Quick Actions/Guidance */}
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Quick Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Providing specialized context helps the AI give more accurate
                and culturally relevant responses about Ethiopian cuisine.
              </p>
              <Link href="/admin/feed-context" className="mt-4 block">
                <Button variant="outline" size="sm" className="w-full">
                  Update Context
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">API Status</span>
                <Badge
                  variant="default"
                  className="bg-success hover:bg-success/90"
                >
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Knowledge Sync</span>
                <span className="font-medium text-success">Live</span>
              </div>
              <Separator />
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Current Model
                </p>
                <div className="flex items-center gap-2 font-semibold">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Gemini 1.5 Pro
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
