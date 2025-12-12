export const getUnapprovedQuestions = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/unapproved_questions");


    if (!res.ok) {
      console.error("❌ API hatası:", res.status);
      return [];
    }

    const data = await res.json(); // Eğer burada HTML gelirse hata fırlatır
    return data.questions || [];   // Eğer JSON {"questions": [...]} ise

  } catch (err) {
    console.error("❌ JSON parse hatası:", err);
    return [];
  }
};


export const approveAnswer = async (questionId, answerText) => {
  const res = await fetch("/api/approve_answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question_id: questionId, answer: answerText }),
  });
  return res.ok;
};

export const rejectAnswer = async (questionId) => {
  const res = await fetch(`/api/reject_answer/${questionId}`, {
    method: "POST",
  });
  return res.ok;
};

export const markForEdit = async (questionId, answerText) => {
  const res = await fetch("/api/mark_for_edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question_id: questionId, answer: answerText }),
  });
  return res.ok;
};
