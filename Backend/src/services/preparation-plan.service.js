function getQuestionText(item) {
    return typeof item?.question === 'string' ? item.question.trim() : '';
}

function getSkillName(item) {
    return typeof item?.skill === 'string' ? item.skill.trim() : '';
}

function withFallback(tasks, fallback) {
    const usableTasks = tasks.filter(Boolean);
    return usableTasks.length > 0 ? usableTasks : fallback;
}

function buildFallbackPreparationPlan(report = {}) {
    const technicalQuestions = Array.isArray(report.technicalQuestions)
        ? report.technicalQuestions.map(getQuestionText).filter(Boolean)
        : [];
    const behavioralQuestions = Array.isArray(report.behavioralQuestions)
        ? report.behavioralQuestions.map(getQuestionText).filter(Boolean)
        : [];
    const skillGaps = Array.isArray(report.skillGaps)
        ? report.skillGaps.map(getSkillName).filter(Boolean)
        : [];

    return [
        {
            day: 1,
            focus: 'Role requirements and priority gaps',
            tasks: withFallback(
                skillGaps.slice(0, 3).map((skill) => `Review the fundamentals of ${skill} and write down your weakest areas.`),
                ['Review the job description and list the five skills or outcomes emphasized most.']
            ),
        },
        {
            day: 2,
            focus: skillGaps[0] ? `${skillGaps[0]} foundations` : 'Technical foundations',
            tasks: withFallback(
                technicalQuestions.slice(0, 2).map((question) => `Prepare and explain a strong answer to: ${question}`),
                ['Review the core concepts required by the role and create concise study notes.']
            ),
        },
        {
            day: 3,
            focus: 'Applied technical practice',
            tasks: withFallback(
                technicalQuestions.slice(2, 5).map((question) => `Practice answering aloud: ${question}`),
                ['Complete two role-relevant practical exercises and explain your decisions aloud.']
            ),
        },
        {
            day: 4,
            focus: 'Behavioral stories and communication',
            tasks: withFallback(
                behavioralQuestions.slice(0, 3).map((question) => `Build a concise STAR story for: ${question}`),
                ['Prepare three STAR stories covering impact, collaboration, and handling a difficult challenge.']
            ),
        },
        {
            day: 5,
            focus: 'Mock interview and final review',
            tasks: [
                'Run a timed mock interview using the generated technical and behavioral questions.',
                'Review weak answers, tighten your examples, and prepare two thoughtful questions for the interviewer.',
            ],
        },
    ];
}

function getPreparationPlan(report = {}) {
    if (Array.isArray(report.preparationPlan) && report.preparationPlan.length > 0) {
        return report.preparationPlan;
    }

    if (Array.isArray(report.preperationPlan) && report.preperationPlan.length > 0) {
        return report.preperationPlan;
    }

    return buildFallbackPreparationPlan(report);
}

module.exports = { buildFallbackPreparationPlan, getPreparationPlan };
