import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { newsAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string;
  status: string;
  image?: string;
  createdAt: string;
}

const News = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsAPI.getAll();
        // Filter to only show published articles
        const publishedArticles = data.filter((article: NewsArticle) => article.status === 'published');
        setNewsArticles(publishedArticles);
      } catch (err) {
        setError("Failed to load news articles");
        toast({
          title: "Error",
          description: "Failed to load news articles",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [toast]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Match Results": return "default";
      case "Transfers": return "secondary";
      case "Team News": return "destructive";
      case "Training Updates": return "outline";
      case "Academy News": return "default";
      case "Community": return "secondary";
      case "Announcements": return "default";
      default: return "default";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Academy News</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">Stay updated with the latest news and achievements from Baby Eagle Football Academy</p>
          </div>
        </div>

        {newsArticles.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No news articles found</h3>
            <p className="text-muted-foreground">News articles will be displayed here once published.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {newsArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                {article.image && (
                  <div className="aspect-[5/2] sm:aspect-[4/1] overflow-hidden">
                    <img
                      src={`data:image/jpeg;base64,${article.image}`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getCategoryColor(article.category)} className="text-xs">
                        {article.category}
                      </Badge>
                      {article.tags && (
                        <div className="flex flex-wrap gap-1">
                          {article.tags.split(',').slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-base sm:text-lg lg:text-xl leading-tight">
                      {article.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;