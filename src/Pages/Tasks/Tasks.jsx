import { useEffect, useState } from "react";
import CampusMap from "../Map/CampusMap";
import { hideLoading, showLoading } from "../../Utils/loadingUtils";
import { showAlert } from "../../Utils/alertUtils";
import VenueServices from "../../Services/VenueService";

const CampusMapExample = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const getEvents = async () => {
      showLoading("Fetching Events...");
      try {
        const response = await VenueServices.getAllVenue();
        const allEvents =
          response?.data?.flatMap((venue) => venue.events) || [];

        setEvents(allEvents);
        console.log("Fetched Events:", allEvents);

        return allEvents;
      } catch (error) {
        showAlert("error", "Something went wrong!");
      } finally {
        hideLoading();
      }
    };
    getEvents();
  }, []);

  // Sample events data
  const sampleEvents = [
    {
      id: 1,
      buildingId: "A1",
      title: "Introduction to Computer Science",
      date: "March 11, 2025",
      time: "10:00 AM - 11:30 AM",
      description:
        "Lecture on programming fundamentals for first-year students.",
    },
    {
      id: 2,
      buildingId: "A2",
      title: "Academic Council Meeting",
      date: "March 11, 2025",
      time: "2:00 PM - 4:00 PM",
      description: "Monthly meeting for faculty members.",
    },
    {
      id: 3,
      buildingId: "C1",
      title: "Art Exhibition Opening",
      date: "March 11, 2025",
      time: "5:00 PM - 7:00 PM",
      description: "Student artwork showcase and reception.",
    },
  ];

  return <CampusMap events={events} />;
};

export default CampusMapExample;
