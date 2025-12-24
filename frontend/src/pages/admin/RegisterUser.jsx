import { useState } from "react";
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

  /* ================= SKILL LOGIC ================= */

  const handleSkillChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);

    if (!value.trim()) {
      setFilteredSkills([]);
      return;
    }

    const filtered = skillSuggestions.filter(
      (skill) =>
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !selectedSkills.includes(skill)
    );

    setFilteredSkills(filtered);
  };

  const addSkill = (skill) => {
    setSelectedSkills([...selectedSkills, skill]);
    setSkillInput("");
    setFilteredSkills([]);
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(
      selectedSkills.filter((skill) => skill !== skillToRemove)
    );
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
        "http://localhost:8080/api/employees/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      alert("Employee Registered Successfully");

      // Reset form
      setName("");
      setEmail("");
      setTeam("");
      setPassword("");
      setSelectedSkills([]);
      setSkillInput("");
    } catch (error) {
      alert("Error registering employee");
      console.error(error);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="register-container">
      <h2>Register Employee</h2>

      <form className="register-form" onSubmit={handleSubmit}>
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

        {/* Team */}
        <select
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          required
        >
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
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                >
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
            autoComplete="off"
          />

          {filteredSkills.length > 0 && (
            <ul className="skill-suggestions">
              {filteredSkills.map((skill, index) => (
                <li key={index} onClick={() => addSkill(skill)}>
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
