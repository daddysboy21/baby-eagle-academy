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

        <div className="space-y-4 sm:space-y-6">
          {newsArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getCategoryColor(article.category)} className="text-xs">
                      {article.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl leading-tight">
                    {article.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {article.excerpt}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="pt-3 border-t">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{formatDate(article.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>{article.views} views</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Stay Connected</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Want to receive the latest news and updates from Baby Eagle Football Academy?
            </p>
            <Button className="w-full sm:w-auto">Subscribe to Newsletter</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default News;