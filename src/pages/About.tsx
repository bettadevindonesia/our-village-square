import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, Calendar, Award } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, label: "Population", value: "2,847" },
    { icon: MapPin, label: "Area", value: "15.2 km²" },
    { icon: Calendar, label: "Founded", value: "1742" },
    { icon: Award, label: "Heritage Sites", value: "12" }
  ];

  const councilMembers = [
    {
      name: "Sarah Johnson",
      position: "Mayor",
      description: "Leading our community with vision and dedication for over 8 years."
    },
    {
      name: "Michael Chen",
      position: "Deputy Mayor",
      description: "Focused on sustainable development and environmental initiatives."
    },
    {
      name: "Elena Rodriguez",
      position: "Council Member",
      description: "Advocate for youth programs and educational opportunities."
    },
    {
      name: "David Thompson",
      position: "Council Member",
      description: "Overseeing infrastructure development and public works."
    }
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Our Village</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the rich history, vibrant community, and promising future of our beloved village. 
            A place where tradition meets progress.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* History Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our History</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 1742, our village has a rich heritage spanning nearly three centuries. 
                Originally established as a farming community, we have evolved while maintaining 
                our rural character and strong community bonds.
              </p>
              <p>
                Throughout the years, our village has been home to notable historical figures, 
                preserved architectural landmarks, and has played a significant role in regional 
                development. Our commitment to preserving history while embracing modernity makes 
                us a unique place to call home.
              </p>
              <p>
                Today, we balance respect for our past with innovative approaches to sustainability, 
                technology, and community development. Our residents enjoy modern amenities while 
                living in a setting that honors our agricultural and cultural roots.
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-village-blue/20 flex items-center justify-center mt-1">
                  <Users className="w-4 h-4 text-village-blue" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Community First</h3>
                  <p className="text-muted-foreground text-sm">
                    We prioritize the well-being and engagement of all residents, fostering 
                    a sense of belonging and mutual support.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-village-green/20 flex items-center justify-center mt-1">
                  <MapPin className="w-4 h-4 text-village-green" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Environmental Stewardship</h3>
                  <p className="text-muted-foreground text-sm">
                    We are committed to sustainable practices that protect our natural 
                    environment for future generations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-full bg-village-amber/20 flex items-center justify-center mt-1">
                  <Award className="w-4 h-4 text-village-amber" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Preserving Heritage</h3>
                  <p className="text-muted-foreground text-sm">
                    We honor our history and traditions while embracing positive change 
                    and innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Council Members */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Village Council</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {councilMembers.map((member) => (
              <Card key={member.name}>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-hero mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-village-blue font-medium">{member.position}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;