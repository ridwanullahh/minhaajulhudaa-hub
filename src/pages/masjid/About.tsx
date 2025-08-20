import React from 'react';
import { ModernCard } from '@/components/ui/ModernCard';
import { Users, BookOpen, Heart, Compass } from 'lucide-react';

const MasjidAbout = () => {
  const mission = "To serve the spiritual, educational, and social needs of the Muslim community and to foster a vibrant, inclusive center for all.";
  const vision = "To be a beacon of Islamic guidance and a center of excellence that empowers the community to thrive in their faith and contribute positively to society.";
  const history = "Established in 2005 by a group of dedicated community members, Minhaajulhudaa Islamic Center has grown from a small prayer hall to a comprehensive facility serving hundreds of families. Our journey is one of faith, perseverance, and community support.";
  
  const coreValues = [
    { icon: <Compass className="w-8 h-8"/>, title: "Guidance", desc: "Adherence to the Quran and Sunnah." },
    { icon: <BookOpen className="w-8 h-8"/>, title: "Knowledge", desc: "Promoting Islamic and secular education." },
    { icon: <Users className="w-8 h-8"/>, title: "Community", desc: "Fostering unity and brotherhood." },
    { icon: <Heart className="w-8 h-8"/>, title: "Service", desc: "Serving the needs of humanity." },
  ];

  return (
    <div className="min-h-screen py-20 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            About <span className="text-primary">Our Masjid</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn about our history, mission, and the values that guide our community.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <ModernCard variant="glass" className="p-8">
                <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
                <p className="text-lg text-foreground/80">{mission}</p>
            </ModernCard>
            <ModernCard variant="glass" className="p-8">
                <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
                <p className="text-lg text-foreground/80">{vision}</p>
            </ModernCard>
        </div>

        <ModernCard variant="glass" className="p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">Our History</h2>
            <p className="text-lg text-center max-w-4xl mx-auto text-foreground/80 leading-relaxed">{history}</p>
        </ModernCard>

        <div>
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {coreValues.map(value => (
                    <ModernCard key={value.title} className="p-6 text-center">
                        <div className="flex justify-center text-primary mb-4">{value.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground">{value.desc}</p>
                    </ModernCard>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default MasjidAbout;