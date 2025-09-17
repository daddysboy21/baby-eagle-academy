import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const News = () => {
  const newsArticles = [
    {
      id: 1,
      title: "Baby Eagle Football Academy Promoted to Third Division",
      excerpt: "Historic achievement as our academy earns promotion to Liberia's Third Division league for the 2025 season.",
      content: "After years of dedication and hard work, Baby Eagle Football Academy has achieved a historic milestone by earning promotion to Liberia's Third Division league. This achievement represents not just sporting success, but the culmination of our commitment to developing young talent and building a strong community presence. The promotion comes after an outstanding season where our senior team demonstrated exceptional skill, teamwork, and determination. Coach Marcus Doe praised the players' commitment, stating that this success belongs to the entire academy family - from the youngest players in our U12 program to our dedicated staff and supportive community. The Third Division presents new challenges and opportunities, and we're excited to compete at this higher level while maintaining our core mission of youth development and education.",
      author: "Kafumba Kenneh",
      date: "2024-12-15",
      category: "Achievement",
      views: 245,
      featured: true
    },
    {
      id: 2,
      title: "New Partnership with Local Schools Expands Educational Support",
      excerpt: "Baby Eagle Academy partners with five local schools to provide comprehensive educational support for our young athletes.",
      content: "We're thrilled to announce new partnerships with five local schools in the Jamaica Road area, significantly expanding our educational support program. These partnerships will provide our young athletes with enhanced academic opportunities, including tutoring services, scholarship opportunities, and integrated study programs. The collaboration reflects our core belief that education and sports go hand in hand in developing well-rounded individuals. Currently, 11 students are receiving direct tuition support through our programs, and these new partnerships will allow us to extend educational assistance to even more young people in our community. Parents and students can now access after-school tutoring, career guidance, and mentorship programs designed to ensure our athletes excel both on the field and in the classroom.",
      author: "Grace Mulbah",
      date: "2024-12-10",
      category: "Education",
      views: 189,
      featured: false
    },
    {
      id: 3,
      title: "Community Health Initiative: Free Medical Checkups for Young Athletes",
      excerpt: "Dr. James Wilson leads comprehensive health screening program for all academy players and community youth.",
      content: "Our commitment to holistic youth development extends beyond football to include comprehensive healthcare. Led by our Head Medic Dr. James Wilson, we've launched a community health initiative providing free medical checkups for all academy players and interested community youth. The program includes general health screenings, sports medicine consultations, injury prevention education, and nutritional guidance. This initiative has already served over 100 young people, with many receiving their first comprehensive medical examination. The program also educates families about injury prevention, proper nutrition for young athletes, and the importance of regular health monitoring. We believe that healthy athletes are successful athletes, and this program ensures our community's youth have access to quality healthcare regardless of their economic circumstances.",
      author: "Dr. James Wilson",
      date: "2024-12-05",
      category: "Health",
      views: 156,
      featured: false
    },
    {
      id: 4,
      title: "Girls' Football Program Shows Remarkable Growth",
      excerpt: "Our girls' football program has doubled in size, with female athletes showing exceptional skill and dedication.",
      content: "The Baby Eagle Football Academy girls' program has experienced tremendous growth, with enrollment doubling over the past year. Led by Assistant Coach Sarah Kpangbah, the program now includes teams at U15 and U17 levels, with players like Mariam Konneh and Grace Wilson serving as inspiring role models for younger athletes. The girls' teams have competed successfully in regional tournaments, with our U17 girls' team reaching the regional semi-finals. Beyond sporting achievements, the program emphasizes leadership development, academic excellence, and community service. Many of our female athletes have taken leadership roles within the academy, mentoring younger players and participating in community outreach programs. The success of our girls' program demonstrates our commitment to providing equal opportunities for all young athletes, regardless of gender.",
      author: "Sarah Kpangbah", 
      date: "2024-11-28",
      category: "Programs",
      views: 203,
      featured: false
    },
    {
      id: 5,
      title: "Annual Awards Ceremony Celebrates Outstanding Achievements",
      excerpt: "Baby Eagle Academy honors top performers in football, academics, and community service at annual celebration.",
      content: "Our annual awards ceremony was a celebration of excellence across all aspects of our academy's mission. The event honored outstanding achievements in football performance, academic excellence, and community service. Mohamed Kamara was named U17 Top Scorer, while Mariam Konneh earned the Female Player of the Year award. Academic excellence awards went to students maintaining high grades while participating in our programs. The community service awards recognized young athletes who have made significant contributions to local initiatives. The ceremony also featured presentations on the academy's growth, including our promotion to Third Division and expanded community partnerships. Parents, players, staff, and community leaders gathered to celebrate not just individual achievements, but the collective success of our academy family in building a stronger community through sports and education.",
      author: "Foday Sanoe",
      date: "2024-11-20",
      category: "Events",
      views: 178,
      featured: false
    },
    {
      id: 6,
      title: "Youth Mentorship Program Launches with Community Leaders",
      excerpt: "New mentorship initiative pairs young athletes with successful community leaders for personal and professional development.",
      content: "Baby Eagle Football Academy has launched an innovative mentorship program connecting our young athletes with successful community leaders, business owners, and professionals. The program aims to provide guidance beyond sports, helping young people develop life skills, career awareness, and leadership capabilities. Each mentor commits to regular meetings with their mentee, providing advice on education, career planning, and personal development. The program currently includes 25 mentor-mentee pairs, with plans to expand significantly in 2025. Mentors come from diverse backgrounds including business, education, healthcare, and public service. The initiative reflects our holistic approach to youth development, recognizing that success in life requires more than athletic ability. Early feedback from participants has been overwhelmingly positive, with both mentors and mentees reporting meaningful relationships and valuable learning experiences.",
      author: "Abdullah L. Bility",
      date: "2024-11-15",
      category: "Community",
      views: 134,
      featured: false
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Achievement": return "default";
      case "Education": return "secondary";
      case "Health": return "destructive";
      case "Programs": return "outline";
      case "Events": return "default";
      case "Community": return "secondary";
      default: return "default";
    }
  };

  const formatDate = (dateString: string) => {
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
            <Card key={article.id} className={`${article.featured ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                      {article.featured && (
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          Featured
                        </Badge>
                      )}
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
                <div className="prose prose-sm max-w-none mb-4">
                  <p className="text-sm leading-relaxed">{article.content}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.date)}</span>
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