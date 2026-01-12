import { useState, useEffect } from "react";
import "../../styles/admin/registerUser.css";

const teams = [
  "Frontend Team",
  "Backend Team",
  "Full Stack Team",
  "Database Team",
  "QA / Testing Team",
  "DevOps Team",
  "UI/UX Design Team",
];

const skillSuggestions = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular", "Vue.js",
  "Node.js", "Express.js", "Spring Boot", "Java", "Python", "PHP",
  "MySQL", "PostgreSQL", "MongoDB",
  "Docker", "Kubernetes", "AWS", "Azure", "Linux",
  "Git", "Jenkins",
  "Selenium", "Cypress",
  "Figma", "UI/UX"
];

const RegisterUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [password, setPassword] = useState("");

  const [skillInput, setSkillInput] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= SKILL LOGIC ================= */

  const handleSkillChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);

    if (!value.trim()) {
      setFilteredSkills([]);
      setActiveIndex(-1);
      return;
    }

    const filtered = skillSuggestions.filter(
      (skill) =>
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !selectedSkills.includes(skill)
    );

    setFilteredSkills(filtered);
  };

  // ✅ AUTO-SELECT FIRST ITEM WHEN LIST OPENS
  useEffect(() => {
    if (filteredSkills.length > 0) {
      setActiveIndex(0);
    }
  }, [filteredSkills]);

  const addSkill = (skill) => {
    setSelectedSkills((prev) => [...prev, skill]);
    setSkillInput("");
    setFilteredSkills([]);
    setActiveIndex(-1);
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
  };

  // ✅ KEYBOARD NAVIGATION (FIXED)
  const handleSkillKeyDown = (e) => {
    if (!filteredSkills.length) return;

    if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev < filteredSkills.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : filteredSkills.length - 1
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      addSkill(filteredSkills[activeIndex]);
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSkills.length === 0) {
      alert("Please add at least one skill");
      return;
    }

    const payload = {
      name,
      email,
      team,
      skills: selectedSkills,
      password,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/employees/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Registration failed");

      alert("Employee Registered Successfully");

      setName("");
      setEmail("");
      setTeam("");
      setPassword("");
      setSelectedSkills([]);
      setSkillInput("");
      setFilteredSkills([]);
      setActiveIndex(-1);
    } catch (error) {
      alert("Error registering employee");
      console.error(error);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="register-container">
      <h2 className="page-title">Register Employee</h2>

      <form
        className="register-form"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && filteredSkills.length > 0) {
            e.preventDefault(); // ✅ stop focus jump
          }
        }}
      >
        <input
          type="text"
          placeholder="Employee Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Employee Email ID"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select value={team} onChange={(e) => setTeam(e.target.value)} required>
          <option value="">Select Team</option>
          {teams.map((team, index) => (
            <option key={index} value={team}>
              {team}
            </option>
          ))}
        </select>

        {/* Skills */}
        <div className="skill-box">
          <div className="skill-tags">
            {selectedSkills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)}>
                  ×
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            placeholder="Add Skills"
            value={skillInput}
            onChange={handleSkillChange}
            onKeyDown={handleSkillKeyDown}
            autoComplete="off"
          />

          {filteredSkills.length > 0 && (
            <ul className="skill-suggestions">
              {filteredSkills.map((skill, index) => (
                <li
                  key={index}
                  className={index === activeIndex ? "active" : ""}
                  onClick={() => addSkill(skill)}
                >
                  {skill}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterUser;
