"use client"
import { useState,useEffect } from "react";
import Hero from "@/components/home/Hero";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import { MOCK_EVENTS } from '../constants';
import { EventData } from "../types";
import { AdSection } from "@/components/home/Adsection";
import { HomeUpcomingSection } from "@/components/home/UpcomingEvents";

export default function Home() {

const [events, setEvents] = useState<EventData[]>(MOCK_EVENTS);
    return (

    <>
      <section>
        {<Hero/>}
      </section>
     <section>
             <div className="container mx-auto px-4 py-12 space-y-20">
                    <FeaturedEvents 
                        events={events}
                       
                    />
                    
                     <AdSection 
                        title="Become a Pro Organizer"
                        description="Create, manage, and sell tickets for your events with our premium tools."
                        cta="Get Started"
                        align="right"
                    />

                    <HomeUpcomingSection 
              events={events} onEventClick={function (event: EventData): void {
                throw new Error("Function not implemented.");
              } } onViewAll={function (): void {
                throw new Error("Function not implemented.");
              } }                       
                    />

                    <AdSection 
                        title="Winter Gaming League 2025"
                        description="Register now for the biggest online tournament of the season. ₹50 Lakhs Prize Pool."
                        cta="Register Team"
                        align="left"
                        isGaming={true}
                    /> 
                </div>
     </section>
 

    </>

  );
};



