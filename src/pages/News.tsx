import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { newsAPI } from "@/services/api";

const News = () => {
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsAPI.getAll();
        setNewsArticles(data);
      } catch (err) {
        setError("Failed to load news articles");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Academy News</h1>
            <p className="text-muted-foreground mt-2">Stay updated with the latest news and achievements from Baby Eagle Football Academy</p>
          </div>
        </div>

        <div className="space-y-6">
          {newsArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl lg:text-2xl leading-tight">
                      {article.title}
                    </CardTitle>
                    <p className="text-muted-foreground mt-2 text-sm lg:text-base">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{article.views} views</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Stay Connected</h3>
            <p className="text-muted-foreground mb-4">
              Want to receive the latest news and updates from Baby Eagle Football Academy?
            </p>
            <Button>Subscribe to Newsletter</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default News;