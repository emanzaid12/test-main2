import React, { useEffect, useState, useRef } from "react";
import businessImage from "../assets/images/who-we-are.jpg";
import { FaUserShield, FaTools, FaLightbulb } from "react-icons/fa";

const AboutUs = () => {
  const [animateHeader, setAnimateHeader] = useState(false);
  const [counters, setCounters] = useState({
    experience: 0,
    projects: 1000,
    clients: 300,
    awards: 64,
  });

  const counterRef = useRef(null);
  const cardsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateHeader(true), 300);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startCounting();
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [hasAnimated]);

  const startCounting = () => {
    const targetExperience = 20;
    const duration = 2000;

    let start = 0;
    const stepTime = Math.max(20, Math.floor(duration / targetExperience));
    const timer = setInterval(() => {
      start += 1;
      if (start >= targetExperience) {
        start = targetExperience;
        clearInterval(timer);
      }
      setCounters((prev) => ({ ...prev, experience: start }));
    }, stepTime);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (cardsRef.current) {
        const top = cardsRef.current.getBoundingClientRect().top;
        if (top < window.innerHeight - 100 && !showCards) {
          setShowCards(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showCards]);

  return (
    <div className="bg-gray-100">
      {/* Header Section */}
      <div className="bg-red-800 text-white text-center py-20 relative overflow-hidden">
        <h1 className={`text-4xl font-bold text-white transition-all duration-700 ${animateHeader ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}>
          About Us
        </h1>
        <p className={`text-lg mt-2 text-white transition-all duration-700 delay-200 ${animateHeader ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}>
          Empowering Small Businesses to Succeed
        </p>
      </div>

      {/* About Section */}
      <div className="container mx-auto px-6 md:px-16 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <img src={businessImage} alt="Business" className="rounded-lg shadow-lg" />
        </div>

        <div>
          <h2 className="text-gray-500 text-lg uppercase tracking-widest">About Us</h2>
          <h3 className="text-3xl font-bold text-red-800 mb-4">We Always Make The Best</h3>
          <p className="text-gray-700 leading-relaxed">
            At Spark Up, we are passionate about supporting small businesses by providing innovative solutions that help them thrive.
          </p>
        </div>
      </div>

      {/* Skills & Stats Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6 md:px-16">
          <h2 className="text-3xl font-bold text-gray-800 text-left mb-4">Our Skills</h2>
          <p className="text-gray-600 text-left">
            We combine expertise and innovation to support small businesses.<br />
            Our solutions ensure growth, stability, and long-term success.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
            <div>
              {[
                { name: "Business Strategy", percentage: 85 },{ name: "Marketing & Branding", percentage: 90 },
                { name: "Financial Management", percentage: 77 },
              ].map((skill, index) => (
                <div key={index} className="mb-4">
                  <p className="text-gray-800 font-semibold mb-1">{skill.name}</p>
                  <div className="relative w-full bg-gray-300 h-2 rounded">
                    <div className="absolute left-0 top-0 bg-red-800 h-2 rounded transition-all duration-700" style={{ width: `${skill.percentage}%` }}></div>
                    <div className="absolute right-0 top-[-22px] text-gray-800 font-semibold" style={{ right: `${100 - skill.percentage}%` }}>
                      {skill.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 text-center" ref={counterRef}>
              {[
                { value: counters.experience, label: "Years of Experience" },
                { value: counters.projects, label: "Projects Completed" },
                { value: counters.clients, label: "Satisfied Clients" },
                { value: counters.awards, label: "Awards Won" },
              ].map((item, index) => (
                <div key={index}>
                  <h3 className="text-3xl font-bold text-gray-800 transition-transform duration-300 ease-in-out transform hover:scale-110">
                    {item.value}+
                  </h3>
                  <p className="text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div ref={cardsRef} className="container mx-auto px-6 md:px-16 py-12">
        <h2 className="text-3xl font-bold text-red-800 text-center mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Personalized Support", text: "We provide solutions tailored to your business needs.", icon: <FaUserShield /> },
            { title: "Advanced Tools", text: "We help you with modern technologies to develop your business.", icon: <FaTools /> },
            { title: "Industry Experts", text: "Our team consists of specialists in entrepreneurship.", icon: <FaLightbulb /> },
          ].map((card, index) => (
            <div key={index}
              className={`bg-white p-6 rounded-lg shadow-md text-center transform transition-all duration-700 ${
                showCards ? `opacity-100 translate-y-0 delay-${index * 200}` : "opacity-0 translate-y-10"
              } hover:scale-105 hover:shadow-xl`}
            >
              <div className="text-red-800 text-5xl mx-auto mb-4 flex justify-center items-center">{card.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">{card.title}</h3>
              <p className="text-gray-600 mt-2">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;