import type { Analysis, AnalyzedDoc, PdfPage } from "./studyspark-types";

export const DEMO_PAGES: PdfPage[] = [
  {
    page: 1,
    text: "Unit 3 — Introduction to Machine Learning. Machine learning is a field of study that gives computers the ability to learn patterns from data without being explicitly programmed for every rule.",
  },
  {
    page: 2,
    text: "Supervised learning uses labelled data. Unsupervised learning finds structure in unlabelled data. Reinforcement learning learns from rewards.",
  },
  {
    page: 3,
    text: "Linear regression fits a straight line y = mx + c by minimising the mean squared error MSE = (1/n) * sum (yi - yhat_i)^2.",
  },
  {
    page: 4,
    text: "Overfitting happens when a model memorises training data. Regularisation, cross validation and more data reduce overfitting. Bias-variance tradeoff is central.",
  },
  {
    page: 5,
    text: "Evaluation metrics: accuracy, precision, recall and F1 score. F1 = 2PR/(P+R). Confusion matrix summarises true/false positives and negatives.",
  },
];

export const DEMO_ANALYSIS: Analysis = {
  title: "Unit 3 — Introduction to Machine Learning",
  summary:
    "This material introduces machine learning: what it is, the three main learning types, linear regression and its error function, the overfitting problem, and the metrics used to evaluate models.",
  quickRevision: [
    "Machine learning = learning patterns from data instead of hard-coded rules.",
    "Three types: supervised (labelled), unsupervised (unlabelled), reinforcement (rewards).",
    "Linear regression fits y = mx + c by minimising Mean Squared Error.",
    "Overfitting = memorising training data; fix with regularisation, cross-validation, more data.",
    "Judge classifiers with accuracy, precision, recall and F1 — read them off the confusion matrix.",
  ],
  topics: [
    {
      id: "t1",
      name: "What Machine Learning Is",
      priority: "high",
      why: "The whole unit builds on this definition and it is repeated in the opening pages.",
      explanation:
        "Machine learning lets a computer look at examples and work out the rule by itself. Instead of you writing 'if this, then that' for every case, you show the program lots of data and it finds the pattern.",
      keyPoints: [
        "Learns patterns from data, not from hand-written rules",
        "Needs examples (data) to improve",
        "Foundation for every later topic in this unit",
      ],
      definition:
        "A field of study that gives computers the ability to learn from data without being explicitly programmed.",
      example: "Showing a program 10,000 spam emails so it can flag new spam on its own.",
      page: 1,
    },
    {
      id: "t2",
      name: "Types of Learning",
      priority: "high",
      why: "The material dedicates a full page to comparing the three learning styles.",
      explanation:
        "There are three main ways a model can learn. Supervised learning gets the answers with the data. Unsupervised learning gets no answers and must group things itself. Reinforcement learning tries actions and learns from rewards.",
      keyPoints: [
        "Supervised → labelled data (input + correct answer)",
        "Unsupervised → unlabelled data, finds hidden structure",
        "Reinforcement → learns by trial, error and reward",
      ],
      example: "Sorting photos of cats and dogs (supervised) vs grouping customers (unsupervised).",
      page: 2,
    },
    {
      id: "t3",
      name: "Linear Regression & Mean Squared Error",
      priority: "high",
      why: "Contains the only formula that is derived in detail in the uploaded material.",
      explanation:
        "Linear regression draws the best straight line through your data points. 'Best' means the line where the gap between the real values and predicted values is as small as possible, measured by Mean Squared Error.",
      keyPoints: [
        "Model: y = mx + c",
        "Error measured with MSE",
        "Squaring makes big mistakes count more",
      ],
      definition: "A model that predicts a continuous value using a straight-line relationship.",
      formula: "MSE = (1/n) · Σ (yᵢ − ŷᵢ)²",
      example: "Predicting exam marks from hours studied.",
      page: 3,
    },
    {
      id: "t4",
      name: "Overfitting & Bias-Variance Tradeoff",
      priority: "medium",
      why: "Emphasised as the central practical problem when training models.",
      explanation:
        "A model overfits when it memorises the training examples instead of learning the general rule. It scores brilliantly on practice data and badly on anything new — like memorising answers instead of understanding the subject.",
      keyPoints: [
        "High training score, low test score = overfitting",
        "Fix with regularisation, cross-validation, more data",
        "Bias-variance tradeoff balances too simple vs too complex",
      ],
      definition:
        "Overfitting: when a model fits noise in the training data and fails to generalise.",
      page: 4,
    },
    {
      id: "t5",
      name: "Evaluation Metrics",
      priority: "medium",
      why: "Introduces the vocabulary and one formula used to judge every model.",
      explanation:
        "Accuracy alone can lie when one class is rare. Precision asks 'of the things I flagged, how many were right?' Recall asks 'of the things I should have flagged, how many did I catch?' F1 balances both.",
      keyPoints: [
        "Accuracy = overall correctness",
        "Precision = correctness of positive predictions",
        "Recall = coverage of actual positives",
        "Confusion matrix shows TP, FP, TN, FN",
      ],
      formula: "F1 = 2PR / (P + R)",
      page: 5,
    },
    {
      id: "t6",
      name: "Confusion Matrix",
      priority: "low",
      why: "Mentioned once as a supporting tool for the metrics section.",
      explanation:
        "A small table that counts four things: correct positives, correct negatives, false alarms and missed cases. Every metric on this page is calculated from those four numbers.",
      keyPoints: ["Four cells: TP, FP, TN, FN", "Source of precision and recall"],
      page: 5,
    },
  ],
  notes: [
    {
      heading: "Foundations",
      points: [
        "ML learns patterns from data instead of explicit rules.",
        "Data quality and quantity drive model quality.",
      ],
    },
    {
      heading: "Learning Types",
      points: [
        "Supervised: labelled data → classification / regression.",
        "Unsupervised: unlabelled data → clustering, structure discovery.",
        "Reinforcement: agent learns from rewards.",
      ],
    },
    {
      heading: "Training & Errors",
      points: [
        "Linear regression fits y = mx + c.",
        "MSE penalises large errors more heavily.",
        "Overfitting fixed by regularisation, cross-validation, more data.",
      ],
    },
    {
      heading: "Evaluation",
      points: [
        "Use precision/recall when classes are imbalanced.",
        "F1 = harmonic mean of precision and recall.",
      ],
    },
  ],
  definitions: [
    {
      term: "Machine Learning",
      meaning:
        "A field of study that gives computers the ability to learn from data without being explicitly programmed.",
      page: 1,
    },
    {
      term: "Supervised Learning",
      meaning: "Learning from labelled data where each input has a known correct output.",
      page: 2,
    },
    {
      term: "Unsupervised Learning",
      meaning: "Finding structure or groupings in data that has no labels.",
      page: 2,
    },
    {
      term: "Overfitting",
      meaning: "When a model memorises training data and performs poorly on unseen data.",
      page: 4,
    },
    {
      term: "Recall",
      meaning: "The proportion of actual positive cases that the model correctly identified.",
      page: 5,
    },
  ],
  formulas: [
    {
      expression: "y = mx + c",
      meaning: "The straight line fitted by simple linear regression.",
      symbols: [
        { symbol: "y", meaning: "predicted value" },
        { symbol: "m", meaning: "slope / weight" },
        { symbol: "x", meaning: "input feature" },
        { symbol: "c", meaning: "intercept" },
      ],
      page: 3,
    },
    {
      expression: "MSE = (1/n) · Σ (yᵢ − ŷᵢ)²",
      meaning: "Mean Squared Error — the average squared gap between real and predicted values.",
      symbols: [
        { symbol: "n", meaning: "number of samples" },
        { symbol: "yᵢ", meaning: "actual value" },
        { symbol: "ŷᵢ", meaning: "predicted value" },
      ],
      page: 3,
    },
    {
      expression: "F1 = 2PR / (P + R)",
      meaning: "Harmonic mean of precision and recall.",
      symbols: [
        { symbol: "P", meaning: "precision" },
        { symbol: "R", meaning: "recall" },
      ],
      page: 5,
    },
  ],
  questions: {
    short: [
      "Define machine learning in one sentence.",
      "State the formula for Mean Squared Error.",
      "What is overfitting?",
      "Write the F1 score formula.",
    ],
    long: [
      "Explain the three types of machine learning with one example each.",
      "Describe linear regression and how its error is minimised.",
      "Discuss overfitting, its causes and three techniques used to reduce it.",
    ],
    conceptual: [
      "Why can accuracy be misleading on an imbalanced dataset?",
      "Why does MSE square the errors instead of taking absolute values?",
      "How does the bias-variance tradeoff relate to model complexity?",
    ],
    mcq: [
      {
        question: "Which learning type uses labelled data?",
        options: ["Supervised", "Unsupervised", "Reinforcement", "None"],
        answer: "Supervised",
      },
      {
        question: "A model scores 99% on training and 62% on test data. This suggests:",
        options: ["Underfitting", "Overfitting", "Perfect fit", "Data leakage only"],
        answer: "Overfitting",
      },
      {
        question: "F1 score is the harmonic mean of:",
        options: [
          "Accuracy and recall",
          "Precision and recall",
          "Precision and accuracy",
          "TP and TN",
        ],
        answer: "Precision and recall",
      },
    ],
  },
  flashcards: [
    { question: "What does supervised learning need?", answer: "Labelled data.", page: 2 },
    { question: "Formula for MSE?", answer: "(1/n) · Σ (yᵢ − ŷᵢ)²", page: 3 },
    {
      question: "One sign of overfitting?",
      answer: "High training accuracy but low test accuracy.",
      page: 4,
    },
    { question: "What does recall measure?", answer: "Coverage of actual positive cases.", page: 5 },
    {
      question: "Which table gives TP, FP, TN, FN?",
      answer: "The confusion matrix.",
      page: 5,
    },
  ],
};

export function buildDemoDoc(): AnalyzedDoc {
  return {
    id: `demo-${Date.now()}`,
    fileName: "Sample-ML-Notes.pdf",
    fileSize: 482_301,
    pageCount: DEMO_PAGES.length,
    createdAt: Date.now(),
    demo: true,
    analysis: DEMO_ANALYSIS,
    pages: DEMO_PAGES,
  };
}
