document.addEventListener("DOMContentLoaded", () => {

    const resumeText =
        sessionStorage.getItem("resumeText") || "";

    const resumeFileName =
        sessionStorage.getItem("resumeFileName") ||
        "Resume";


    /* ================= CHECK RESUME ================= */

    if (!resumeText) {

        alert(
            "No resume data found. Please analyze your resume first."
        );

        window.location.href = "analyzer.html";

        return;
    }


    /* ================= DISPLAY FILE NAME ================= */

    const resumeName =
        document.getElementById("resumeName");

    resumeName.textContent =
        `Analysis for: ${resumeFileName}`;


    /* ================= NORMALIZE TEXT ================= */

    const text =
        resumeText.toLowerCase();


    /* ================= KEYWORDS ================= */

    const skills = [
        "html",
        "css",
        "javascript",
        "python",
        "java",
        "c++",
        "c",
        "react",
        "node",
        "node.js",
        "sql",
        "mysql",
        "mongodb",
        "git",
        "github",
        "firebase",
        "aws",
        "cloud",
        "machine learning",
        "artificial intelligence",
        "data analysis",
        "excel",
        "communication",
        "leadership",
        "teamwork"
    ];


    const sections = [
        "summary",
        "objective",
        "education",
        "experience",
        "skills",
        "projects",
        "certifications",
        "achievements"
    ];


    /* ================= CONTACT SCORE ================= */

    let contactScore = 0;

    if (
        text.includes("@")
    ) {
        contactScore += 50;
    }

    if (
        /\+?\d[\d\s()-]{8,}/.test(resumeText)
    ) {
        contactScore += 50;
    }


    /* ================= SKILLS SCORE ================= */

    const foundSkills =
        skills.filter(skill =>
            text.includes(skill)
        );

    let skillsScore =
        Math.min(
            100,
            Math.round(
                (foundSkills.length / 8) * 100
            )
        );


    /* ================= EXPERIENCE SCORE ================= */

    let experienceScore = 0;

    if (
        text.includes("experience") ||
        text.includes("work experience") ||
        text.includes("internship")
    ) {
        experienceScore += 70;
    }

    if (
        text.includes("responsibilities") ||
        text.includes("achievement") ||
        text.includes("worked") ||
        text.includes("developed")
    ) {
        experienceScore += 30;
    }

    experienceScore =
        Math.min(100, experienceScore);


    /* ================= EDUCATION SCORE ================= */

    let educationScore = 0;

    const educationWords = [
        "education",
        "bachelor",
        "master",
        "degree",
        "college",
        "university",
        "school",
        "b.tech",
        "bca",
        "mca",
        "b.sc",
        "m.sc"
    ];

    educationWords.forEach(word => {

        if (text.includes(word)) {
            educationScore += 15;
        }

    });

    educationScore =
        Math.min(100, educationScore);


    /* ================= KEYWORD SCORE ================= */

    const keywordCount =
        foundSkills.length;

    const keywordScore =
        Math.min(
            100,
            Math.round(
                (keywordCount / 10) * 100
            )
        );


    /* ================= STRUCTURE SCORE ================= */

    const foundSections =
        sections.filter(section =>
            text.includes(section)
        );

    const structureScore =
        Math.min(
            100,
            Math.round(
                (foundSections.length /
                    sections.length) * 100
            )
        );


    /* ================= OVERALL SCORE ================= */

    const overallScore =
        Math.round(
            (
                contactScore +
                skillsScore +
                experienceScore +
                educationScore +
                keywordScore +
                structureScore
            ) / 6
        );


    /* ================= UPDATE SCORE ================= */

    updateScore(
        "overallScore",
        overallScore
    );


    updateScore(
        "contactScore",
        contactScore
    );

    updateScore(
        "skillsScore",
        skillsScore
    );

    updateScore(
        "experienceScore",
        experienceScore
    );

    updateScore(
        "educationScore",
        educationScore
    );

    updateScore(
        "keywordScore",
        keywordScore
    );

    updateScore(
        "structureScore",
        structureScore
    );


    /* ================= PROGRESS BARS ================= */

    updateBar(
        "contactBar",
        contactScore
    );

    updateBar(
        "skillsBar",
        skillsScore
    );

    updateBar(
        "experienceBar",
        experienceScore
    );

    updateBar(
        "educationBar",
        educationScore
    );

    updateBar(
        "keywordBar",
        keywordScore
    );

    updateBar(
        "structureBar",
        structureScore
    );


    /* ================= SCORE MESSAGE ================= */

    const scoreTitle =
        document.getElementById("scoreTitle");

    const scoreDescription =
        document.getElementById("scoreDescription");


    if (overallScore >= 80) {

        scoreTitle.textContent =
            "Strong ATS Compatibility";

        scoreDescription.textContent =
            "Your resume contains many elements that ATS systems commonly look for.";

    }

    else if (overallScore >= 60) {

        scoreTitle.textContent =
            "Good, But Can Improve";

        scoreDescription.textContent =
            "Your resume has a solid foundation, but several areas can be improved.";

    }

    else if (overallScore >= 40) {

        scoreTitle.textContent =
            "Needs Improvement";

        scoreDescription.textContent =
            "Your resume contains useful information, but important ATS elements are missing.";

    }

    else {

        scoreTitle.textContent =
            "Major Improvements Needed";

        scoreDescription.textContent =
            "Your resume is missing several important elements commonly used by ATS systems.";

    }


    /* ================= STRENGTHS ================= */

    const strengths = [];

    if (contactScore >= 100) {
        strengths.push(
            "Your contact information appears complete."
        );
    }

    if (skillsScore >= 60) {
        strengths.push(
            "Your resume contains a good number of relevant skills."
        );
    }

    if (experienceScore >= 70) {
        strengths.push(
            "Your experience section contains useful career information."
        );
    }

    if (educationScore >= 60) {
        strengths.push(
            "Your educational background is clearly mentioned."
        );
    }

    if (structureScore >= 60) {
        strengths.push(
            "Your resume contains several standard resume sections."
        );
    }

    if (strengths.length === 0) {
        strengths.push(
            "Your resume has been successfully extracted and analyzed."
        );
    }


    displayList(
        "strengthsList",
        strengths
    );


    /* ================= IMPROVEMENTS ================= */

    const improvements = [];

    if (contactScore < 100) {
        improvements.push(
            "Make sure your email address and phone number are clearly visible."
        );
    }

    if (skillsScore < 60) {
        improvements.push(
            "Add more relevant technical and professional skills."
        );
    }

    if (experienceScore < 70) {
        improvements.push(
            "Add internships, projects, work experience, or measurable achievements."
        );
    }

    if (educationScore < 60) {
        improvements.push(
            "Clearly mention your degree, institution, and education details."
        );
    }

    if (keywordScore < 60) {
        improvements.push(
            "Add job-specific keywords related to the position you want."
        );
    }

    if (structureScore < 60) {
        improvements.push(
            "Use standard sections such as Summary, Skills, Projects, Education, and Experience."
        );
    }


    if (improvements.length === 0) {

        improvements.push(
            "Your basic ATS structure looks good. AI analysis can provide more personalized suggestions."
        );

    }


    displayList(
        "improvementsList",
        improvements
    );


    /* ================= RECOMMENDED KEYWORDS ================= */

    const recommendedKeywords = [
        "Problem Solving",
        "Communication",
        "Teamwork",
        "Leadership",
        "Project Management",
        "Git",
        "GitHub",
        "SQL",
        "Python",
        "JavaScript",
        "HTML",
        "CSS",
        "Data Analysis",
        "Cloud Computing",
        "Artificial Intelligence"
    ];


    const keywordList =
        document.getElementById("keywordList");


    recommendedKeywords.forEach(keyword => {

        const tag =
            document.createElement("span");

        tag.className =
            "keyword-tag";

        tag.textContent =
            keyword;

        keywordList.appendChild(tag);

    });


    /* ================= SAVE ANALYSIS ================= */

    const analysisData = {

        fileName: resumeFileName,

        overallScore,

        contactScore,

        skillsScore,

        experienceScore,

        educationScore,

        keywordScore,

        structureScore,

        foundSkills,

        foundSections,

        analyzedAt:
            new Date().toISOString()

    };


    sessionStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(analysisData)
    );


    console.log(
        "ResumeAI ATS Analysis:",
        analysisData
    );


    /* ================= FUNCTIONS ================= */

    function updateScore(id, value) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                value + "%";

        }

    }


    function updateBar(id, value) {

        const bar =
            document.getElementById(id);

        if (bar) {

            setTimeout(() => {

                bar.style.width =
                    value + "%";

            }, 100);

        }

    }


    function displayList(id, items) {

        const list =
            document.getElementById(id);

        if (!list) {
            return;
        }

        list.innerHTML = "";

        items.forEach(item => {

            const li =
                document.createElement("li");

            li.textContent =
                item;

            list.appendChild(li);

        });

    }


    console.log(
        "ResumeAI ATS Engine loaded successfully!"
    );

});
