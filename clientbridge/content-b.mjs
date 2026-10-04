// Authored contextual choices; partial credit is not proficiency certification.
export const variantsB = {
  "meeting": {
    "beginner": {
      "context": "You and Casey work in different time zones. A 30-minute call will choose the first report to build. Casey can meet Tuesday at 14:00 UTC. Only one report can be built this week.",
      "objective": "Confirm a precise meeting time, prepare one decision and record who will act.",
      "emailSummary": "The Tuesday call will choose one report for this week.",
      "emailNext": "Please confirm Tuesday at 14:00 UTC and send your first report priority. We will record the choice, owner and date.",
      "steps": [
        {
          "message": "Tuesday at 14:00 UTC suits me. Shall I send an invitation for half an hour?",
          "tip": "Check whether both people can interpret the invitation without guessing.",
          "phrase": "That works for me.",
          "meaning": "Confirm that the proposed arrangement is suitable.",
          "choices": [
            {
              "text": "Yes, Tuesday at 14:00 UTC for 30 minutes works. Please send the invitation.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You confirm the exact time, time zone and agreed duration. The invitation can now be sent without a new scheduling question."
            },
            {
              "text": "Yes, Tuesday afternoon works. Send the invitation and I will move it to 14:00 in my own local time zone.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Your response is friendly, but you change 14:00 UTC to 14:00 local time, which is not necessarily the same slot. Accept the proposed UTC invitation without moving it."
            },
            {
              "text": "Yes, let us book an hour on Tuesday at 14:00 UTC so we have room for any other subjects that come up.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "You retain the correct time but double the agreed duration without checking availability. Confirm the half-hour slot before proposing a longer meeting."
            }
          ]
        },
        {
          "message": "What should I bring? I have several reports I would like this week.",
          "tip": "Prepare the decision the meeting can actually make.",
          "phrase": "Your first priority",
          "meaning": "The item that matters most when not everything can be done.",
          "choices": [
            {
              "text": "Please send all your report requirements and example files before the call so we can discuss the whole reporting plan in detail.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "The preparation may be useful later, but it expands a short prioritisation meeting into a full discovery exercise. Request the priority and reason first."
            },
            {
              "text": "Please bring your complete report list. We can work through it together.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A list is useful, but you leave the one-report limit unstated and risk spending the call cataloguing requests. Ask Casey to identify the first priority."
            },
            {
              "text": "Please bring your first report priority and why you need it. We can choose one report for this week.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You ask for a focused input and name the one-report limit. Casey can prepare the decision needed for this week."
            }
          ]
        },
        {
          "message": "We chose the sales report. You will send a draft by Friday. Should I tell the team?",
          "tip": "Make the same decision visible to the people who will use it.",
          "phrase": "Please flag any corrections.",
          "meaning": "Invite someone to point out an inaccurate summary.",
          "choices": [
            {
              "text": "Yes, please tell them the sales report is our priority. I have made a note.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Your note retains the topic but does not give the team the owner or date. Send a shared summary rather than relying on two separate recollections."
            },
            {
              "text": "Yes. I will send a summary confirming the sales report, my Friday draft and your review after delivery. Please flag any corrections before you forward it to the team.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You record the selected report, ownership and timing, then invite correction before the message spreads. The summary creates a shared record of the call."
            },
            {
              "text": "Please wait until Friday; the draft will show the team what we decided, so a separate summary may not be necessary.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "Waiting leaves colleagues without a current plan and uses a draft as a substitute for a decision record. Confirm the agreement now, even though delivery is later."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "A 30-minute scope call involves Casey, the sponsor and a technical lead. The sponsor can attend only the first ten minutes. The lead needs a decision on the report format before estimating; the agenda currently starts with a twenty-minute status update.",
      "objective": "Order the meeting around dependencies and distinguish decisions from assumptions.",
      "emailSummary": "The report-format decision needs sponsor input before the technical estimate.",
      "emailNext": "Please review the options before the call. We will take the sponsor decision first and record conditional estimates separately.",
      "steps": [
        {
          "message": "The sponsor has ten minutes. Should we keep the usual agenda so everyone hears the background first?",
          "tip": "Which item needs a person who will soon leave?",
          "phrase": "Take the decision first.",
          "meaning": "Discuss a time-critical choice before routine updates.",
          "choices": [
            {
              "text": "Let us keep the agenda but ask the sponsor to confirm our preferred format later by email, using a summary of the discussion as the basis.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "An email decision could work eventually, but you postpone the dependency and may leave the lead estimating an unapproved format. Reorder the call first."
            },
            {
              "text": "Let us shorten the status update to ten minutes so the sponsor gets the background before we discuss the report format with the technical lead.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Ten minutes consumes all the sponsor availability. Background matters, but sending it beforehand leaves time for the decision only the sponsor can help make."
            },
            {
              "text": "Let us put the format decision first and circulate the status update beforehand.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You match the agenda to the sponsor availability and move information sharing out of the scarce live slot. The lead can estimate after an actual decision."
            }
          ]
        },
        {
          "message": "The lead says option B takes three days if the data export is available. Casey wants to record three days as the delivery promise.",
          "tip": "Keep the condition attached to the estimate.",
          "phrase": "Subject to confirmation",
          "meaning": "Dependent on a fact that has not yet been verified.",
          "choices": [
            {
              "text": "Record three days as the current estimate and add a contingency day.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A contingency can be reasonable, but adding time does not establish that the required export exists. Record and verify the dependency explicitly."
            },
            {
              "text": "Record three days subject to confirming the export. Let us assign that check before agreeing a delivery date.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You preserve the lead’s condition and assign the evidence needed before a commitment. An estimate with a dependency is different from a confirmed delivery date."
            },
            {
              "text": "Record a four-day delivery date so there is a buffer for the export issue, then ask the lead to validate the assumption after the meeting.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "A buffer does not solve a potentially unavailable input, and a delivery date would still be premature. Confirm export availability before committing."
            }
          ]
        },
        {
          "message": "We agreed B, but the export check is still open. Can the notes simply say that the format and schedule were approved?",
          "tip": "Separate the closed decision from the open dependency.",
          "phrase": "Decision and open action",
          "meaning": "A confirmed choice recorded separately from work still required.",
          "choices": [
            {
              "text": "I will record B as approved, the schedule as conditional, and the lead as owner of the export check by tomorrow. We can confirm the delivery date once that result is available.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You distinguish approval of a format from approval of a schedule and make the unresolved check accountable. Tomorrow’s result becomes a clear confirmation point."
            },
            {
              "text": "I will record B as approved and ask everyone to review the meeting notes.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Reviewing notes is useful but does not clearly retain the schedule condition or assign its resolution. List the open action with an owner and date."
            },
            {
              "text": "I will record the proposed schedule with a note that technical details remain open, and circulate it for comment before sending the client a final version.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "The caveat is too broad and the client could still read the proposed schedule as an agreement. Name the export dependency and its owner explicitly."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "In a steering call, the sponsor has publicly supported a launch date. The technical lead has evidence that one report format may miss it. The sponsor leaves after ten minutes; another director will join only later. No date change has been approved.",
      "objective": "Surface dissent constructively, avoid manufactured agreement and protect decision authority.",
      "emailSummary": "Launch confidence depends on the report-format choice and verified technical assumptions.",
      "emailNext": "We will present the format trade-off early, seek an explicit decision and distinguish the later director’s comments from approval.",
      "steps": [
        {
          "message": "The sponsor says, “I assume we are all comfortable with the date.” The lead is silent. You know their estimate for format B exceeds the remaining time.",
          "tip": "Make relevant evidence discussable without assigning motives to silence.",
          "phrase": "Before we close that point…",
          "meaning": "Reopen a decision briefly to check a material concern.",
          "choices": [
            {
              "text": "We are comfortable with the date in principle; the lead can refine the estimate afterwards.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "In-principle agreement blurs the known incompatibility and defers it beyond the sponsor’s decision window. Surface the estimate before recording comfort."
            },
            {
              "text": "Before we close that point, could we test the date against the lead’s estimate for B? There may be a format choice that protects the launch, and I would like us to make that trade-off explicit.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You respectfully reopen the assumption with evidence and a possible route to the sponsor’s goal. Silence is not used as consent, and you avoid publicly attributing an unspoken objection."
            },
            {
              "text": "The lead has not objected, so I suggest we record the date and note that the detailed delivery plan is still being developed.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "You treat silence as approval despite contrary evidence. A generic caveat about planning does not preserve the specific format/date trade-off."
            }
          ]
        },
        {
          "message": "The sponsor asks, “Could we discuss the awkward details offline?” The format decision still needs their approval today to enable estimation.",
          "tip": "Keep the decision visible while offering discretion over detail.",
          "phrase": "Keep the decision here.",
          "meaning": "Retain the agreed choice in the shared forum.",
          "choices": [
            {
              "text": "We can take the detail offline; could we agree the format trade-off here first?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You accommodate the wish for discretion without removing the decision that the group needs now. Detailed evidence can move offline while approval stays explicit."
            },
            {
              "text": "Certainly. I will arrange a separate discussion and circulate a proposed format afterwards for your review, so the main call can continue with the launch plan.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A later review may be tactful, but it misses today’s dependency and leaves estimation waiting. Seek a narrow decision in the current call first."
            },
            {
              "text": "Certainly. We will use the current format for planning and bring you the detailed risks privately, where there is more time to explore the options.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "You silently make the format the planning default despite its known effect on the launch. Keep authority with the sponsor and ask for the trade-off decision."
            }
          ]
        },
        {
          "message": "The late-arriving director says, “I can live with that, provided Operations can support it.” Operations has not been consulted.",
          "tip": "A conditional expression of acceptance is not unconditional approval.",
          "phrase": "Conditional agreement",
          "meaning": "Acceptance that applies only if a stated requirement is met.",
          "choices": [
            {
              "text": "I will circulate the decision as approved and include a note inviting Operations to raise any concerns before implementation begins.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "An invitation to object turns an explicit support requirement into presumed consent. Seek confirmation rather than publishing unconditional approval."
            },
            {
              "text": "I will record agreement, with an Operations action attached.",
              "score": [
                2,
                3,
                2
              ],
              "feedback": "An attached action helps, but the main label “agreement” hides the condition. Describe the acceptance as conditional until support is confirmed."
            },
            {
              "text": "I will record your conditional agreement and ask Operations to confirm support before we treat the decision as final.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You preserve the meaning of “provided” and check the outstanding condition before treating approval as final. Operations is asked for evidence, not presumed consent."
            }
          ]
        }
      ]
    }
  },
  "handover": {
    "beginner": {
      "context": "Jordan will run a reporting tool after handover. The user guide and a 20-minute walkthrough are included. Acceptance requires checking the sales total, staff permissions and CSV export. Ongoing support is not yet agreed.",
      "objective": "Help the client prepare, check delivery and understand support limits.",
      "emailSummary": "The handover includes a guide, walkthrough and three acceptance checks.",
      "emailNext": "Please try the agreed checks before acceptance. We will confirm support terms separately.",
      "steps": [
        {
          "message": "I have the files, but I do not know where to start. What should I do first?",
          "tip": "Offer a concrete starting point using the included help.",
          "phrase": "Walk you through it",
          "meaning": "Show someone the main steps of using something.",
          "choices": [
            {
              "text": "The guide covers this already. Read it first, then send any questions you still have about opening reports.",
              "score": [
                2,
                1,
                2
              ],
              "feedback": "The guide is relevant, but “already” can dismiss a reasonable handover question, and the answer gives no clear starting task. Point to the first example and offer the included walkthrough."
            },
            {
              "text": "Start with the guide’s first report example. We can use the included walkthrough to practise it and answer questions.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You identify an achievable first task and use support already included in handover. The client can begin without discovering the system alone."
            },
            {
              "text": "Please read the whole guide first and send all your questions together; we can then decide whether a walkthrough would be useful for your team.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "Reading helps, but you make the included walkthrough seem conditional and create unnecessary preparation. Offer the first example and scheduled help directly."
            }
          ]
        },
        {
          "message": "The dashboard looks good. Is that enough to accept the tool?",
          "tip": "Check the functions that were actually agreed.",
          "phrase": "Acceptance checks",
          "meaning": "Agreed observations used to confirm a delivery meets requirements.",
          "choices": [
            {
              "text": "Please check the sales total, staff permissions and CSV export against the checklist before acceptance. Let us know if any agreed result fails.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You name the agreed checks and explain how to report failure. Appearance alone does not establish accurate reports or access control."
            },
            {
              "text": "Please accept it if the dashboard matches your expectations.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "You invite a subjective decision and omit the required functional checks. Ask the client to use the checklist first."
            },
            {
              "text": "Please ask several colleagues to explore the dashboard and confirm that they like the layout before you make an acceptance decision.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "Colleague opinions may improve usability, but they do not replace the specified output, permission and export checks. Tie acceptance to the agreement."
            }
          ]
        },
        {
          "message": "If I need help next month, can I contact you whenever I like?",
          "tip": "Separate a contact route from a promise of ongoing service.",
          "phrase": "Confirm the support terms.",
          "meaning": "Agree what help is included and how it will be provided.",
          "choices": [
            {
              "text": "Yes, we can use the handover email thread for future questions and work out the details if your team needs assistance next month.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "A thread provides a route, but postponing the terms can leave Operations depending on undefined help. Agree the service before it is needed."
            },
            {
              "text": "Yes, email me and I will try to help when I am available.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "The response is friendly, but informal availability gives the team no usable support expectation. Confirm scope and response terms explicitly."
            },
            {
              "text": "Yes. We should agree ongoing support terms first.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You remain approachable while clearly requiring an agreement on future service. A contact channel is not an unlimited response commitment."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "Jordan’s team must own a reporting tool on Monday. The walkthrough is Friday. Most acceptance checks pass, but the CSV export drops leading zeros in account codes. The agreed specification requires those zeros. Ongoing support terms are still under review.",
      "objective": "Transfer operational readiness without obscuring a failed criterion or undefined support.",
      "emailSummary": "Operational handover can proceed while the failed CSV criterion remains explicitly open.",
      "emailNext": "We will document the CSV defect, owner and retest date, and confirm support coverage before Monday.",
      "steps": [
        {
          "message": "The walkthrough is booked. Can we mark the team ready for Monday now?",
          "tip": "Attendance alone does not demonstrate that people can operate the tool.",
          "phrase": "Demonstrate the workflow",
          "meaning": "Show the ability to complete the task in practice.",
          "choices": [
            {
              "text": "Let us use Friday’s walkthrough for the team to run and export a report themselves, then record readiness and any gaps.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You verify the practical workflow rather than assuming readiness from attendance. Gaps can be identified while there is still time to plan Monday."
            },
            {
              "text": "Yes, the guide and walkthrough should give the team the information they need.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "The materials are helpful, but you treat preparation as proof of capability. Include a client-run task before recording readiness."
            },
            {
              "text": "Let us send a recording after the walkthrough so absent colleagues can catch up, then mark readiness when everyone confirms they have watched it.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A recording broadens access but watching is still not evidence of successful operation. Ask the team to demonstrate the core workflow."
            }
          ]
        },
        {
          "message": "The export loses zeros, but we can fix the codes in a spreadsheet. Could we accept everything to keep the paperwork simple?",
          "tip": "A workaround may support use without satisfying the agreed criterion.",
          "phrase": "Keep the criterion open.",
          "meaning": "Record that an agreed requirement has not yet been met.",
          "choices": [
            {
              "text": "We can treat the export as usable because there is a practical workaround, then log the leading-zero issue as a follow-up improvement outside acceptance.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "The zeros are an agreed requirement, not an optional improvement. A workaround does not justify moving the defect outside acceptance."
            },
            {
              "text": "We can record acceptance with a note that the team will correct codes manually when exporting, and prioritise a fix during the next available support slot.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "The manual correction may enable work, but acceptance would hide a known failure and depend on support terms not yet agreed. Record the open criterion and fix plan."
            },
            {
              "text": "We can document the workaround for temporary use, but the CSV criterion remains open because account codes must retain their zeros. Let us agree a fix owner and retest date, and close that criterion only after the agreed export check passes.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You distinguish temporary usability from compliance with the specification. The failed requirement remains visible and closure depends on evidence."
            }
          ]
        },
        {
          "message": "Monday is close. Can we rely on your team if the workaround fails? No support agreement has been signed yet.",
          "tip": "Avoid either an invented safety net or a silent operational gap.",
          "phrase": "Confirm interim coverage",
          "meaning": "Agree limited help for a defined transition period.",
          "choices": [
            {
              "text": "We will keep an eye on the handover thread on Monday.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Monitoring a thread is reassuring but undefined: it gives no owner, availability or route if the workaround fails. Agree explicit interim terms."
            },
            {
              "text": "Let us agree interim coverage before Monday.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You propose a bounded transition arrangement and make confirmation necessary. The team can plan with known coverage instead of an implied promise."
            },
            {
              "text": "Please use the workaround on Monday and contact the project team if necessary; we can resolve support terms after the longer-term agreement is ready.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "You defer a near-term risk into an unsigned future agreement. Resolve the operational support gap before Monday, with a clear scope."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "Jordan’s director wants a public “handover complete” announcement today. Two agreed checks remain open. Operations can run the main workflow with a documented workaround, but has not agreed to own its maintenance. You cannot waive acceptance criteria or assign Operations new duties.",
      "objective": "Protect accurate status and accountable ownership while helping stakeholders communicate progress.",
      "emailSummary": "The team can describe operational progress without claiming full acceptance or unagreed ownership.",
      "emailNext": "We will agree precise announcement wording and confirm remaining criteria and maintenance ownership explicitly.",
      "steps": [
        {
          "message": "Jordan says, “Could we call it complete for the announcement and tidy up the checks afterwards? It would help the director.”",
          "tip": "Offer a truthful way to recognise progress without waiving requirements.",
          "phrase": "Ready for use, with conditions",
          "meaning": "Usable within stated limits without claiming every requirement is complete.",
          "choices": [
            {
              "text": "We can describe it as complete from the project perspective and explain the remaining operational details if anyone asks about acceptance.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "Changing perspective does not change the unmet criteria. Calling them operational details obscures their contractual status; name the outstanding checks."
            },
            {
              "text": "We can announce handover and keep the outstanding checks in the internal action log.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "An internal log preserves detail but the public headline still suggests unconditional completion. Keep the qualification in the actual announcement."
            },
            {
              "text": "Could we announce “ready for use, two checks open”, with a closure plan?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You help the director communicate progress using an accurate qualified status. The closure plan supplies reassurance without falsely implying acceptance."
            }
          ]
        },
        {
          "message": "Operations says, “We can make the workaround work, though keeping it going is another matter.” Jordan wants to list them as maintenance owner.",
          "tip": "Read the distinction between temporary cooperation and ongoing commitment.",
          "phrase": "Confirm ownership explicitly.",
          "meaning": "Ask the responsible party to agree to a duty directly.",
          "choices": [
            {
              "text": "They have offered a workable route, so we can list Operations and ask them to flag any concerns about longer-term upkeep when they review the handover notes.",
              "score": [
                1,
                2,
                0
              ],
              "feedback": "You interpret a qualified offer as consent and require Operations to object later. Ask about maintenance directly rather than putting the burden on review."
            },
            {
              "text": "Their offer covers temporary use, not ongoing maintenance. Could we check who will own that work before assigning it to Operations in the handover?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You preserve the limit Operations expressed and seek agreement before assigning a duty. Temporary cooperation is not a maintenance commitment."
            },
            {
              "text": "We can list Operations as provisional owner and leave the maintenance details open until the team has gained experience with the workaround.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "“Provisional” still assigns a duty they explicitly distinguished from use. Clarify ownership before recording it, including resources or duration if needed."
            }
          ]
        },
        {
          "message": "The director says, “I do not want a document that makes the team sound unprepared.” The two checks and ownership gap still need a record.",
          "tip": "Describe the work neutrally without removing facts people need.",
          "phrase": "A transition plan",
          "meaning": "A clear record of remaining work during transfer of responsibility.",
          "choices": [
            {
              "text": "We can frame it as a transition plan: completed checks, two remaining checks and the ownership decision. That keeps the wording constructive while preserving the facts needed for a safe handover.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You address the reputational concern through neutral framing while keeping the actual gaps visible. Tone changes without changing the status or importance of the work."
            },
            {
              "text": "We can keep the detailed risks in our notes and send the director a shorter positive summary.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "A positive summary can be useful, but excluding the unresolved criteria and ownership would distort readiness for the decision maker. Retain a concise factual qualification."
            },
            {
              "text": "We can describe the team as ready, with minor follow-up actions, and share the detailed list separately with the people doing the work.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "“Minor” is not justified by the context and “ready” may imply agreed ownership. Use a transition plan that names the outstanding decisions."
            }
          ]
        }
      ]
    }
  },
  "incident": {
    "beginner": {
      "context": "Users cannot sign in. Engineers are investigating; the cause and restoration time are unknown. The service owner needs a short update now and another in 30 minutes. No evidence currently supports a claim about lost data.",
      "objective": "State known impact, avoid guesses and keep a reliable update promise.",
      "emailSummary": "Sign-in is unavailable and investigation is underway; the cause is not confirmed.",
      "emailNext": "We will update you in 30 minutes, including remaining uncertainty, even if there is no confirmed restoration time.",
      "steps": [
        {
          "message": "Is the service down because of an attack? Our users are asking.",
          "tip": "Separate the observed problem from a possible explanation.",
          "phrase": "The cause is not confirmed.",
          "meaning": "Investigation has not established why something happened.",
          "choices": [
            {
              "text": "We have not confirmed an attack, so it is likely a normal technical fault. You can tell users we are checking that possibility.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "No confirmed attack does not make a routine fault likely. Do not convert absence of one finding into confidence about another cause."
            },
            {
              "text": "It might be an attack; we will investigate and update you.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Mentioning a possible attack is not inherently false, but this answer encourages a specific speculative story without evidence. Keep the message focused on confirmed impact."
            },
            {
              "text": "Sign-in is unavailable, but the cause is not confirmed. Engineers are investigating. Please tell users about the sign-in problem rather than describing it as an attack; we will share verified findings when available.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You name the verified impact and prevent an unverified cause becoming a user-facing fact. Investigation is a commitment, not proof of a particular explanation."
            }
          ]
        },
        {
          "message": "When should I expect your next update?",
          "tip": "An update time can be reliable even when a restoration time is unknown.",
          "phrase": "In 30 minutes",
          "meaning": "A specific interval before the next communication.",
          "choices": [
            {
              "text": "When the engineers have confirmed the cause, I will send a detailed update with the explanation and the proposed recovery steps.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A cause-based update may take much longer than 30 minutes and leaves the owner waiting. Keep the promised cadence even before a diagnosis."
            },
            {
              "text": "In 30 minutes, even if investigation is still ongoing.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You give the agreed checkpoint without pretending to know when the investigation will finish. The owner can plan their own communications."
            },
            {
              "text": "I will send an update as soon as there is meaningful progress so you receive useful information rather than messages with no new findings.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Useful findings matter, but silence is not a substitute for the agreed update. Send a brief status and remaining uncertainty at the checkpoint."
            }
          ]
        },
        {
          "message": "No restoration time yet. Can I tell everyone it should be working soon?",
          "tip": "Do not make an estimate sound verified when it is not.",
          "phrase": "No confirmed estimate yet.",
          "meaning": "There is not yet a reliable time to communicate.",
          "choices": [
            {
              "text": "There is no confirmed restoration time. Please say investigation continues; we will share any verified estimate in our next update.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You avoid an unsupported time expectation and give the owner usable wording. A later verified estimate can be communicated when evidence supports it."
            },
            {
              "text": "You can say we hope to restore it soon, without giving an exact time.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Hope is different from a guarantee, but “soon” still gives users a time expectation without evidence. Explain that timing is not confirmed."
            },
            {
              "text": "You can say the team is aiming to restore sign-in soon and will confirm timing later, so users know resolution remains our priority.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Priority is worth communicating, but “aiming to restore soon” remains an unsupported timing signal. State the work underway and lack of a verified estimate."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "After a deployment, 40% of sign-in attempts fail. A rollback takes ten minutes and may restore service but will remove today’s new report feature. The incident lead must approve rollback. The cause is not yet confirmed; updates are due every 30 minutes.",
      "objective": "Communicate measured impact and support a recovery decision without overclaiming causation.",
      "emailSummary": "Sign-in failures affect 40% of attempts after deployment; rollback is an unapproved recovery option with a feature trade-off.",
      "emailNext": "We will seek the incident lead’s rollback decision and verify recovery using sign-in results before reporting restoration.",
      "steps": [
        {
          "message": "Failures started after deployment. Can we say the new feature caused the incident?",
          "tip": "Timing supports investigation, not necessarily a verified causal claim.",
          "phrase": "Consistent with",
          "meaning": "Compatible with a possibility without proving it.",
          "choices": [
            {
              "text": "The deployment is the most obvious explanation, so we can call it the likely cause.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "The timing makes the hypothesis relevant, but the context supplies no basis for a likelihood claim. Describe it as a lead under investigation."
            },
            {
              "text": "The timing makes the deployment a useful lead, but not a confirmed cause. We can report 40% failed sign-ins and the deployment sequence while the engineers test the connection.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You retain the useful temporal evidence while clearly separating it from causation. Stakeholders receive measured impact rather than a guessed diagnosis."
            },
            {
              "text": "We can avoid naming a cause in the main update and put “deployment issue” in the incident title as a practical label while investigation continues.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "An incident title is still a factual signal to readers. Calling it a deployment issue can embed the unverified cause even if the body is cautious."
            }
          ]
        },
        {
          "message": "The owner asks you to roll back now. The incident lead has not approved it; the report feature would disappear.",
          "tip": "Who can approve the recovery trade-off?",
          "phrase": "Seek rollback approval.",
          "meaning": "Obtain the required decision before reversing a deployment.",
          "choices": [
            {
              "text": "I will seek the incident lead’s decision, including the ten-minute rollback and report-feature trade-off.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You route a time-sensitive recovery choice to the authorised lead with its known consequence. You neither bypass authority nor wait needlessly for a communication cycle."
            },
            {
              "text": "I will start the rollback now and notify the incident lead, since restoration is the priority and the report can be redeployed after service stabilises.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "Restoration matters, but you bypass the required approval and assume redeployment arrangements not given. Escalate promptly with the trade-off instead."
            },
            {
              "text": "I will wait for the next scheduled update to collect everyone’s views on losing the report feature, then ask the incident lead to choose a recovery option.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Consultation can help, but waiting for a scheduled update adds avoidable delay to an urgent approval. Seek the lead’s decision now."
            }
          ]
        },
        {
          "message": "Rollback is approved and completes. A monitoring graph looks normal for two minutes. Shall we announce full restoration?",
          "tip": "Use evidence that tests the affected user action.",
          "phrase": "Verify recovery",
          "meaning": "Check that the failed service works again before declaring it restored.",
          "choices": [
            {
              "text": "We can announce restoration with a note that monitoring continues, then investigate any failed sign-ins reported by users after the announcement.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "Ongoing monitoring is valuable, but it does not justify a restoration claim before functional checks. Report the rollback and pending verification separately."
            },
            {
              "text": "Yes, the rollback completed and the graph is normal, so full restoration is a fair summary.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "The graph is encouraging but two minutes and an unspecified metric do not establish successful sign-in. Verify the user-facing function first."
            },
            {
              "text": "Let us check sign-ins and error rates first. Until then, report rollback complete and recovery being verified.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You distinguish completion of a recovery action from verified recovery of the affected function. The interim update reports progress accurately."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "An outage has affected a shared client platform. Sign-in is restored, but delayed transactions are still being reconciled. The cause remains under investigation. The client wants a board statement today. Your team can commit to a review date and verified facts, not to guarantees about recurrence or complete reconciliation.",
      "objective": "Calibrate reassurance and accountability without making uncertain claims sound settled.",
      "emailSummary": "Sign-in is restored while transaction reconciliation and cause analysis remain open.",
      "emailNext": "The board statement will distinguish service restoration from reconciliation and give a dated review commitment with accountable owners.",
      "steps": [
        {
          "message": "The client says, “For the board, can we say the incident is behind us?” Delayed transactions are not fully reconciled.",
          "tip": "Separate a restored function from an incident’s remaining effects.",
          "phrase": "Restored, with follow-up underway",
          "meaning": "A service is available but related work remains unfinished.",
          "choices": [
            {
              "text": "We can say sign-in is restored and reassure the board on that point, while making clear that transaction reconciliation is still underway.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You offer board-ready reassurance with the outstanding impact in the same sentence. Availability does not imply every consequence has been resolved."
            },
            {
              "text": "We can call the incident resolved operationally, with transaction reconciliation explained separately in the follow-up report.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "“Resolved operationally” can conceal unreconciled transactions that may matter to the board. Include the open impact in the primary status."
            },
            {
              "text": "We can say the immediate issue is behind us and add that the team is checking transactions as a routine precaution following the restoration.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "Reconciliation is required work, not merely a precaution. The phrasing reduces a known outstanding issue to a routine check; name it accurately."
            }
          ]
        },
        {
          "message": "The client asks, “Can you reassure us this will not happen again?” You have not yet established the cause.",
          "tip": "Offer an accountable process instead of an absolute assurance.",
          "phrase": "Reduce recurrence risk",
          "meaning": "Lower the chance or impact of another similar incident.",
          "choices": [
            {
              "text": "We can reassure the board that the team has learned from the incident and will review the platform thoroughly to prevent the same failure happening again.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "Learning and review are useful intentions, but “prevent” implies confidence unsupported by an unknown cause. Frame the goal as reducing risk with verified actions."
            },
            {
              "text": "We will put stronger checks in place and make preventing a recurrence our highest priority.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A priority is meaningful, but unspecified stronger checks do not show how the unknown cause will be addressed. Commit to a review, ownership and tracked actions."
            },
            {
              "text": "We cannot promise there will be no recurrence, particularly before the cause is established. What we can commit to is a review on the agreed date, verified findings, named action owners and tracked completion, so the board can see what reduces the risk.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You clearly limit the assurance and replace it with evidence-based, trackable accountability. No preventive measure is claimed before the cause is known."
            }
          ]
        },
        {
          "message": "The client proposes wording: “A supplier fault caused the outage.” A supplier component is one hypothesis, not a verified finding.",
          "tip": "Protect accuracy without sounding defensive about responsibility.",
          "phrase": "Not yet a finding",
          "meaning": "A possible explanation that investigation has not established.",
          "choices": [
            {
              "text": "We would prefer not to name the supplier until they have reviewed the statement.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "Supplier review may be appropriate, but permission does not establish truth. Explain the evidence gap and keep coordination responsibility clear."
            },
            {
              "text": "Use “cause under investigation”; we remain accountable for the review.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You correct the proposed causal claim, provide usable replacement wording and retain your own accountability for the review. You do not simply shift the wording problem to the supplier."
            },
            {
              "text": "We can say a supplier component appears to be involved, while noting that the final report will confirm the technical details and any preventive actions.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "“Appears to be involved” upgrades a hypothesis to an evidential claim not supported here. State that the cause remains under investigation."
            }
          ]
        }
      ]
    }
  },
  "feedback": {
    "beginner": {
      "context": "Quinn finds a prototype hard to read. The main audience is first-time customers. You can revise one screen first, then review before changing all screens. Quinn has not yet identified which text or layout causes the difficulty.",
      "objective": "Ask for a useful example, propose a focused revision and check it before rollout.",
      "emailSummary": "We will clarify the reading difficulty and revise one screen for first-time customers.",
      "emailNext": "Please identify a difficult section. We will compare a focused revision before applying it to all screens.",
      "steps": [
        {
          "message": "It is hard to read. Can you improve it?",
          "tip": "Ask for observable evidence of a broad reaction.",
          "phrase": "Which section?",
          "meaning": "Ask someone to identify the specific part causing a problem.",
          "choices": [
            {
              "text": "Which section is hardest to read, and what do you expect customers to find there?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You identify both the location and the reading task before choosing a solution. Difficulty might involve organisation as well as text size."
            },
            {
              "text": "We can use larger text throughout the prototype; that should make it easier for first-time customers to read the information.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "Larger text may help, but the cause is not yet known and changing everything skips clarification. Ask which section and what customers need to find."
            },
            {
              "text": "We can show you several new font styles and let you select the one that feels most readable before we update the prototype.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Font comparison offers a concrete action but assumes typography is the cause. First ask for the difficult section and customer task."
            }
          ]
        },
        {
          "message": "The price and order button look equally important. I want customers to notice the price first.",
          "tip": "Translate the stated priority into a focused change.",
          "phrase": "Make it more prominent.",
          "meaning": "Give an element greater visual importance.",
          "choices": [
            {
              "text": "We can reduce the order button and several other elements across the prototype so the price becomes the clearest point on every screen for all customers.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "Reducing competing elements may help, but a broad reduction can make ordering harder and removes the checkpoint. Start with one balanced revision."
            },
            {
              "text": "We can make the price larger on every screen.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "You identify a relevant change, but skip the agreed one-screen review. Test the revision before broad rollout."
            },
            {
              "text": "We can make the price more prominent on one screen and keep the order button clear. Let us review that change first.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You follow the stated priority while protecting the button’s usability and limiting the first change to a reviewable screen."
            }
          ]
        },
        {
          "message": "The revised screen seems better, but I have only checked the price. Can you apply it everywhere?",
          "tip": "Turn a positive impression into a clear approval of the actual revision.",
          "phrase": "Confirm this direction.",
          "meaning": "Agree which specific approach should be used for the next work.",
          "choices": [
            {
              "text": "Yes, I will apply it to the remaining screens now.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "You follow the rollout request, but ignore that the client has only checked the price. Verify that ordering is still clear before spreading a potentially incomplete revision."
            },
            {
              "text": "Please confirm that this version gives the price priority while keeping ordering clear. Once you approve that direction, we will apply it consistently and check each screen for any layout problems.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You check the unverified ordering task before broad rollout and retain screen-level layout checks. The client asks for rollout, but has explicitly only reviewed the price."
            },
            {
              "text": "I will use this as the general style and adjust the other screens as I go, so we can keep moving without another review.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A general style leaves scope for unreviewed changes across screens. Confirm the exact priorities and then check how the approved approach works elsewhere."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "Quinn wants a “premium” pricing page. User tests show visitors miss the subscription total. A restrained visual style and clearer totals may help, but a decorative animation would consume the entire two-day revision budget. The existing order flow must stay usable.",
      "objective": "Translate taste into customer outcomes and compare changes within a real budget.",
      "emailSummary": "The revision will test a restrained style and clearer subscription totals within two days.",
      "emailNext": "We will prioritise the missed total, compare a focused screen and check that ordering remains usable before rollout.",
      "steps": [
        {
          "message": "Could we add a big animation? It would feel more premium.",
          "tip": "Balance the style request against the evidenced customer problem and budget.",
          "phrase": "Within the revision budget",
          "meaning": "Using only the time or resources agreed for the change.",
          "choices": [
            {
              "text": "We can produce a simpler animation in two days and use the review to see whether the page feels premium enough before considering further changes.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "A simpler animation is still not shown to address the missed total and no smaller estimate is provided. Compare changes tied to the user evidence."
            },
            {
              "text": "We can add the animation and revisit the subscription total after launch.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "You satisfy the style request but postpone an evidenced pricing problem without an agreed priority decision. Make that trade-off explicit before using the budget."
            },
            {
              "text": "An animation uses both days. Could we prioritise the missed total and test a restrained premium style?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You recognise the intended style while exposing the budget trade-off and prioritising the observed reading failure. The suggestion remains testable."
            }
          ]
        },
        {
          "message": "Quinn sends two references: one uses muted colours; the other hides prices behind a click. Which parts should we borrow?",
          "tip": "Reference style does not automatically justify reference behaviour.",
          "phrase": "Borrow the visual direction.",
          "meaning": "Use relevant style features without copying every interaction.",
          "choices": [
            {
              "text": "The muted palette is useful; hiding prices repeats a mistake we already know about. We should not spend our revision budget copying that feature.",
              "score": [
                3,
                1,
                2
              ],
              "feedback": "You identify the visibility risk and offer a clear recommendation, but “repeats a mistake” can blame the person supplying references. Explain the user-task consequence neutrally and keep the relevant palette."
            },
            {
              "text": "We can borrow the muted palette as a visual direction, but keep the subscription total visible. Hiding it behind another click would intensify the problem already seen in tests; let us compare the style while preserving the customer’s pricing task.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You distinguish visual inspiration from an interaction that would intensify the known problem. The recommendation is grounded in the existing evidence."
            },
            {
              "text": "We can show both references to users and ask which page they prefer, then implement the winning approach as a complete package.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Preference testing can inform design, but it does not show whether users find the subscription total. Evaluate the target task, not only which reference they like."
            }
          ]
        },
        {
          "message": "The new screen looks calmer. Can we skip testing to leave more time for polishing the other screens?",
          "tip": "A visual improvement does not establish that the customer task is fixed.",
          "phrase": "Check the target task.",
          "meaning": "Test the specific action or understanding a revision is intended to improve.",
          "choices": [
            {
              "text": "Let us test finding the total and ordering first.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You protect the key user tasks while keeping the budget trade-off explicit. Task evidence determines whether polishing or further revision is the better next use of time."
            },
            {
              "text": "We can skip the test if Quinn approves the visual direction.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Stakeholder approval confirms preference, not whether the missed total is fixed. Retain a proportionate task check."
            },
            {
              "text": "We can ask the team for a quick preference vote and use the saved time to apply the calmer style to all pages before the deadline.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "A preference vote does not test finding the total or ordering. Broad rollout before checking those tasks risks spreading the unresolved problem."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "Quinn’s director approved the original visual direction. Quinn now says it feels “rather busy” and asks for something “a little more confident”. User evidence shows the main offer is missed, but both visual routes remain untested. There is budget for one comparison screen, not a full redesign.",
      "objective": "Interpret tactful criticism without inventing intent and create a face-saving, evidence-based decision.",
      "emailSummary": "A one-screen comparison will test whether a clearer hierarchy makes the main offer easier to find.",
      "emailNext": "We will agree the intended meaning of “confident”, compare routes against the same user task and retain accurate uncertainty.",
      "steps": [
        {
          "message": "Quinn says, “It is rather busy, though I know the director liked it.” How should you respond?",
          "tip": "Acknowledge the concern without recruiting the client into a disagreement.",
          "phrase": "Build on the direction",
          "meaning": "Refine an existing approach without treating earlier work as a failure.",
          "choices": [
            {
              "text": "We can create a cleaner alternative as the next stage of the director’s idea, without explicitly raising concerns about the current screen.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "Diplomatic presentation helps, but avoiding the concern entirely loses the evidence needed for a useful comparison. Ask what competes with the offer."
            },
            {
              "text": "We can build on the existing approved direction. Which elements compete with the main offer for you, and where would a calmer hierarchy help?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You provide a face-saving route while seeking concrete evidence of the concern. You neither assume Quinn wants to reject the director’s choice nor dismiss the criticism."
            },
            {
              "text": "We can retain the director’s preferred design and make small cosmetic adjustments, so the approval remains intact while Quinn sees a visible response to the feedback.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "Protecting approval is understandable, but cosmetic changes are not shown to solve the missed offer. Clarify the concern before restricting the solution."
            }
          ]
        },
        {
          "message": "Quinn adds, “I was hoping it might feel a little more confident.” You do not yet know whether that means stronger hierarchy or a different brand voice.",
          "tip": "Treat indirect wording as a request to clarify, not as a complete specification.",
          "phrase": "When you say…",
          "meaning": "Check the intended meaning of a phrase before acting on it.",
          "choices": [
            {
              "text": "When you say “more confident”, do you mean a clearer offer hierarchy, a firmer brand voice, or something else? We have one comparison screen, so clarifying the intended quality first will help us use that limited budget on the right question.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You offer plausible interpretations without forcing a choice between them. The question establishes meaning before limited comparison work is spent."
            },
            {
              "text": "We can strengthen the headline and use bolder typography.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "That may be the intended direction, but it guesses at a deliberately broad phrase. Check whether the issue concerns hierarchy, voice or another quality."
            },
            {
              "text": "We can make the page more assertive overall by increasing contrast, shortening the copy and simplifying supporting information in the comparison screen.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "The proposed changes are plausible, but they combine several unverified interpretations. Clarify the intended quality before implementing them."
            }
          ]
        },
        {
          "message": "The director asks, “Your new route is clearly better, then?” Neither route has been tested with users.",
          "tip": "Support a decision without turning a design hypothesis into a finding.",
          "phrase": "A stronger hypothesis",
          "meaning": "A more promising idea that still needs evidence.",
          "choices": [
            {
              "text": "The clearer hierarchy makes it the stronger choice on design grounds; we can confirm the finer details with user feedback after the direction is approved.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "You treat an untested design judgement as sufficient to choose the route and defer the core question as a fine detail. Test the target task first."
            },
            {
              "text": "It is better aligned with the latest feedback, so I would recommend approving it.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Alignment with feedback matters, but it does not establish that users find the offer. Recommend a limited comparison before claiming superiority."
            },
            {
              "text": "Promising, not tested: let us compare both routes on finding the offer.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You express a useful professional view while retaining uncertainty and offering a proportionate comparison. Approval can then rest on task evidence rather than authority."
            }
          ]
        }
      ]
    }
  },
  "payment": {
    "beginner": {
      "context": "Invoice CB-204 for €1,200 was due on 10 October and is unpaid. Cameron handles finance. You can resend the invoice, but cannot change payment terms or promise that project timing is unaffected.",
      "objective": "Follow up with precise facts, remove a practical blocker and ask for a useful date.",
      "emailSummary": "Invoice CB-204 for €1,200 remains unpaid after its 10 October due date.",
      "emailNext": "Please confirm receipt and an expected payment date. We will verify any project implications internally.",
      "steps": [
        {
          "message": "Which invoice are you asking about? We receive many each week.",
          "tip": "Give the reference needed to locate the payment.",
          "phrase": "Invoice reference",
          "meaning": "The identifying number used to find a particular invoice.",
          "choices": [
            {
              "text": "The invoice for our recent work. It should be in your finance inbox; please let me know if it is difficult to find and I can send another copy.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "The offer to resend helps, but the initial reference remains vague. Include the invoice number and due date immediately."
            },
            {
              "text": "Invoice CB-204 is for €1,200, due on 10 October. Could you please check the current payment status with your finance team and update us today?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You provide the number, amount and due date, then make one clear request. Finance can identify the document without guessing."
            },
            {
              "text": "Your finance team should be able to find the €1,200 invoice in its recent messages; please check again before we resend it.",
              "score": [
                2,
                1,
                2
              ],
              "feedback": "The amount is relevant, but “should be able to” implies a fault in the team and asks them to search again without the invoice number. Give the precise reference and remove that unnecessary friction."
            }
          ]
        },
        {
          "message": "I cannot find the invoice. Can you send it again?",
          "tip": "Confirm the route and preserve the reference when resending.",
          "phrase": "Resend a copy",
          "meaning": "Send the same document again without creating a second charge.",
          "choices": [
            {
              "text": "Of course. Please confirm the correct finance email address. I will resend a copy of the existing CB-204 invoice through that route and ask your team to confirm receipt, so we know whether the missing document has reached them.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You check the delivery route and make clear it is a copy, not another invoice. Receipt confirmation will tell you whether the blocker is removed."
            },
            {
              "text": "Of course. I will send it to the address I used before.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Resending is relevant, but the previous route may be the reason it was lost. Confirm the finance address and receipt."
            },
            {
              "text": "Of course. I will create a replacement invoice with a new reference and send it to your usual address so the team has a fresh document to process.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "A new reference can create duplicate-payment confusion. Resend the existing invoice unless an actual correction is needed."
            }
          ]
        },
        {
          "message": "We have it now. Payment should happen soon. Is that okay?",
          "tip": "A vague timing word does not support planning.",
          "phrase": "Expected payment date",
          "meaning": "The day on which finance expects to make the payment.",
          "choices": [
            {
              "text": "Thank you. We will keep the invoice open and check again next week if payment has not arrived, so your team has time to finish its normal process.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A later follow-up may be courteous, but it leaves the present timing vague. Request an expected date and verify any scheduling implications."
            },
            {
              "text": "Thank you. Please let us know once it is paid.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A payment notification is useful, but you still cannot plan around “soon”. Ask for a date now."
            },
            {
              "text": "Please confirm the date; I will check impacts.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You acknowledge progress but ask for the missing date and avoid inventing project consequences. The next step is specific and within your authority."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "Invoice CB-204 is overdue. Finance cannot process it because a purchase-order reference is missing. The client proposes a new due date after correction. You can correct the reference; only your finance manager can approve revised payment terms. Next week’s work has not yet been paused.",
      "objective": "Remove the blocker without silently changing terms or threatening unapproved consequences.",
      "emailSummary": "We will correct the purchase-order reference while revised payment terms await finance approval.",
      "emailNext": "Please supply the reference and proposed payment date. We will seek approval and communicate any confirmed work implications.",
      "steps": [
        {
          "message": "We cannot pay without the purchase-order number. Can you add it?",
          "tip": "Ask for the actual information needed instead of guessing or restarting the charge.",
          "phrase": "Correct the reference",
          "meaning": "Update an administrative field while keeping the underlying invoice identifiable.",
          "choices": [
            {
              "text": "Please send the required purchase-order reference and the finance submission route. We will update that field on CB-204, resend the corrected document and confirm receipt, keeping the same invoice identifiable throughout the process.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You obtain the exact missing reference and route, keeping a traceable correction to the same invoice. Receipt confirmation checks the practical blocker."
            },
            {
              "text": "We will add the project code from our records and resend the invoice.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A project code may not be the required purchase order. Ask finance for the exact reference before resending."
            },
            {
              "text": "We will cancel CB-204 and issue a new invoice with a fresh reference, then ask your team to provide the purchase-order number during processing.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Replacing the invoice does not supply the missing number and may create reconciliation confusion. Obtain the reference, then correct the existing document."
            }
          ]
        },
        {
          "message": "If you correct it today, can the due date move to the end of next month?",
          "tip": "An administrative correction does not give you authority to revise commercial terms.",
          "phrase": "Seek approval for the terms.",
          "meaning": "Ask the authorised person to agree a commercial change.",
          "choices": [
            {
              "text": "Let us date the corrected copy today and ask your team to apply its standard payment period, then discuss any differences if our finance manager raises them.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "A corrected document date does not automatically reset payment terms. Seek approval of the specific proposed date rather than relying on a default process."
            },
            {
              "text": "We can use that date if it helps finance complete the payment cycle; I will note the change when sending the corrected invoice and copy our manager.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "You agree new terms outside your authority and treat copying the manager as sufficient. Ask for approval before changing the due date."
            },
            {
              "text": "I can correct it today. I will ask our finance manager to approve the proposed due date separately.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You separate the correction you can make from the terms change you cannot approve. Copying a manager is not equivalent to obtaining approval."
            }
          ]
        },
        {
          "message": "Will your team continue next week while the payment date is being reviewed?",
          "tip": "Verify scheduling decisions without claiming an automatic stop or guarantee.",
          "phrase": "Confirm the work implications.",
          "meaning": "Check how a commercial issue affects planned delivery before stating a consequence.",
          "choices": [
            {
              "text": "We expect work to continue, so there should be no problem.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "This sounds reassuring but the context does not establish that work is unaffected. Check the agreed terms and plan before confirming."
            },
            {
              "text": "I will check the terms and plan with our manager today, then confirm work implications in writing. No pause has been agreed.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You give a timely verification step and state the current status accurately. You avoid both an unsupported continuity promise and an unauthorised pause."
            },
            {
              "text": "We should hold next week’s tasks until the payment review is complete, then restart them once finance has agreed the corrected invoice and date.",
              "score": [
                1,
                2,
                0
              ],
              "feedback": "You introduce a pause that has not been approved. Confirm the actual work implications internally before communicating a change."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "Cameron says payment timing is sensitive because their quarter-end cash position is tight. They ask for thirty extra days and want no mention of this to their sponsor. Your finance manager can approve extensions; the sponsor owns scheduling decisions. You can discuss privacy respectfully but cannot conceal a material scheduling effect or guarantee an extension.",
      "objective": "Negotiate a discreet, bounded route while preserving authority and accurate commitments.",
      "emailSummary": "The requested extension needs finance approval; any material scheduling effect needs the responsible sponsor’s decision.",
      "emailNext": "We will seek a discreet review of the proposed date and discuss the minimum information needed if scheduling is affected.",
      "steps": [
        {
          "message": "Cameron says, “It would be helpful if this stayed between us. Could you give us thirty more days?”",
          "tip": "Offer discretion without promising an unauthorised agreement or secrecy.",
          "phrase": "Limit the information shared.",
          "meaning": "Use only the relevant details with people who need them for a decision.",
          "choices": [
            {
              "text": "I will ask our manager for an extension and keep the sponsor out of the conversation so the request does not create concern about the project.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "The review is appropriate, but you promise to exclude a schedule decision maker regardless of impact. Keep disclosure limited but conditional on actual responsibility."
            },
            {
              "text": "I understand. I will keep this private and ask finance to adjust the date.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "You imply the adjustment is available and promise privacy despite a possible material schedule effect. Specify the approval requirement and limits to discretion."
            },
            {
              "text": "I can seek discreet approval, not promise an extension or conceal effects.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You respect sensitivity while making decision authority and possible scheduling disclosure explicit. You seek a minimal-information route rather than promising secrecy you cannot keep."
            }
          ]
        },
        {
          "message": "Cameron offers: “If you guarantee the thirty days, I can get approval for a partial payment this week.” Neither concession has approval yet.",
          "tip": "A reciprocal proposal is not the same as two confirmed commitments.",
          "phrase": "An approval-dependent proposal",
          "meaning": "An exchange that becomes binding only after authorised decisions.",
          "choices": [
            {
              "text": "I can agree the extension in principle if you arrange the partial payment first, and ask our finance manager to confirm the details once the transfer is underway.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "“In principle” still creates an extension expectation and asks the client to act before approval. Present the exchange to both authorised decision makers first."
            },
            {
              "text": "Let us ask both approvers to agree the exchange: part payment this week for thirty more days. Neither of those two concessions is confirmed until they both approve it.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You preserve the useful reciprocal structure without pretending either person has approval. Both conditions can be reviewed as a single proposal."
            },
            {
              "text": "We can offer the thirty days subject to paperwork, then use the partial payment as evidence that the revised arrangement is working before we ask both teams for their formal sign-off.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Calling approval paperwork minimises a real authority constraint. Do not offer the extension as available before it has been approved."
            }
          ]
        },
        {
          "message": "Finance approves the exchange, but the sponsor must move a dependent milestone if payment is later. Cameron asks you to describe the change as a routine reschedule.",
          "tip": "You can minimise sensitive detail without disguising the basis of a decision.",
          "phrase": "A neutral, accurate summary",
          "meaning": "Brief wording that is tactful without changing the facts.",
          "choices": [
            {
              "text": "We can keep cash-position details private and use a neutral summary of the approved payment timing and its milestone effect. The sponsor needs that link to decide; let us agree concise wording rather than call it routine.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You distinguish unnecessary financial detail from the timing dependency the sponsor needs. Privacy is protected without misrepresenting why the milestone changes."
            },
            {
              "text": "We can call it an updated commercial plan and ask the sponsor to approve the new milestone.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "The label is neutral, but it hides the link between payment timing and the dependent milestone. State the minimum relevant timing information explicitly."
            },
            {
              "text": "We can describe the milestone as a routine planning adjustment and retain the payment agreement in the finance record so confidential information stays protected.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "A routine label conceals the material reason for a sponsor decision. Keep cash details private, but do not hide the approved timing and its effect."
            }
          ]
        }
      ]
    }
  },
  "async": {
    "beginner": {
      "context": "Your team and Drew work in different time zones. Drew must choose API option A or B by Thursday at 16:00 UTC. Integration waits for that choice; UI work can continue. You need a written update that Drew can act on without another call.",
      "objective": "Write a clear update with the decision, deadline and specific blocked work.",
      "emailSummary": "UI work continues while integration awaits the API option decision.",
      "emailNext": "Please choose A or B by Thursday at 16:00 UTC. Tell us early if that is not possible so we can review the integration plan.",
      "steps": [
        {
          "message": "Can you send a short update? I will read it when I start work tomorrow.",
          "tip": "Separate current progress from the request requiring a reply.",
          "phrase": "Decision needed",
          "meaning": "A clear label for a choice another person must make.",
          "choices": [
            {
              "text": "The UI team has completed several tasks and will continue the planned work tomorrow. Integration preparation is also underway, with the API details to follow from your team.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "The update sounds active but blurs the integration blocker and gives Drew no action. State the outstanding decision directly."
            },
            {
              "text": "We are progressing on the UI and waiting for some API information.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "The status is broadly accurate but “some API information” hides the choice and deadline. Name A or B and the response time."
            },
            {
              "text": "UI work is continuing. Integration is waiting for your choice of API A or B. Please confirm the option by Thursday at 16:00 UTC; that is the decision we need from you to plan integration.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You distinguish work that continues from work that is blocked and give an exact decision and deadline. Drew can act without reconstructing the request from a task list."
            }
          ]
        },
        {
          "message": "I see the update. What exactly do you need from me?",
          "tip": "Ask for the smallest specific decision that removes the blocker.",
          "phrase": "Please confirm the option.",
          "meaning": "Ask for a direct answer to a defined choice.",
          "choices": [
            {
              "text": "Please send us your API plans and any supporting notes so the team can understand your requirements and decide which approach to use for the integration.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "Background can help, but this asks for a wider bundle of material and moves the client-owned choice to your team. Request A or B directly."
            },
            {
              "text": "Please choose API A or B by Thursday at 16:00 UTC.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You identify the exact choice and the time zone. Drew knows what answer will unblock integration."
            },
            {
              "text": "Please review our project board and respond to the integration tasks when you have time, adding any API information your team considers useful.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "The board may contain detail, but this reply still makes Drew search for the request and omits the deadline. Give the decision in the message."
            }
          ]
        },
        {
          "message": "I may not have an answer by Thursday. What should I do?",
          "tip": "Invite an early warning and describe the affected work accurately.",
          "phrase": "Let us know early.",
          "meaning": "Tell the team soon enough to adjust the plan.",
          "choices": [
            {
              "text": "Please tell us as soon as you know. We can keep working on the UI and review the integration date if the decision is late.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You invite an early warning, preserve the valid parallel work and identify the date needing review. You do not invent a new date or guarantee recovery."
            },
            {
              "text": "Please send the answer when it is ready; the UI team can stay busy.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Parallel work helps, but you leave the integration timing risk unstated. Explain that its date may need review if the decision is late."
            },
            {
              "text": "Please ask a colleague to choose if you are unavailable, so we can keep the original dates and avoid changing the plan for the rest of the team.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "A substitute may be useful only if authorised, and the original dates are not guaranteed. Ask for early coordination rather than assuming delegation solves the dependency."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "Integration is blocked on Drew’s API choice. A decision is needed by Thursday at 16:00 UTC to hold Friday’s test slot. UI work continues. Drew’s technical lead will be absent Thursday; a named deputy can decide only if Drew explicitly delegates authority. There is no approved default option.",
      "objective": "Design an asynchronous decision request around ownership, authority and a real dependency.",
      "emailSummary": "Thursday’s API decision is needed to retain Friday’s integration test slot.",
      "emailNext": "Please confirm the decision owner or authorised deputy, choose A or B and warn us early if the deadline cannot be met.",
      "steps": [
        {
          "message": "Can you put the request in the weekly update? There is a lot for the technical lead to read.",
          "tip": "Make the actionable dependency easy to find without requiring a live explanation.",
          "phrase": "Decision, owner, deadline",
          "meaning": "The essential fields of a request that can be acted on asynchronously.",
          "choices": [
            {
              "text": "I will attach the full technical discussion so the lead has all the context.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Technical detail is useful, but an attachment alone does not expose the owner, deadline or consequence. Summarise the decision at the top."
            },
            {
              "text": "Decision first: A or B, owner, deadline and test-slot risk.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You prioritise the time-sensitive action and explain why the deadline matters. Background remains available without burying the decision."
            },
            {
              "text": "I will include the request at the end of the weekly summary with a link to the technical notes, so the lead can finish reading the progress before reviewing the options.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A link is helpful, but placing the critical action after all progress increases the chance it is missed. Lead with the decision and dependency."
            }
          ]
        },
        {
          "message": "The lead will be away Thursday. Their deputy usually covers. Should we send the choice to the deputy?",
          "tip": "Usual cover does not establish authority for this specific decision.",
          "phrase": "Confirm the delegation.",
          "meaning": "Check that someone is explicitly authorised to decide on another person’s behalf.",
          "choices": [
            {
              "text": "Could Drew confirm the deputy can decide this API choice? If they do have that authority, we can send both API options and the deadline to them.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You enable continuity while checking the exact authority the context requires. The deputy receives an actionable request after delegation is explicit."
            },
            {
              "text": "We can send it to the deputy and copy Drew, since that is the usual cover arrangement and the deadline is too close to wait for a formal confirmation.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Copying Drew is not explicit delegation. Ask for a prompt confirmation rather than assuming routine cover includes this API decision."
            },
            {
              "text": "We can ask the deputy for a recommendation and treat it as the working decision, giving Drew a chance to correct it after the lead returns.",
              "score": [
                1,
                2,
                0
              ],
              "feedback": "A recommendation is not an authorised choice, and delayed correction could invalidate Friday testing. Confirm delegation before treating advice as a decision."
            }
          ]
        },
        {
          "message": "No decision has arrived by Thursday noon. Shall we assume A if nobody objects before 16:00?",
          "tip": "An unapproved default can hide a missed dependency.",
          "phrase": "No approved default",
          "meaning": "Silence has not been agreed as permission to choose an option.",
          "choices": [
            {
              "text": "We can start preparing A to protect the Friday slot, then reverse it if the client selects B after the deadline.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Preparation might be reversible, but choosing A to protect the slot is not an approved decision and could waste work. Seek the decision and review the plan if it is late."
            },
            {
              "text": "We can propose A and make clear they have until 16:00 to object.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "A proposal is legitimate, but an objection deadline does not authorise a default here. Ask for explicit approval of either the option or a default rule."
            },
            {
              "text": "There is no approved default. Let us remind the authorised owner of the 16:00 decision and Friday slot, and ask for an early warning if they cannot meet it. If it is missed, we will review the test plan rather than assume A.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You keep decision ownership explicit, give a timely reminder and describe the fallback planning action. Silence does not become invented consent."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "Drew’s programme spans two teams. Team North favours API A for lower maintenance; Team South favours B to retain an existing workflow. Drew must decide by Thursday at 16:00 UTC to hold a test slot. Neither option meets both priorities fully, and silence has not been agreed as consent.",
      "objective": "Frame a genuine cross-team trade-off and obtain explicit agreement without manipulating silence.",
      "emailSummary": "The API decision trades lower maintenance against preserving an existing workflow.",
      "emailNext": "We will present both costs neutrally, seek Drew’s explicit choice and verify how team concerns will be addressed after the decision.",
      "steps": [
        {
          "message": "Drew writes, “Both teams seem broadly comfortable. Perhaps we can just go with A?” South has not withdrawn its workflow concern.",
          "tip": "Broad comfort does not resolve the particular cost of a choice.",
          "phrase": "Make the trade-off explicit.",
          "meaning": "Name what an option gains and what another party gives up.",
          "choices": [
            {
              "text": "A reduces maintenance but changes the workflow South wants to retain. Could you explicitly confirm that trade-off as the final decision, with a plan for South’s concern, rather than treating broad comfort as agreement on the consequence?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You supply the missing consequence without rejecting A or assigning a veto to South. Drew can explicitly own the trade-off rather than rely on a vague consensus claim."
            },
            {
              "text": "A looks like the emerging consensus. We can record it and give South a final opportunity to raise anything that would prevent implementation.",
              "score": [
                1,
                2,
                2
              ],
              "feedback": "An opportunity to object can help, but South has already raised a concern. Do not replace resolution of that concern with presumed consensus."
            },
            {
              "text": "We can describe A as the preferred direction and discuss the workflow adjustment with South during implementation so the programme keeps moving.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "You move an unresolved consequence into implementation and make “preferred” sound decided. Ask Drew to confirm the trade-off before proceeding."
            }
          ]
        },
        {
          "message": "North asks you to write, “B adds unnecessary maintenance.” South says B protects a workflow its users rely on.",
          "tip": "Present competing priorities in comparable, neutral terms.",
          "phrase": "A cost, not a verdict",
          "meaning": "Describe an option’s consequence without declaring another team’s priority invalid.",
          "choices": [
            {
              "text": "We can use North’s wording in the technical summary and put South’s workflow rationale in a separate note, so each team’s perspective is represented.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "Separate notes may preserve both views, but the main summary still prejudges South’s benefit as unnecessary. Use neutral comparable wording in the decision request."
            },
            {
              "text": "We can say B creates avoidable upkeep and note South’s preference separately; that keeps the technical recommendation focused.",
              "score": [
                2,
                1,
                1
              ],
              "feedback": "You give a clear recommendation, but “avoidable” dismisses the legitimate workflow benefit and reduces South’s operational need to taste. Name the retained workflow and maintenance cost without belittling either priority."
            },
            {
              "text": "Use “B keeps South’s workflow with more maintenance; A lowers upkeep with a workflow change.”",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You describe the benefit and cost of both options at the same level of specificity. Drew gets a fair comparison rather than one team’s evaluative framing."
            }
          ]
        },
        {
          "message": "Drew says, “Let us leave the message open overnight; if no one pushes back, we can call it agreed.” No consent-by-silence rule exists.",
          "tip": "Suggest a practical response window without converting non-response into agreement.",
          "phrase": "Explicit confirmation",
          "meaning": "A direct statement accepting a decision or its conditions.",
          "choices": [
            {
              "text": "We can call it provisionally agreed if no one responds overnight.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "“Provisional” still interprets non-response as agreement without an accepted rule. Use the window for comments and require a direct decision."
            },
            {
              "text": "An overnight window allows comments, not consent. Please choose A or B by Thursday 16:00 UTC and record how the affected team’s concern will be handled.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You preserve asynchronous consultation while distinguishing it from consent and retaining the actual decision deadline. A named decision also records the treatment of the losing priority."
            },
            {
              "text": "We can set a clear overnight objection deadline and record the lack of objections as team acceptance, then ask Drew to confirm the choice before the test slot.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "A clear deadline improves consultation, but absent objections are not team acceptance here. Record the comments received and obtain Drew’s explicit decision separately."
            }
          ]
        }
      ]
    }
  }
};
