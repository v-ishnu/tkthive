"use client"
import { useState, useEffect } from "react";
import Hero from "@/components/home/Hero";
import { FeaturedEvents } from "@/components/home/FeaturedEvents";
import MarqueeSection from "@/components/home/MarqueeSection";
import { CategoryButtons } from "@/components/home/CategoryButtons";

import { CreativePromoSection } from "@/components/home/CreativePromoSection";
// import { MOCK_EVENTS } from '../constants'; // Removed Mock
import { EventData } from "../types";
import { AdSection } from "@/components/home/Adsection";
import { HomeUpcomingSection } from "@/components/home/UpcomingEvents";
import { CalendarSection } from "@/components/home/CalendarSection";
import { StaggeredReviews } from "@/components/home/StaggeredReviews";

import { LiveEventsCarousel } from "@/components/home/LiveEventsCarousel";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllEvents } from "@/store/slices/eventSlice";
import { RootState } from "@/store/store";

export default function Home() {

  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state: RootState) => state.event);

  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  return (
    <>
      <section className="bg-background">
        <Hero />
      </section>

      {/* Live Events Carousel */}
      {/* {!loading && events.length > 0 && (
        <LiveEventsCarousel events={events} />
      )} */}

      <MarqueeSection />

      <section className="bg-background py-20 pb-0">
        <FeaturedEvents
          events={events}
          isLoading={loading}
        />
      </section>

      <section className="bg-background py-10">
        <CategoryButtons />
      </section>

      {/* <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <AdSection
            title="Become a Pro Organizer"
            description="Create, manage, and sell tickets for your events with our premium tools."
            cta="Get Started"
            align="right"
            align="right"
          />
        </div>
      </section> */}

      <section className="bg-background ">
        <HomeUpcomingSection
          events={events}
          onEventClick={() => { }}
          onViewAll={() => { }}
          isLoading={loading}
        />
      </section>

      <div className="container mx-auto px-4 mt-20 mb-12">
        <AdSection
          title="Sponsorship Opportunities"
          description="Want to see your brand here? Partner with the biggest events in the region."
          cta="Contact Sales"
          align="left"
        />
      </div>

      {/* <CreativePromoSection /> */}

      {/* <section className="bg-secondary">
        <CalendarSection events={events} />
      </section> */}

      {/* <section className="bg-background py-16">
        <div className="container mx-auto px-4">
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
      </section> */}

      {/* <section className="bg-secondary py-20">
        <StaggeredReviews />
      </section> */}
    </>
  );
};

