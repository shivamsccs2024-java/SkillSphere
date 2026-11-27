
import { useEffect, useState } from "react";
import {
  Monitor,
  Server,
  Code,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight
} from "lucide-react";

import api from "../services/api";

const roadmapIcons = {
  Monitor,
  Server,
  Code
};

function Roadmap() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [steps, setSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stepsLoading, setStepsLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingStep, setUpdatingStep] = useState(null);

  // Fetch all roadmaps
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        setLoading(true);

        const response = await api.get("/roadmaps");
        const data = response.data?.data ?? response.data;

        if (!Array.isArray(data)) {
          throw new Error("Invalid roadmap response.");
        }

        setRoadmaps(data);

        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (err) {
        console.error("Roadmap fetch error:", err);
        setError(
          err.response?.data?.message ||
          "Unable to load roadmaps."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  // Fetch selected roadmap steps and student progress
  useEffect(() => {
    if (!selectedId) return;

    const fetchRoadmapDetails = async () => {
      try {
        setStepsLoading(true);
        setError("");

        const [stepsResponse, progressResponse] = await Promise.all([
          api.get(`/roadmaps/${selectedId}/steps`),
          api.get(`/roadmaps/${selectedId}/my-progress`)
        ]);

        const stepsData =
          stepsResponse.data?.data ?? stepsResponse.data;

        const progressData =
          progressResponse.data?.data ?? progressResponse.data;

        setSteps(Array.isArray(stepsData) ? stepsData : []);

        const completedIds = Array.isArray(progressData?.steps)
        ? progressData.steps
            .filter((step) => step.is_completed)
            .map((step) => Number(step.id))
        : [];
      
      setCompletedSteps(completedIds);
      } catch (err) {
        console.error("Roadmap details error:", err);
        setSteps([]);
        setCompletedSteps([]);
        setError(
          err.response?.data?.message ||
          "Unable to load roadmap details."
        );
      } finally {
        setStepsLoading(false);
      }
    };

    fetchRoadmapDetails();
  }, [selectedId]);

  const selectedRoadmap = roadmaps.find(
    (roadmap) => roadmap.id === selectedId
  );

  const completed = completedSteps;

  const progress = steps.length
    ? Math.round((completed.length / steps.length) * 100)
    : 0;

  // Mark step complete or undo completion
  const toggleStep = async (stepId) => {
    const isCompleted = completedSteps.includes(stepId);

    try {
      setUpdatingStep(stepId);

      if (isCompleted) {
        await api.delete(`/roadmap-steps/${stepId}/complete`);

        setCompletedSteps((previous) =>
          previous.filter((id) => id !== stepId)
        );
      } else {
        await api.post(`/roadmap-steps/${stepId}/complete`);

        setCompletedSteps((previous) =>
          previous.includes(stepId)
            ? previous
            : [...previous, stepId]
        );
      }
    } catch (err) {
      console.error("Roadmap progress update error:", err);

      alert(
        err.response?.data?.message ||
        "Unable to update roadmap progress."
      );
    } finally {
      setUpdatingStep(null);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h4>Loading roadmaps...</h4>
      </div>
    );
  }

  if (error && roadmaps.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!selectedRoadmap) {
    return (
      <div className="container py-5 text-center">
        <h3>No Roadmaps Available</h3>
      </div>
    );
  }

  const Icon = roadmapIcons[selectedRoadmap.icon] || Code;

  return (
    <main className="roadmap-page">

      {/* HERO SECTION */}
      <section className="roadmap-hero">
        <div className="container text-center">
          <span>CAREER ROADMAP</span>

          <h1>
            Plan Your Career.
            <span> Build Your Future.</span>
          </h1>

          <p>
            Follow structured learning paths and develop
            the skills needed to achieve your dream career.
          </p>
        </div>
      </section>

      <section className="roadmap-content">
        <div className="container">

          {/* CAREER PATHS */}
          <div className="roadmap-heading">
            <div>
              <h2>Choose Your Career Path</h2>
              <p>Select a roadmap to start your learning journey.</p>
            </div>
          </div>

          <div className="row g-4 mb-5">
            {roadmaps.map((item) => {
              const PathIcon = roadmapIcons[item.icon] || Code;

              return (
                <div className="col-md-6 col-lg-4" key={item.id}>
                  <button
                    className={`roadmap-option ${
                      selectedId === item.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className={`roadmap-option-icon ${item.color}`}>
                      <PathIcon size={28} />
                    </div>

                    <h4>{item.title}</h4>
                    <p>{item.description}</p>

                    <div className="roadmap-option-footer">
                      <span>
                        <Clock size={15} />
                        {item.duration}
                      </span>

                      <span>{item.level}</span>
                    </div>

                    <div className="roadmap-select-link">
                      View Roadmap <ArrowRight size={17} />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* SELECTED ROADMAP */}
          <div className="roadmap-detail">

            <div className="roadmap-detail-header">
              <div>
                <span>YOUR LEARNING PATH</span>
                <h2>{selectedRoadmap.title}</h2>
                <p>{selectedRoadmap.description}</p>
              </div>

              <div className={`roadmap-main-icon ${selectedRoadmap.color}`}>
                <Icon size={32} />
              </div>
            </div>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            {stepsLoading ? (
              <div className="text-center py-4">
                <h5>Loading roadmap steps...</h5>
              </div>
            ) : (
              <>
                {/* PROGRESS */}
                <div className="roadmap-progress-card">
                  <div className="roadmap-progress-heading">
                    <div>
                      <h4>Your Progress</h4>
                      <p>
                        {completed.length} of {steps.length} steps completed
                      </p>
                    </div>

                    <strong>{progress}%</strong>
                  </div>

                  <div className="roadmap-progress-track">
                    <div
                      className="roadmap-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* LEARNING STEPS */}
                <h3 className="roadmap-steps-title">
                  Learning Steps
                </h3>

                <div className="roadmap-steps">
                  {steps.map((step, index) => {
                    const isCompleted = completed.includes(step.id);

                    const topics = Array.isArray(step.topics)
                      ? step.topics
                      : [];

                    return (
                      <div
                        className={`roadmap-step ${
                          isCompleted ? "completed" : ""
                        }`}
                        key={step.id}
                      >
                        <div className="roadmap-step-number">
                          {isCompleted
                            ? <CheckCircle2 size={25} />
                            : <Circle size={25} />
                          }
                        </div>

                        <div className="roadmap-step-content">
                          <span>STEP {index + 1}</span>

                          <h4>{step.title}</h4>
                          <p>{step.description}</p>

                          <div className="roadmap-topics">
                            {topics.map((topic, topicIndex) => (
                              <span key={topicIndex}>{topic}</span>
                            ))}
                          </div>
                        </div>

                        <button
                          className="roadmap-complete-btn"
                          onClick={() => toggleStep(step.id)}
                          disabled={updatingStep === step.id}
                        >
                          {updatingStep === step.id
                            ? "Updating..."
                            : isCompleted
                              ? "Completed"
                              : "Mark Complete"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}

export default Roadmap;
