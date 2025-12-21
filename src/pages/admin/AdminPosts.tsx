import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Search, Loader2, Home, FileText, Pin } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useAdminPosts, useDeletePost, type Post } from "@/hooks/usePosts";

const AdminPosts = () => {
  const { language } = useLanguage();
  const { data: posts, isLoading } = useAdminPosts();
  const deleteMutation = useDeletePost();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setDeleteId(null);
    }
  };

  const getTitle = (post: Post) => {
    const titleKey = `title_${language}` as keyof Post;
    return (post[titleKey] as string) || post.title_en || "Untitled";
  };

  const filteredPosts = (posts || []).filter((post) =>
    getTitle(post).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryColors: Record<string, string> = {
    offer: "bg-accent text-accent-foreground",
    promotion: "bg-gold text-gold-foreground",
    news: "bg-primary text-primary-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Posts</h1>
          <p className="text-muted-foreground">Manage your offers, promotions, and news</p>
        </div>
        <Button asChild><Link to="/admin/posts/new"><Plus className="w-4 h-4 mr-2" />New Post</Link></Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <CardTitle>All Posts ({posts?.length || 0})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search posts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">{searchQuery ? "No posts found matching your search" : "No posts yet. Create your first post!"}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Display</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        <div className="flex items-center gap-2">
                          {post.pinned && <Pin className="w-3 h-3 text-gold" />}
                          {getTitle(post)}
                        </div>
                      </TableCell>
                      <TableCell><Badge className={categoryColors[post.category]}>{post.category}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {post.display_locations?.includes("offers_page") && <span title="Offers Page"><FileText className="w-4 h-4 text-muted-foreground" /></span>}
                          {post.display_locations?.includes("home_latest") && <span title="Home Page"><Home className="w-4 h-4 text-accent" /></span>}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={post.is_published ? "default" : "secondary"}>{post.is_published ? "Published" : "Draft"}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{new Date(post.updated_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild size="sm" variant="ghost"><Link to={`/admin/posts/${post.id}`}><Pencil className="w-4 h-4" /></Link></Button>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteId(post.id)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this post? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPosts;
