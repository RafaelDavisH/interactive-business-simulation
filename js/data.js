/**
 * BizSim Data — Complete simulation content for all three startup scenarios.
 * Exposes window.BizSimData.
 */
(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────────
  // SCENARIOS
  // ─────────────────────────────────────────────────────────────────────────────
  const scenarios = {
    foodietrack: {
      id: 'foodietrack',
      name: 'FoodieTrack',
      tagline: 'Smarter inventory. Less waste. More profit.',
      industry: 'B2B SaaS — Restaurant Tech',
      description:
        'A SaaS platform helping independent restaurant owners track inventory in real-time, predict waste, and optimize ordering — saving 15–20% on food costs.',
      color: '#f1be32',
      difficulty: 'Intermediate',
      icon: '🍽️',
    },
    healthbuddy: {
      id: 'healthbuddy',
      name: 'HealthBuddy',
      tagline: "Your parent's health, in your hands.",
      industry: 'Consumer Health Tech',
      description:
        "A mobile app helping adult children monitor elderly parents' medication adherence, vitals, and appointment scheduling — with family-wide visibility.",
      color: '#acd157',
      difficulty: 'Beginner',
      icon: '🏥',
    },
    devcollab: {
      id: 'devcollab',
      name: 'DevCollab',
      tagline: 'Code review without the timezone pain.',
      industry: 'Developer Tools — B2B SaaS',
      description:
        'An async code review platform with AI-powered context summaries, built for distributed engineering teams across time zones.',
      color: '#dbb8ff',
      difficulty: 'Advanced',
      icon: '💻',
    },
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 1 — Problem & Market Validation
  // ─────────────────────────────────────────────────────────────────────────────

  // Activity 1 — Hypothesis Builder templates
  const hypothesisTemplates = {
    foodietrack: {
      customer: 'independent restaurant owners (10–50 seat restaurants)',
      problem:
        'manually tracking inventory across multiple suppliers leads to over-ordering, spoilage, and profit leakage',
      context: 'they prepare weekly orders and do month-end food cost reconciliation',
    },
    healthbuddy: {
      customer: 'adult children (35–55) with aging parents living independently',
      problem:
        'not knowing whether their elderly parent has taken medications or attended appointments causes daily anxiety and reactive health crises',
      context: 'when a parent lives alone 30+ minutes away and adult children are working full-time',
    },
    devcollab: {
      customer: 'engineering managers at 20–200 person startups with distributed teams',
      problem:
        'async code reviews are blocked for 24–72 hours due to missing context, time zone gaps, and context-switching overhead',
      context: 'during active sprints when fast iteration velocity is critical',
    },
  };

  // Activity 2 — Interview Question Filter (shared across all scenarios)
  const interviewQuestions = [
    {
      id: 'q1',
      text: 'Walk me through how you handled inventory ordering last week.',
      isLeading: false,
      explanation:
        'Open-ended and asks about past behavior — the gold standard for unbiased customer interviews.',
    },
    {
      id: 'q2',
      text: "Don't you think bad inventory tracking is costing you money?",
      isLeading: true,
      explanation:
        'Leading — assumes the problem and suggests the answer.',
    },
    {
      id: 'q3',
      text: "If we built an app that automated your ordering, would you use it?",
      isLeading: true,
      explanation:
        "Hypothetical future intent — 'would you' is unreliable. Ask about current behavior instead.",
    },
    {
      id: 'q4',
      text: 'How did you last realize you ran out of a key ingredient?',
      isLeading: false,
      explanation:
        'Specific past event — surfaces real friction and workarounds.',
    },
    {
      id: 'q5',
      text: 'How much do you think you currently spend on food waste?',
      isLeading: false,
      explanation:
        'Quantitative past behavior — gives signal on pain intensity.',
    },
    {
      id: 'q6',
      text: 'Would you pay $99/month for a solution that saved you 10% on food costs?',
      isLeading: true,
      explanation:
        'Pitching + hypothetical pricing — never ask about hypothetical willingness to pay in discovery.',
    },
    {
      id: 'q7',
      text: "What tools are you using today to manage inventory? Why those?",
      isLeading: false,
      explanation:
        'Asks about current solutions — reveals workarounds and switching cost signals.',
    },
    {
      id: 'q8',
      text: "Isn't it frustrating when you have to throw away expired ingredients?",
      isLeading: true,
      explanation:
        'Emotional lead — biases the customer to agree with your framing.',
    },
  ];

  // Activity 3 — Market Sizing per scenario
  const marketSizing = {
    foodietrack: {
      tam: { value: 280, unit: 'B', label: 'Global restaurant tech market (2024)' },
      sam: { value: 4.2, unit: 'B', label: 'US independent restaurants needing inventory SaaS' },
      som: { value: 42, unit: 'M', label: 'Year 3 target: 7,000 restaurants × $500/yr' },
      tamReasoning: '~1M independent restaurants in the US × avg $280K annual revenue',
      samReasoning: '~420K US restaurants willing to adopt SaaS tools (Technavio 2023)',
      somReasoning: 'Capture 1.7% of SAM in 3 years — 7,000 restaurants at $500 ARR average',
    },
    healthbuddy: {
      tam: { value: 50, unit: 'B', label: 'US digital health & aging-in-place market' },
      sam: { value: 3.8, unit: 'B', label: 'Adults 35–60 with aging parents + smartphone' },
      som: { value: 19, unit: 'M', label: 'Year 2 target: 190,000 users × $8/mo' },
      tamReasoning: '54M Americans 65+ by 2030; $50B+ caregiver tech and digital health market',
      samReasoning: '~48M adult children of aging parents; 8% are primary digital health coordinators',
      somReasoning: '0.5% SAM at $96/year ARR = $19M — realistic for Y2 consumer health app',
    },
    devcollab: {
      tam: { value: 25, unit: 'B', label: 'Global developer tools & code collaboration market' },
      sam: { value: 2.1, unit: 'B', label: 'Startups with 10–200 engineers using async processes' },
      som: { value: 8.4, unit: 'M', label: 'Year 1: 700 teams × $1,000/yr average' },
      tamReasoning:
        '26M developers globally; GitHub + GitLab combined $25B+ market cap signals TAM',
      samReasoning:
        '~210K startups worldwide with 10–200 eng teams; ~$10K avg spend on tooling',
      somReasoning:
        '0.4% SAM at avg $1K ARR = $8.4M — achievable with PLG + developer community',
    },
  };

  // Activity 4 — Smoke Test Decision per scenario
  const smokeTests = {
    foodietrack: {
      scenario:
        "You built a landing page: 'FoodieTrack — Cut food waste by 20%. Join waitlist.' You ran $200 in Google Ads targeting 'restaurant inventory management' for 5 days.",
      data: {
        Visitors: '412',
        'Email signups': '47',
        'Conversion rate': '11.4%',
        'Avg time on page': '2m 14s',
        '3 interviews booked': 'Yes',
      },
      options: [
        { id: 'proceed', label: 'Proceed to MVP — signals are strong', correct: true },
        { id: 'pivot', label: 'Pivot the message — conversion too low', correct: false },
        { id: 'abandon', label: 'Abandon — not enough traffic', correct: false },
      ],
      explanation:
        '11.4% email capture rate is well above the 5% benchmark. High time-on-page and interview bookings signal strong intent. Proceed to build MVP.',
    },
    healthbuddy: {
      scenario:
        "Your landing page 'HealthBuddy — Know your parent is safe' ran $150 Facebook Ads targeting adults 35–55 with elderly parent keywords for 7 days.",
      data: {
        Visitors: '831',
        'Email signups': '28',
        'Conversion rate': '3.4%',
        'Avg time on page': '0m 48s',
        'Interviews booked': '1',
      },
      options: [
        { id: 'proceed', label: 'Proceed to MVP — enough signal', correct: false },
        { id: 'pivot', label: 'Pivot the message — low conversion and engagement', correct: true },
        { id: 'abandon', label: "Abandon — the market doesn't care", correct: false },
      ],
      explanation:
        "3.4% conversion and <1 min on page signal messaging mismatch, not necessarily a dead market. The emotional message needs refinement — test a more specific pain ('Medication reminders for aging parents') before abandoning.",
    },
    devcollab: {
      scenario:
        "Landing page 'DevCollab — Async code review without the wait' posted on Hacker News (Show HN) and your team's Twitter. No paid ads.",
      data: {
        Visitors: '1,240',
        'Email signups': '89',
        'Conversion rate': '7.2%',
        'GitHub Stars (beta repo)': '43',
        'Interviews booked': '11',
      },
      options: [
        { id: 'proceed', label: 'Proceed to MVP — strong developer interest', correct: true },
        { id: 'pivot', label: 'Pivot — need to validate enterprise buyers too', correct: false },
        { id: 'abandon', label: "Abandon — GitHub stars don't mean revenue", correct: false },
      ],
      explanation:
        "7.2% conversion with organic traffic is excellent. 43 GitHub stars + 11 interview bookings from developers signals authentic pull. Proceed to MVP — but note that enterprise buyer validation should happen in parallel.",
    },
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 2 — Customer Discovery
  // ─────────────────────────────────────────────────────────────────────────────

  // Activity 1 — Interview Simulation
  const interviewProfiles = {
    foodietrack: { name: 'Marco', role: 'Owner, Trattoria Bella (32-seat Italian restaurant)', avatar: '👨‍🍳' },
    healthbuddy: { name: 'Sarah', role: 'Marketing Manager, daughter of 74-year-old Frank', avatar: '👩' },
    devcollab: { name: 'Priya', role: 'Engineering Manager, 28-person distributed team', avatar: '👩‍💻' },
  };

  const interviewRounds = {
    foodietrack: [
      {
        round: 1,
        theme: 'Opening — Understand the Pain',
        customerStatement:
          '"Yeah, inventory is definitely a headache. Every Monday I basically guess what to order."',
        options: [
          { text: 'Would an automated ordering system help you?', correct: false, why: 'Hypothetical — pitching too early' },
          { text: 'Walk me through exactly how you placed last Monday\'s order.', correct: true, why: 'Past behavior, open-ended — reveals real workflow' },
          { text: "Don't you think guessing is costing you money?", correct: false, why: "Leading — you're putting words in their mouth" },
        ],
      },
      {
        round: 2,
        theme: 'Dig Into Workarounds',
        customerStatement:
          '"I use a spreadsheet my accountant built years ago. It kind of works but I always end up calling suppliers anyway."',
        options: [
          { text: 'Show me exactly how that spreadsheet works — walk me through it.', correct: true, why: 'Asks to observe the current workaround — surfaces switching cost and depth of pain' },
          { text: "Would you switch to a better tool if it existed?", correct: false, why: "Hypothetical — 'would you' questions are unreliable" },
          { text: 'What does your accountant think about the spreadsheet?', correct: false, why: 'Tangential — shifts focus away from your customer\'s own workflow' },
        ],
      },
      {
        round: 3,
        theme: 'Understand Financial & Emotional Impact',
        customerStatement:
          '"Last month I had to throw out a whole case of salmon. That\'s like $300 straight into the trash."',
        options: [
          { text: 'How often does something like that happen?', correct: true, why: 'Quantifies frequency of the loss — builds a picture of annual impact' },
          { text: "That must be so frustrating, right?", correct: false, why: "Emotional lead — you're projecting their feelings" },
          { text: 'Would you pay to prevent that from happening?', correct: false, why: 'Pitching + hypothetical WTP — too early and too leading' },
        ],
      },
      {
        round: 4,
        theme: 'Problem Prioritization',
        customerStatement:
          '"Honestly between staffing, rent, and customer reviews — inventory is probably third or fourth on my stress list most weeks."',
        options: [
          { text: "What's the biggest operational headache right now and why?", correct: true, why: 'Uncovers problem ranking without suggesting inventory is top priority — critical signal' },
          { text: 'But inventory is still a real problem, right?', correct: false, why: "Defensive — you're steering the customer back to your preferred problem" },
          { text: 'If we could solve inventory, would that move it up your list?', correct: false, why: 'Hypothetical + leading — biases the answer' },
        ],
      },
      {
        round: 5,
        theme: 'Referrals',
        customerStatement:
          '"This has been really interesting. I\'ve never thought about it this way before."',
        options: [
          { text: 'Thanks! Can you think of 2 or 3 other restaurant owners who deal with similar challenges?', correct: true, why: "Classic referral ask — expands your interview pipeline and signals the customer's confidence in you" },
          { text: 'Would you like to sign up for early access when we build this?', correct: false, why: "Pitching at the close — breaks the discovery contract and ends the relationship-building mode" },
          { text: "Great talking to you. I'll follow up if we build something.", correct: false, why: "Missed opportunity — you walked away without a warm referral or any forward motion" },
        ],
      },
    ],

    healthbuddy: [
      {
        round: 1,
        theme: 'Opening — Understand the Pain',
        customerStatement:
          '"I call Dad every night to remind him about his pills. It\'s become kind of stressful."',
        options: [
          { text: 'Would an app that sent him reminders help reduce your stress?', correct: false, why: 'Hypothetical — pitching a solution too early' },
          { text: 'Tell me about the last time you were really worried about whether he\'d taken his medication.', correct: true, why: 'Specific past event — uncovers emotional intensity and real context' },
          { text: 'How much time per week do you spend managing your Dad\'s health?', correct: false, why: 'Not bad, but the daily-call setup offers richer emotional context first' },
        ],
      },
      {
        round: 2,
        theme: 'Dig Into Workarounds',
        customerStatement:
          '"He has one of those pill organizer boxes — the weekly kind. But he forgets to fill it too."',
        options: [
          { text: 'Who fills the pill organizer now, and how often does that happen?', correct: true, why: "Explores the current workaround mechanics — who does what, how often, what breaks" },
          { text: 'Have you looked into any apps for this?', correct: false, why: "Suggests a category before understanding if they've already tried it" },
          { text: 'Your dad really needs more help, doesn\'t he?', correct: false, why: "Emotional lead and presumptuous — puts words in their mouth" },
        ],
      },
      {
        round: 3,
        theme: 'Understand Emotional & Practical Impact',
        customerStatement:
          '"Last spring he missed his blood pressure meds for three days and ended up in the ER. That was terrifying."',
        options: [
          { text: 'What happened in the days leading up to that — what did you know and when?', correct: true, why: "Reconstructs the failure scenario — surfaces the information gap that caused the crisis" },
          { text: "That must have been awful. Would better monitoring have prevented it?", correct: false, why: "Emotional validation followed by a hypothetical — mixing empathy with pitching" },
          { text: 'Have you considered moving him closer to you?', correct: false, why: "Out of scope — derails discovery into personal life decisions" },
        ],
      },
      {
        round: 4,
        theme: 'Problem Prioritization',
        customerStatement:
          '"I also worry about him falling, being lonely, driving at night... it\'s a lot."',
        options: [
          { text: "Of all those concerns, which one keeps you up at night the most right now?", correct: true, why: "Forces a natural ranking — helps you understand where medications sit vs. other worries" },
          { text: "But the medication issue is the most dangerous one, right?", correct: false, why: "Leading — steering the customer to confirm your thesis" },
          { text: "Have you talked to his doctor about all this?", correct: false, why: "Deflects to a third party — loses the thread of the customer's own decision-making" },
        ],
      },
      {
        round: 5,
        theme: 'Referrals',
        customerStatement:
          '"You\'ve really made me think about this differently. I hadn\'t realized how much mental load this is."',
        options: [
          { text: 'That means a lot. Do you know 2 or 3 other people in a similar situation — adult kids looking after aging parents?', correct: true, why: 'Warm referral ask — leverages the emotional connection to expand your research network' },
          { text: 'We\'re building something to solve this. Can I add you to our waitlist?', correct: false, why: "Switches from discovery to sales — breaks trust and ends authentic dialogue" },
          { text: "Thanks so much. I'll keep you posted on what we build.", correct: false, why: "Passive close — no referral, no next step, no forward motion" },
        ],
      },
    ],

    devcollab: [
      {
        round: 1,
        theme: 'Opening — Understand the Pain',
        customerStatement:
          '"Code reviews are definitely slow. Sometimes PRs sit for two days before anyone looks at them."',
        options: [
          { text: "What did you try to fix this before?", correct: true, why: 'Asks about past attempts — reveals workarounds and depth of pain' },
          { text: 'Would async tools help your team move faster?', correct: false, why: 'Hypothetical solution pitch — too early' },
          { text: 'Is that because of time zones?', correct: false, why: 'Leading — assumes a root cause before exploring it' },
        ],
      },
      {
        round: 2,
        theme: 'Dig Into Workarounds',
        customerStatement:
          '"We tried a standup bot on Slack, but people stopped updating it after two weeks. And GitHub comments get buried."',
        options: [
          { text: "Walk me through the last PR that got stuck. What exactly happened?", correct: true, why: "Specific past incident — surfaces the real failure mode in granular detail" },
          { text: 'Why do you think people stopped using the bot?', correct: false, why: "Asks for diagnosis rather than narrative — you lose the behavioral detail" },
          { text: 'Would a better bot fix the problem?', correct: false, why: "Hypothetical solution — still pitching disguised as a question" },
        ],
      },
      {
        round: 3,
        theme: 'Understand Business & Emotional Impact',
        customerStatement:
          '"We slipped a sprint release by four days last quarter because of a review bottleneck. My CTO was not happy."',
        options: [
          { text: "How did that conversation with your CTO go, and what were the consequences?", correct: true, why: "Explores downstream impact and organizational pressure — quantifies stakes" },
          { text: "Four days is a long delay. Isn't that unacceptable?", correct: false, why: "Evaluative lead — you're telling them how to feel about it" },
          { text: "Would faster reviews have saved the sprint?", correct: false, why: "Counterfactual hypothetical — can't be answered reliably" },
        ],
      },
      {
        round: 4,
        theme: 'Problem Prioritization',
        customerStatement:
          '"Between hiring, onboarding, and technical debt, I have a lot on my plate. Code review velocity is one piece."',
        options: [
          { text: "How would you rank code review friction against your other top three engineering challenges right now?", correct: true, why: "Explicit ranking question — surfaces whether you're solving a top-tier or secondary pain" },
          { text: "But slow code reviews affect everything else, don't they?", correct: false, why: "Leading and presumptuous — you're making their argument for them" },
          { text: "What does your team think about the review process?", correct: false, why: "Not terrible, but deflects from the manager's personal prioritization" },
        ],
      },
      {
        round: 5,
        theme: 'Referrals',
        customerStatement:
          '"This was actually really valuable. I don\'t usually get to talk through this stuff externally."',
        options: [
          { text: "Glad to hear it. Who else on your network — other eng managers or CTOs — do you think would have similar pain?", correct: true, why: "Warm referral into a specific peer group — leverages credibility to scale your interview pipeline" },
          { text: "Can I demo what we're building to your team?", correct: false, why: "Pivots to sales — too early and breaks the discovery relationship" },
          { text: "Thanks so much for your time.", correct: false, why: "No ask — leaves the conversation without any forward motion" },
        ],
      },
    ],
  };

  // Activity 2 — Early Adopter Profiler
  const earlyAdopterCriteria = [
    { id: 'acute', label: 'Suffers the problem acutely and urgently', required: true },
    { id: 'workaround', label: 'Has tried to solve it before (workarounds exist)', required: true },
    { id: 'budget', label: 'Has budget authority or access to budget', required: true },
    { id: 'reachable', label: 'Is reachable and accessible to you', required: true },
    { id: 'honest', label: 'Will give honest, critical feedback', required: false },
    { id: 'influencer', label: 'Has influence over others in the segment', required: false },
  ];

  const earlyAdopterProfiles = {
    foodietrack:
      'Restaurant owners who track inventory in spreadsheets or napkins, have experienced at least one 86\'d menu item in the past month, and have decision-making authority over tech spend.',
    healthbuddy:
      'Adult children 35–55 who call elderly parents daily about medications, have experienced at least one health scare in the past year, and are primary care coordinators.',
    devcollab:
      'Engineering managers at 15–50 person startups with engineers across 2+ time zones who have manually tried standup bots or async tools that didn\'t stick.',
  };

  // Activity 3 — Affinity Mapping
  const affinityBuckets = [
    { id: 'problem', label: 'Problem Signals', color: 'danger' },
    { id: 'behavior', label: 'Behavioral Patterns', color: 'warning' },
    { id: 'motivation', label: 'Motivations & Goals', color: 'success' },
  ];

  const affinityCards = {
    foodietrack: [
      { id: 'c1', text: '"I threw out $400 of salmon last month because I over-ordered."', bucket: 'problem' },
      { id: 'c2', text: '"I call my supplier every Monday with a handwritten list."', bucket: 'behavior' },
      { id: 'c3', text: '"I want to keep food costs under 28% of revenue."', bucket: 'motivation' },
      { id: 'c4', text: '"We 86\'d our signature dish twice last quarter — guests were angry."', bucket: 'problem' },
      { id: 'c5', text: '"I use a spreadsheet my accountant set up 5 years ago."', bucket: 'behavior' },
      { id: 'c6', text: '"If I could reduce waste, I could finally take a real vacation."', bucket: 'motivation' },
      { id: 'c7', text: '"I have no idea what my actual food cost percentage is right now."', bucket: 'problem' },
      { id: 'c8', text: '"I walk the kitchen every morning and eyeball what\'s low."', bucket: 'behavior' },
      { id: 'c9', text: '"I want to open a second location without the chaos doubling."', bucket: 'motivation' },
    ],
    healthbuddy: [
      { id: 'c1', text: '"Last spring Dad missed his BP meds for three days and ended up in the ER."', bucket: 'problem' },
      { id: 'c2', text: '"I call him every night before bed to remind him about his pills."', bucket: 'behavior' },
      { id: 'c3', text: '"I just want to know he\'s okay without having to call three times a day."', bucket: 'motivation' },
      { id: 'c4', text: '"His pill organizer is half-filled and nobody knows who\'s responsible."', bucket: 'problem' },
      { id: 'c5', text: '"I share updates in a family group chat — siblings don\'t always respond."', bucket: 'behavior' },
      { id: 'c6', text: '"I want him to stay independent as long as possible — not in a home."', bucket: 'motivation' },
      { id: 'c7', text: '"I found out about his missed appointment three weeks after the fact."', bucket: 'problem' },
      { id: 'c8', text: '"I set Google Calendar reminders that go to his phone — he ignores them."', bucket: 'behavior' },
      { id: 'c9', text: '"If I could sleep without worrying, that would be everything."', bucket: 'motivation' },
    ],
    devcollab: [
      { id: 'c1', text: '"PRs sit unreviewed for 48 hours because the London team is asleep when SF pushes."', bucket: 'problem' },
      { id: 'c2', text: '"I manually write context summaries in Slack when I ping reviewers."', bucket: 'behavior' },
      { id: 'c3', text: '"I want my team to ship features weekly without bottleneck drama."', bucket: 'motivation' },
      { id: 'c4', text: '"We slipped a sprint release by four days because of one unreviewed PR blocking merge."', bucket: 'problem' },
      { id: 'c5', text: '"We do async standups in Loom — but code review context never flows through."', bucket: 'behavior' },
      { id: 'c6', text: '"I want engineers to feel autonomous, not dependent on me to unblock things."', bucket: 'motivation' },
      { id: 'c7', text: '"Reviewer comments lack context — they weren\'t there when the decision was made."', bucket: 'problem' },
      { id: 'c8', text: '"I assign reviews in rotation, but the queue grows faster than it drains."', bucket: 'behavior' },
      { id: 'c9', text: '"I want to scale the team without adding process overhead that slows everyone down."', bucket: 'motivation' },
    ],
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 3 — Business Model Basics
  // ─────────────────────────────────────────────────────────────────────────────

  // Activity 1 — Lean Canvas
  const leanCanvasBlocks = [
    { id: 'problem', label: 'Problem', hint: 'Top 3 problems your customer faces.' },
    { id: 'customerSegments', label: 'Customer Segments', hint: 'Who are your early adopters? Be specific.' },
    { id: 'uvp', label: 'Unique Value Proposition', hint: 'Single, clear message that states why you are different and worth buying.' },
    { id: 'solution', label: 'Solution', hint: 'Top 3 features of your MVP.' },
    { id: 'channels', label: 'Channels', hint: 'How do you reach your customers? (inbound + outbound)' },
    { id: 'revenueStreams', label: 'Revenue Streams', hint: 'How do you make money? Price point and model.' },
    { id: 'costStructure', label: 'Cost Structure', hint: 'Top fixed + variable costs.' },
    { id: 'keyMetrics', label: 'Key Metrics', hint: 'Key numbers you measure to know if you\'re succeeding.' },
    { id: 'unfairAdvantage', label: 'Unfair Advantage', hint: 'Something that cannot easily be bought or copied.' },
  ];

  const leanCanvasDefaults = {
    foodietrack: {
      problem: 'Restaurant owners lose 15–20% of food revenue to spoilage and over-ordering with no real-time visibility.',
      customerSegments: 'Independent restaurant owners, 10–50 seats, US, currently using spreadsheets or paper.',
      uvp: 'The only inventory tool that predicts waste before it happens — not after.',
      solution: 'Real-time inventory tracking dashboard + AI reorder suggestions + supplier integrations.',
      channels: 'Restaurant association partnerships, Facebook Groups for owners, direct sales via reps.',
      revenueStreams: 'SaaS subscription $99–299/mo; setup fee $500.',
      costStructure: 'Engineering (60%), Sales & Marketing (25%), Infrastructure (10%), Support (5%)',
      keyMetrics: 'MRR, churn rate, food cost reduction %, avg time to first value',
      unfairAdvantage: 'Proprietary waste prediction model trained on $50M+ in restaurant transaction data (via partnership)',
    },
    healthbuddy: {
      problem: 'Adult children cannot confirm medication adherence, missed appointments, or early health decline without daily phone calls.',
      customerSegments: 'Adults 35–55, primary care coordinators for a parent 65+, smartphone users, US.',
      uvp: 'The family health dashboard that turns daily anxiety into quiet confidence.',
      solution: 'Medication tracking with smart reminders + vital logging + appointment sync + family feed.',
      channels: 'Facebook Ads (parenting/caregiver communities), AARP partnerships, App Store ASO, referral loops.',
      revenueStreams: 'Freemium: free for 1 user; $7.99/mo Family Plan (up to 6); $14.99/mo with provider integrations.',
      costStructure: 'Engineering (50%), Marketing (30%), Partnerships & Compliance (15%), Support (5%)',
      keyMetrics: 'DAU/MAU ratio, family invite rate, medication adherence streak rate, churn by cohort',
      unfairAdvantage: 'FDA-cleared wearable integration partnerships secured in pre-launch; HIPAA-compliant data infrastructure from day one.',
    },
    devcollab: {
      problem: 'Async code reviews stall for 24–72 hours due to missing context, time zone gaps, and reviewer context-switching overhead.',
      customerSegments: 'Engineering managers at 15–200-person startups, 2+ time zones, currently using GitHub PRs.',
      uvp: 'AI-powered code review context — so reviewers know everything they need without a meeting.',
      solution: 'Auto-generated PR context summaries + async discussion threads + reviewer assignment intelligence.',
      channels: 'Hacker News, GitHub Marketplace, developer Discord/Slack communities, engineering blog content.',
      revenueStreams: 'Free tier (3 repos); $12/seat/mo Pro; $25/seat/mo Enterprise with SSO + analytics.',
      costStructure: 'Engineering & AI infra (65%), Developer Marketing (20%), Ops & Security (15%)',
      keyMetrics: 'Repos connected, PRs reviewed/week, review cycle time, seat expansion rate',
      unfairAdvantage: 'Core team includes ex-GitHub engineers with deep understanding of code review UX at scale.',
    },
  };

  // Activity 2 — Revenue Model Selector
  const revenueModels = [
    { id: 'saas', label: 'SaaS / Subscription', icon: '🔄', desc: 'Recurring monthly/annual fee', bestFor: 'B2B tools with ongoing value' },
    { id: 'usage', label: 'Usage-Based', icon: '📊', desc: 'Pay per unit consumed', bestFor: 'Infrastructure, APIs, transactional platforms' },
    { id: 'marketplace', label: 'Marketplace', icon: '🏪', desc: 'Commission on transactions', bestFor: 'Two-sided platforms' },
    { id: 'freemium', label: 'Freemium', icon: '🆓', desc: 'Free tier + paid upgrade', bestFor: 'Consumer apps, PLG products' },
    { id: 'advertising', label: 'Advertising', icon: '📢', desc: 'Revenue from ads served to users', bestFor: 'High-volume consumer platforms' },
    { id: 'direct', label: 'Direct Sales / License', icon: '🤝', desc: 'One-time or annual enterprise contracts', bestFor: 'Complex enterprise software' },
  ];

  const correctRevenueModel = {
    foodietrack: 'saas',
    healthbuddy: 'freemium',
    devcollab: 'saas',
  };

  const revenueModelJustifications = {
    foodietrack:
      'SaaS aligns value delivery with recurring revenue. Restaurant owners need ongoing access, and predictable monthly costs fit their budget planning.',
    healthbuddy:
      'Freemium lets families try it free (low barrier) then upgrade for premium features (multi-user family plan, provider integrations). Consumer health apps live or die on virality.',
    devcollab:
      'SaaS per-seat pricing aligns with team growth. Usage-based is viable for API calls but adds friction for dev teams who want predictable tooling costs.',
  };

  // Activity 3 — Unit Economics Calculator
  const unitEconomicsDefaults = {
    foodietrack: { arpu: 149, grossMargin: 72, churnRate: 3.2, cac: 380 },
    healthbuddy: { arpu: 8, grossMargin: 85, churnRate: 4.5, cac: 12 },
    devcollab: { arpu: 83, grossMargin: 78, churnRate: 2.1, cac: 420 },
  };

  const unitEconomicsThresholds = {
    ltvcac: [
      { min: 3, status: 'success', label: 'Strong' },
      { min: 2, status: 'warning', label: 'Marginal' },
      { min: 0, status: 'danger', label: 'Unsustainable' },
    ],
    cacPayback: [
      { max: 12, status: 'success', label: 'Healthy' },
      { max: 18, status: 'warning', label: 'Watch closely' },
      { max: Infinity, status: 'danger', label: 'Too long' },
    ],
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // MODULE 4 — Go-to-Market Strategy
  // ─────────────────────────────────────────────────────────────────────────────

  // Activity 1 — GTM Motion Selector
  const gtmMotions = [
    {
      id: 'plg',
      label: 'Product-Led Growth',
      icon: '🚀',
      desc: 'Product drives acquisition. Free tier, viral loops, upgrade triggers.',
      bestFor: 'SaaS with wide appeal, dev tools, $0–$100/mo',
      examples: ['Slack', 'Figma', 'Notion', 'Dropbox'],
    },
    {
      id: 'slg',
      label: 'Sales-Led Growth',
      icon: '🤝',
      desc: 'Sales team drives acquisition via direct outreach and relationship building.',
      bestFor: 'Enterprise B2B, $50K+ ACV, complex products',
      examples: ['Salesforce', 'Workday', 'ServiceNow'],
    },
    {
      id: 'mlg',
      label: 'Marketing-Led Growth',
      icon: '📣',
      desc: 'Marketing drives demand generation; sales converts inbound.',
      bestFor: 'Mid-market B2B, content-driven categories',
      examples: ['HubSpot', 'Drift', 'Adobe'],
    },
    {
      id: 'clg',
      label: 'Community-Led Growth',
      icon: '🌐',
      desc: 'Community drives word-of-mouth and organic adoption.',
      bestFor: 'Developer tools, open-source, passionate niches',
      examples: ['Twilio', 'dbt', 'MongoDB'],
    },
  ];

  const correctGtmMotion = {
    foodietrack: 'slg',
    healthbuddy: 'plg',
    devcollab: 'clg',
  };

  const gtmMotionExplanations = {
    foodietrack:
      'Restaurant owners need hand-holding and trust-building. A direct sales approach (via restaurant associations and reps) with demos fits their buying behavior. PLG won\'t work — they won\'t self-serve onboard complex inventory integrations.',
    healthbuddy:
      'Low price + emotional urgency + viral family sharing = PLG. A free tier that adds family members creates natural virality. No sales team needed at consumer price points.',
    devcollab:
      "Developers must love it before it reaches their manager's budget. Build a developer community (GitHub, Discord, dev conferences) to create bottom-up pull. Community-led then expands to paid teams.",
  };

  // Activity 2 — Positioning Statement
  const positioningTemplate =
    'For [target customer] who [has this problem], [product name] is a [category] that [key benefit]. Unlike [alternative], we [differentiator].';

  const positioningPlaceholders = {
    foodietrack: {
      targetCustomer: 'independent restaurant owners tired of manual inventory chaos',
      problem: 'lose thousands monthly to spoilage and over-ordering',
      productName: 'FoodieTrack',
      category: 'restaurant operations platform',
      benefit: 'reduces food waste by 20% in the first 30 days',
      alternative: 'spreadsheets and gut instinct',
      differentiator: 'use real-time data and predictive reordering that learns your menu',
    },
    healthbuddy: {
      targetCustomer: 'adult children managing the health of an aging parent from a distance',
      problem: 'live with constant anxiety about missed medications and undetected health changes',
      productName: 'HealthBuddy',
      category: 'family health monitoring app',
      benefit: 'gives you full visibility into your parent\'s health in one quiet dashboard',
      alternative: 'daily phone calls and fragmented group chats',
      differentiator: 'connect the whole family — silently, without burdening your parent',
    },
    devcollab: {
      targetCustomer: 'engineering managers leading distributed teams across time zones',
      problem: 'watch sprints slip because code reviews stall waiting on context nobody wrote down',
      productName: 'DevCollab',
      category: 'async code review platform',
      benefit: 'cuts review cycle time by 60% with AI-generated context summaries',
      alternative: 'Slack pings and manual PR descriptions',
      differentiator: 'surface exactly what a reviewer needs to know — without a meeting',
    },
  };

  // Activity 3 — Channel Matrix
  const channelMatrix = {
    foodietrack: {
      channels: [
        { id: 'assoc', name: 'Restaurant Associations', icon: '🏢', reach: 4, cost: 2, conversion: 4 },
        { id: 'facebook', name: 'Facebook Groups (Restaurant Owners)', icon: '👥', reach: 3, cost: 1, conversion: 3 },
        { id: 'google', name: 'Google Ads (Search)', icon: '🔍', reach: 4, cost: 4, conversion: 3 },
        { id: 'direct', name: 'Direct Sales (Cold Outreach)', icon: '📞', reach: 3, cost: 3, conversion: 5 },
        { id: 'content', name: 'Blog / SEO (Restaurant Tips)', icon: '📝', reach: 3, cost: 1, conversion: 2 },
      ],
      topChannels: ['assoc', 'direct'],
      explanation: 'Restaurant associations offer high conversion at moderate cost — trusted peers sell for you. Direct outreach yields the highest conversion of any channel. Facebook and SEO are good long-term but slow to convert at launch.',
    },
    healthbuddy: {
      channels: [
        { id: 'facebook', name: 'Facebook Ads (Caregiver Communities)', icon: '👥', reach: 5, cost: 3, conversion: 4 },
        { id: 'appstore', name: 'App Store / ASO', icon: '📱', reach: 4, cost: 1, conversion: 3 },
        { id: 'aarp', name: 'AARP Partnership & Newsletter', icon: '🤝', reach: 4, cost: 2, conversion: 4 },
        { id: 'referral', name: 'In-App Family Referral Loop', icon: '🔗', reach: 3, cost: 1, conversion: 5 },
        { id: 'content', name: 'SEO Blog (Caregiver Tips)', icon: '📝', reach: 3, cost: 1, conversion: 2 },
      ],
      topChannels: ['referral', 'facebook'],
      explanation: 'In-app family referrals are the highest-converting channel — every user invites 2–3 family members organically. Facebook Ads in caregiver communities reach an emotionally primed audience at scale. AARP is excellent long-term but slower to activate.',
    },
    devcollab: {
      channels: [
        { id: 'hn', name: 'Hacker News (Show HN / Launch)', icon: '🟠', reach: 4, cost: 1, conversion: 4 },
        { id: 'github', name: 'GitHub Marketplace', icon: '🐙', reach: 4, cost: 1, conversion: 4 },
        { id: 'discord', name: 'Developer Discord / Slack Communities', icon: '💬', reach: 3, cost: 1, conversion: 3 },
        { id: 'content', name: 'Engineering Blog / Dev.to', icon: '📝', reach: 4, cost: 2, conversion: 3 },
        { id: 'conference', name: 'Dev Conferences (KubeCon, QCon)', icon: '🎤', reach: 3, cost: 4, conversion: 3 },
      ],
      topChannels: ['hn', 'github'],
      explanation: 'Hacker News gives organic reach with high developer credibility — essential for authenticity. GitHub Marketplace puts you directly in the developer workflow. Discord communities are great for retention and feedback loops but lower initial reach.',
    },
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SCORING & META
  // ─────────────────────────────────────────────────────────────────────────────
  const scoring = {
    module1: { hypothesisBuilder: 5, interviewFilter: 8, marketSizing: 7, smokeTest: 5 },
    module2: { interviewSim: 10, earlyAdopter: 7, affinityMapping: 8 },
    module3: { leanCanvas: 10, revenueModel: 5, unitEconomics: 10 },
    module4: { gtmMotion: 8, positioning: 7, channelMatrix: 10 },
  };

  const viabilityRatings = [
    {
      min: 90,
      label: 'Ready to Pitch',
      color: 'success',
      icon: '🚀',
      description: 'Exceptional validation. Your startup has the signals investors love.',
    },
    {
      min: 75,
      label: 'Strong Foundation',
      color: 'primary',
      icon: '💪',
      description: 'Solid work. A few refinements and you\'re investor-ready.',
    },
    {
      min: 50,
      label: 'Promising Signals',
      color: 'warning',
      icon: '⚡',
      description: 'Good instincts, but key gaps need addressing before building.',
    },
    {
      min: 0,
      label: 'Back to the Drawing Board',
      color: 'danger',
      icon: '🔄',
      description: 'Early days. Revisit your problem hypothesis and customer research.',
    },
  ];

  const badges = [
    { id: 'module1', label: 'Hypothesis Tested', icon: '🔬', module: 1 },
    { id: 'module2', label: 'Discovery Pro', icon: '🎙️', module: 2 },
    { id: 'module3', label: 'Canvas Master', icon: '🗺️', module: 3 },
    { id: 'module4', label: 'GTM Architect', icon: '📐', module: 4 },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // EXPORT
  // ─────────────────────────────────────────────────────────────────────────────
  window.BizSimData = {
    scenarios,

    module1: {
      hypothesisTemplates,
      interviewQuestions,
      marketSizing,
      smokeTests,
    },

    module2: {
      interviewProfiles,
      interviewRounds,
      earlyAdopterCriteria,
      earlyAdopterProfiles,
      affinityBuckets,
      affinityCards,
    },

    module3: {
      leanCanvasBlocks,
      leanCanvasDefaults,
      revenueModels,
      correctRevenueModel,
      revenueModelJustifications,
      unitEconomicsDefaults,
      unitEconomicsThresholds,
    },

    module4: {
      gtmMotions,
      correctGtmMotion,
      gtmMotionExplanations,
      positioningTemplate,
      positioningPlaceholders,
      channelMatrix,
    },

    scoring,
    viabilityRatings,
    badges,
  };
})();
