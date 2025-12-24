"use client"
import { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import MarqueeSection from "@/components/home/MarqueeSection";

import { CreativePromoSection } from "@/components/home/CreativePromoSection";
import { MOCK_EVENTS } from '../constants';
import { EventData } from "../types";
import { AdSection } from "@/components/home/Adsection";
import { HomeUpcomingSection } from "@/components/home/UpcomingEvents";
import { CalendarSection } from "@/components/home/CalendarSection";
import { StaggeredReviews } from "@/components/home/StaggeredReviews";

export default function Home() {

  const [events, setEvents] = useState<EventData[]>(MOCK_EVENTS);
  return (

    <>
      <section>
        {<Hero />}
      </section>
      <MarqueeSection />
      <section>
        <div className="  py-12 space-y-20">
          <FeaturedEvents
            events={events}
          />

        <div className="container mx-auto">

        
          <AdSection
            title="Become a Pro Organizer"
            description="Create, manage, and sell tickets for your events with our premium tools."
            cta="Get Started"
            align="right"
          />
</div>
          <HomeUpcomingSection
            events={events}
            onEventClick={() => { }}
            onViewAll={() => { }}
          />
          {/* <CreativePromoSection /> */}
          <CalendarSection events={events} />


        <div className="container mx-auto">
          <AdSection
            title="Winter Gaming League 2025"
            description="Register now for the biggest online tournament of the season. ₹50 Lakhs Prize Pool."
            cta="Register Team"
            align="left"
            isGaming={true}
            secondaryAd={{
              title: "Summer Music Fest",
              description: "Early bird tickets available now. Experience the vibes.",
              cta: "Book Tickets",
              isGaming: false
            }}
          />
          </div>
          <StaggeredReviews />
        </div>
      </section>


    </>

  );
};



