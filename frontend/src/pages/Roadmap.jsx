
import { useState } from "react";
import {
  Monitor,
  Server,
  Code,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight
} from "lucide-react";

import roadmaps from "../data/roadmaps";

const roadmapIcons = {
  Monitor,
  Server,
  Code
};

function Roadmap() {

  const [selectedId, setSelectedId] = useState(1);

  const [completedSteps, setCompletedSteps] = useState(() =>
    JSON.parse(localStorage.getItem("ss_roadmap") || "{}")
  );

  const selectedRoadmap = roadmaps.find(
    (roadmap) => roadmap.id === selectedId
  );

  const completed = completedSteps[selectedId] || [];

  const progress = Math.round(
    (completed.length / selectedRoadmap.steps.length) * 100
  );

  const toggleStep = (stepId) => {

    const currentSteps = completedSteps[selectedId] || [];

    const updatedSteps = currentSteps.includes(stepId)
      ? currentSteps.filter((id) => id !== stepId)
      : [...currentSteps, stepId];

    const updatedData = {
      ...completedSteps,
      [selectedId]: updatedSteps
    };

    setCompletedSteps(updatedData);

    localStorage.setItem(
      "ss_roadmap",
      JSON.stringify(updatedData)
    );
  };

  const Icon = roadmapIcons[selectedRoadmap.icon];

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
              const PathIcon = roadmapIcons[item.icon];

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

            {/* PROGRESS */}

            <div className="roadmap-progress-card">

              <div className="roadmap-progress-heading">
                <div>
                  <h4>Your Progress</h4>
                  <p>
                    {completed.length} of {selectedRoadmap.steps.length}
                    {" "}steps completed
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

              {selectedRoadmap.steps.map((step, index) => {

                const isCompleted = completed.includes(step.id);

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
                        {step.topics.map((topic) => (
                          <span key={topic}>{topic}</span>
                        ))}
                      </div>

                    </div>

                    <button
                      className="roadmap-complete-btn"
                      onClick={() => toggleStep(step.id)}
                    >
                      {isCompleted ? "Completed" : "Mark Complete"}
                    </button>

                  </div>
                );
              })}

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Roadmap;
