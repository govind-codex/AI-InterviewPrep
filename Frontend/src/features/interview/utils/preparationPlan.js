const questionText = (item) => typeof item?.question === 'string' ? item.question.trim() : ''
const skillName = (item) => typeof item?.skill === 'string' ? item.skill.trim() : ''

const tasksOrFallback = (tasks, fallback) => {
  const usableTasks = tasks.filter(Boolean)
  return usableTasks.length > 0 ? usableTasks : fallback
}

export const buildFallbackPreparationPlan = (report = {}) => {
  const technicalQuestions = (report.technicalQuestions ?? []).map(questionText).filter(Boolean)
  const behavioralQuestions = (report.behavioralQuestions ?? []).map(questionText).filter(Boolean)
  const skillGaps = (report.skillGaps ?? []).map(skillName).filter(Boolean)

  return [
    {
      day: 1,
      focus: 'Role requirements and priority gaps',
      tasks: tasksOrFallback(
        skillGaps.slice(0, 3).map((skill) => `Review the fundamentals of ${skill} and note your weakest areas.`),
        ['Review the job description and list the five skills or outcomes emphasized most.']
      )
    },
    {
      day: 2,
      focus: skillGaps[0] ? `${skillGaps[0]} foundations` : 'Technical foundations',
      tasks: tasksOrFallback(
        technicalQuestions.slice(0, 2).map((question) => `Prepare and explain a strong answer to: ${question}`),
        ['Review the core concepts required by the role and create concise study notes.']
      )
    },
    {
      day: 3,
      focus: 'Applied technical practice',
      tasks: tasksOrFallback(
        technicalQuestions.slice(2, 5).map((question) => `Practice answering aloud: ${question}`),
        ['Complete two role-relevant exercises and explain your decisions aloud.']
      )
    },
    {
      day: 4,
      focus: 'Behavioral stories and communication',
      tasks: tasksOrFallback(
        behavioralQuestions.slice(0, 3).map((question) => `Build a concise STAR story for: ${question}`),
        ['Prepare three STAR stories covering impact, collaboration, and a difficult challenge.']
      )
    },
    {
      day: 5,
      focus: 'Mock interview and final review',
      tasks: [
        'Run a timed mock interview using the generated technical and behavioral questions.',
        'Review weak answers and prepare two thoughtful questions for the interviewer.'
      ]
    }
  ]
}

export const getPreparationPlan = (report) => {
  if (!report) return []
  if (report.preparationPlan?.length) return report.preparationPlan
  if (report.preperationPlan?.length) return report.preperationPlan
  return buildFallbackPreparationPlan(report)
}
