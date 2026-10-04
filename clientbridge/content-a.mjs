export const variantsA = {
  "requirements": {
    "beginner": {
      "context": "A shop needs a daily order report. Its manager checks it on a phone. Only paid orders count; refunds must be shown separately. You have not agreed a delivery date.",
      "objective": "Clarify users, define the report and agree a check.",
      "emailSummary": "Compare one day with our paid-order records and refund records, then approve the figures.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Could you make a useful sales report? I need to check it on my phone.",
          "tip": "What must be defined before a label or estimate can be relied on?",
          "phrase": "Which figures do you need?",
          "meaning": "Ask the recipient to define the information that matters.",
          "choices": [
            {
              "text": "Which daily figures do you need to check on your phone?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "You already know that only paid orders count and refunds are separate. Ask which daily figures matter on the phone before selecting the layout."
            },
            {
              "text": "We can copy the desktop report, reduce its width for the phone and keep its existing figures so there is no need to define a new report.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Reusing a layout may help later, but it does not establish what the manager needs. Ask about figures first."
            },
            {
              "text": "I suggest a weekly total first; it will keep the screen simple and give you a useful view of sales.",
              "score": [
                0,
                3,
                2
              ],
              "feedback": "The proposed weekly view is courteous and actionable, but contradicts the stated daily reporting need. Keep the daily period and ask which figures matter on the phone."
            }
          ]
        },
        {
          "message": "Daily paid orders are enough. Please show refunds separately, not as extra sales.",
          "tip": "Which distinctions could disappear in a convenient summary?",
          "phrase": "To confirm the definition…",
          "meaning": "Introduce a shared interpretation and invite correction.",
          "choices": [
            {
              "text": "We will show all orders in one daily total, with a note explaining that refunds are included.",
              "score": [
                1,
                3,
                2
              ],
              "feedback": "The note does not prevent the combined total from counting refunds as sales. Use separate figures."
            },
            {
              "text": "So the report will show daily paid orders and a separate refund total. Is that right?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Reflect both the inclusion rule and the separate refund total, then invite correction."
            },
            {
              "text": "Understood; the main figure will be daily sales.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "Daily sales is ambiguous about payment and refunds. Repeat both rules before treating scope as agreed."
            }
          ]
        },
        {
          "message": "How will we check the report before we use it?",
          "tip": "What evidence would make the proposed assurance defensible?",
          "phrase": "Subject to validation",
          "meaning": "Indicate that a finding is not final until evidence has been checked.",
          "choices": [
            {
              "text": "Try it on your phone and confirm that the report looks clear.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Phone usability matters, but it cannot show whether paid orders and refunds are counted correctly. Add a data check."
            },
            {
              "text": "Approve a screenshot, then reuse that design each day.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "A screenshot can approve layout but not calculation accuracy. Compare the underlying records as well."
            },
            {
              "text": "Compare one day with our paid-order records and refund records, then approve the figures.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "A record comparison tests the agreed business rules, rather than appearance alone."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "A finance lead needs monthly revenue by region. Invoices use invoice-date reporting, but the sales dashboard uses payment dates. Finance owns the definition; the analyst is available tomorrow. An estimate is needed today, but development need not start today.",
      "objective": "Resolve conflicting definitions without concealing estimate uncertainty.",
      "emailSummary": "Send a cross-month invoice and a cross-region adjustment, with expected totals for Finance to approve.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "The dashboard and ledger disagree. Could you estimate the regional report today?",
          "tip": "What must be defined before a label or estimate can be relied on?",
          "phrase": "Which figures do you need?",
          "meaning": "Ask the recipient to define the information that matters.",
          "choices": [
            {
              "text": "I can give a range today, marked provisional, then confirm the revenue definition with Finance tomorrow.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "A labelled range meets today’s need while retaining Finance’s authority over the definition."
            },
            {
              "text": "I can estimate the dashboard version today, explain that its figures may differ from the ledger and leave Finance to reconcile any differences after the report has been built.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Disclosing a mismatch does not settle which definition the report needs. Make the estimate conditional on Finance’s decision."
            },
            {
              "text": "Let us wait for the analyst before sharing anything.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "Avoiding uncertainty is understandable, but withholding even a qualified range misses the stated planning need."
            }
          ]
        },
        {
          "message": "Finance wants invoice dates. Sales wants to retain payment-date comparison; both must understand the difference.",
          "tip": "Which distinctions could disappear in a convenient summary?",
          "phrase": "To confirm the definition…",
          "meaning": "Introduce a shared interpretation and invite correction.",
          "choices": [
            {
              "text": "We can keep both calculations in the report and use a single revenue heading so the table stays compact.",
              "score": [
                0,
                3,
                2
              ],
              "feedback": "A common revenue heading hides the different date rules. Name each measure and its basis."
            },
            {
              "text": "Use invoice dates for the report; label the optional comparison as payment-date sales. Different measures can serve different needs, but readers should be able to tell exactly which calculation each label represents.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Separate labels preserve the Finance definition without presenting different measures as interchangeable."
            },
            {
              "text": "We should select one date rule throughout to prevent confusion.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "Consistency is useful, but deleting the requested comparison is unnecessary. Distinguish the two measures clearly."
            }
          ]
        },
        {
          "message": "The analyst can review only two examples tomorrow. What should we send?",
          "tip": "What evidence would make the proposed assurance defensible?",
          "phrase": "Subject to validation",
          "meaning": "Indicate that a finding is not final until evidence has been checked.",
          "choices": [
            {
              "text": "Send two typical invoices with their source values. A representative example should be sufficient for this review; resolving less common cases can wait until people start using the report regularly.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Typical examples may miss the disputed boundaries. Include cases that expose date and allocation assumptions."
            },
            {
              "text": "Send the report; let the analyst select two representative rows. A representative example should be sufficient for this review; resolving less common cases can wait until people start using the report regularly.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Making the analyst select cases consumes scarce review time and may miss the known risks. Prepare targeted examples."
            },
            {
              "text": "Send a cross-month invoice and a cross-region adjustment, with expected totals for Finance to approve.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Boundary examples test date and region rules within the limited review time. Expected totals make approval specific."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "A sponsor calls the proposed dashboard “the board view”, although the board has never approved a metric definition. Operations favours weekly bookings; Finance objects to calling bookings revenue. A board meeting is Thursday; a labelled prototype is possible, verified financial reporting is not.",
      "objective": "Protect shared meaning while preserving the sponsor’s credibility.",
      "emailSummary": "The prototype demonstrates weekly bookings; it does not yet establish revenue, which remains subject to Finance’s validation of the financial definition.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Let us call it the board revenue view. That should help everyone get behind it.",
          "tip": "What must be defined before a label or estimate can be relied on?",
          "phrase": "Which figures do you need?",
          "meaning": "Ask the recipient to define the information that matters.",
          "choices": [
            {
              "text": "Could we call Thursday’s prototype a bookings view, and invite Finance to shape the verified revenue view? That will give us a common definition to estimate and discuss, instead of letting a convenient report title decide what the figures mean.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The revised framing prevents a misleading headline and gives Finance a constructive role without blocking a prototype."
            },
            {
              "text": "We can use your title for the board presentation, include a footnote about the unverified bookings and ask Finance to review the wording after Thursday’s meeting has taken place.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "A footnote cannot reliably undo the implication of a revenue headline. Move the distinction into the title."
            },
            {
              "text": "I would postpone the presentation until Finance has approved the terminology; otherwise the board may question the project.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "Postponement protects accuracy but overlooks the available labelled prototype. Offer a credible limited presentation."
            }
          ]
        },
        {
          "message": "I do not want to reopen the brief in front of everyone. Can you just resolve this with Finance?",
          "tip": "Which distinctions could disappear in a convenient summary?",
          "phrase": "To confirm the definition…",
          "meaning": "Introduce a shared interpretation and invite correction.",
          "choices": [
            {
              "text": "I can tell Finance the sponsor prefers the current wording and ask them to keep any detailed objections out of Thursday’s discussion.",
              "score": [
                0,
                2,
                1
              ],
              "feedback": "You propose a concrete discussion, but confuse the sponsor’s preference with Finance’s authority over the definition. Suppressing objections does not establish agreement; resolve and circulate accurate labels."
            },
            {
              "text": "I can align the definitions privately; shall we circulate the agreed labels before Thursday so nobody is surprised?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Private alignment respects face, while a shared record avoids silently changing what others expect to see."
            },
            {
              "text": "I will agree the definitions with Finance privately. A single simple description will be easier for people to read, and we can explain any differences individually if someone asks about the numbers.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "Private agreement helps, but others may retain the old meaning. Share the agreed labels before the meeting."
            }
          ]
        },
        {
          "message": "Finance will not endorse revenue yet. What can I confidently say at the meeting?",
          "tip": "What evidence would make the proposed assurance defensible?",
          "phrase": "Subject to validation",
          "meaning": "Indicate that a finding is not final until evidence has been checked.",
          "choices": [
            {
              "text": "We have a board dashboard, with Finance reviewing some final details.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Final details minimises an unresolved metric definition. State what the prototype actually demonstrates."
            },
            {
              "text": "Finance has not approved revenue yet, but approval should be straightforward. We can present that as near-complete so the board sees progress, then ask Finance to resolve the remaining definitions after the meeting.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Expecting straightforward approval goes beyond the evidence and may pressure Finance. Keep validation explicitly open."
            },
            {
              "text": "The prototype demonstrates weekly bookings; it does not yet establish revenue, which remains subject to Finance’s validation of the financial definition.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "A precise boundary supports a confident statement without implying financial endorsement."
            }
          ]
        }
      ]
    }
  },
  "negotiation": {
    "beginner": {
      "context": "A café wants a booking page in ten days for £900. A complete page with reminders costs £1,400 and takes fifteen days. A booking form without reminders fits £900 and ten days. Work starts only after written scope approval.",
      "objective": "Offer a feasible trade-off and confirm its terms.",
      "emailSummary": "Send approval tonight; I will check tomorrow’s availability and confirm the start.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Could you include reminders and still meet our ten-day, £900 limit?",
          "tip": "Which constraint can you control, and which needs another party’s decision?",
          "phrase": "Would that meet your needs?",
          "meaning": "Check whether a proposed trade-off solves the other party’s problem.",
          "choices": [
            {
              "text": "Include reminders with a simpler design.",
              "score": [
                0,
                3,
                1
              ],
              "feedback": "The proposal is concise and cooperative, but assumes simpler design makes the full reminders scope feasible. That conflicts with the stated estimate; offer the available form-only option."
            },
            {
              "text": "The form fits your limit; reminders need more time and budget. Would the form meet your launch need?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "State the available trade-off and check whether it meets the real launch need."
            },
            {
              "text": "We can start with the form, discuss reminders after the launch and keep the initial design simple so that the ten-day schedule and the £900 budget are protected.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "Starting with the form may work, but it assumes approval of reduced scope. Ask before scheduling it."
            }
          ]
        },
        {
          "message": "The form is enough. Please keep the total at £900.",
          "tip": "What is being exchanged, and who can approve each side?",
          "phrase": "Conditional on approval",
          "meaning": "Make an offer dependent on a stated authorised decision.",
          "choices": [
            {
              "text": "The £900 limit is already in our quote; please refer to it when discussing additions.",
              "score": [
                2,
                1,
                2
              ],
              "feedback": "Referring to a recorded budget is useful, but “please refer to it” sounds like a correction rather than collaborative confirmation. Summarise the form-only scope, timing and approval condition."
            },
            {
              "text": "Agreed. We will deliver the form in ten days and add reminders later when our team has enough time.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "The later addition has no price or agreement. Treat reminders as a separate request, not a promised favour."
            },
            {
              "text": "Agreed: booking form only, £900, ten days after written approval; reminders are excluded. Putting the conditions together lets both sides judge the exchange, rather than agree a price with different assumptions about the work.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The summary ties price, scope and timing to approval and prevents an implied free addition."
            }
          ]
        },
        {
          "message": "Can you begin tomorrow? I can approve the scope this evening.",
          "tip": "What remains an estimate or a condition rather than an agreement?",
          "phrase": "Keep the agreed scope",
          "meaning": "Preserve an existing commitment while discussing changes to another term.",
          "choices": [
            {
              "text": "Send approval tonight; I will check tomorrow’s availability and confirm the start.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Approval and schedule confirmation are separate. The reply preserves both without promising unverified availability."
            },
            {
              "text": "Yes, tomorrow should be fine. This should preserve momentum while the remaining decision is processed, and we can revisit the arrangements if it becomes a practical issue.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Should be fine may be heard as a booked start. Verify availability and confirm it after approval."
            },
            {
              "text": "Prepare tonight and start while written approval is being processed. This should preserve momentum while the remaining decision is processed, and we can revisit the arrangements if it becomes a practical issue.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Preparing may create an implied commitment before written approval. Keep preparation and the confirmed start distinct."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "A retailer needs checkout changes before a promotion. A two-week implementation is possible only if the payment provider confirms its test account by Friday. The client can fund £4,000 now; implementation costs £4,000, monitoring costs £600 separately.",
      "objective": "Negotiate dependencies and costs without hiding delivery conditions.",
      "emailSummary": "Keep the agreed scope and price; revise the date after access is verified.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Can you guarantee the two-week launch if we approve £4,000 today?",
          "tip": "Which constraint can you control, and which needs another party’s decision?",
          "phrase": "Would that meet your needs?",
          "meaning": "Check whether a proposed trade-off solves the other party’s problem.",
          "choices": [
            {
              "text": "We can confirm the two-week date and ask the provider to prioritise access, with daily reminders if necessary.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Reminders reduce delay risk but cannot guarantee access. Do not turn influence over a dependency into control."
            },
            {
              "text": "We can reserve capacity; launch still needs Friday’s provider access. Shall we confirm that together? This preserves a workable offer without treating your constraint as an authorisation to promise something we cannot yet deliver.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Capacity can be reserved, but a provider-controlled dependency must remain an explicit launch condition."
            },
            {
              "text": "We can reserve the team for two weeks, make the implementation our highest priority and ask you to confirm the payment provider’s access arrangements separately with your account manager.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "Team reservation is useful but does not answer the launch guarantee. State the external condition."
            }
          ]
        },
        {
          "message": "Could monitoring be included? We cannot increase this month’s budget.",
          "tip": "What is being exchanged, and who can approve each side?",
          "phrase": "Conditional on approval",
          "meaning": "Make an offer dependent on a stated authorised decision.",
          "choices": [
            {
              "text": "We can move monitoring to next month. Keeping the paperwork simple should help us get the agreement through quickly, even if the full commercial detail needs to be clarified later.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "Deferral resolves this month’s budget but assumes the monitoring gap is acceptable. Check the operational need."
            },
            {
              "text": "We can absorb monitoring for this promotion if you commit informally to considering us for your next project, without agreeing any specific future scope or fee yet.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "An informal future possibility is not a defined commercial exchange. Agree scope and any concession explicitly."
            },
            {
              "text": "Implementation is £4,000; monitoring is £600. We could schedule monitoring next month if that meets your operational needs.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The proposal keeps costs visible and checks whether deferring monitoring is operationally acceptable."
            }
          ]
        },
        {
          "message": "Access may arrive Monday. We can accept a later launch, but please protect the promotion budget.",
          "tip": "What remains an estimate or a condition rather than an agreement?",
          "phrase": "Keep the agreed scope",
          "meaning": "Preserve an existing commitment while discussing changes to another term.",
          "choices": [
            {
              "text": "Keep the agreed scope and price; revise the date after access is verified.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The client has relaxed timing, so protect scope and price while basing the new date on actual access."
            },
            {
              "text": "We will keep the price and aim for the original date.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Aiming for the old date ignores the accepted timing trade-off and leaves the dependency unresolved."
            },
            {
              "text": "Move launch three days, assuming Monday access will arrive. This should preserve momentum while the remaining decision is processed, and we can revisit the arrangements if it becomes a practical issue.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Monday remains uncertain. Do not publish a precise replacement date based on an unconfirmed delivery."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "A procurement lead wants a 12% discount “to show partnership”. Your margin allows 6% if payment is within ten days, rather than the current thirty. The technical sponsor needs the full scope. Procurement cannot approve payment terms alone, and approval is due next Tuesday.",
      "objective": "Make reciprocal concessions without mistaking courtesy for authority.",
      "emailSummary": "Could we confirm the original terms by Tuesday, with the discounted option available if Finance approves in time?",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Other partners have found a way to show flexibility. I would hate this to become difficult.",
          "tip": "Which constraint can you control, and which needs another party’s decision?",
          "phrase": "Would that meet your needs?",
          "meaning": "Check whether a proposed trade-off solves the other party’s problem.",
          "choices": [
            {
              "text": "We appreciate the comparison and can offer 12% if we remove enough implementation work to protect our margin.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Reducing scope conflicts with the sponsor’s need and may not meet procurement’s request. Explore the viable reciprocal exchange."
            },
            {
              "text": "We value the partnership. A 6% reduction needs ten-day payment; could Finance consider that exchange?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The response acknowledges the relationship cue while linking a feasible concession to a reciprocal term and the right approver."
            },
            {
              "text": "We can offer 6% as a gesture of partnership, retain the full technical scope and keep the current payment arrangement so the quote can go forward without involving another decision maker.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "A unilateral discount gives away the available concession without obtaining its required payment condition."
            }
          ]
        },
        {
          "message": "I can probably get the payment term through. Could you put the reduced price in the quote now?",
          "tip": "What is being exchanged, and who can approve each side?",
          "phrase": "Conditional on approval",
          "meaning": "Make an offer dependent on a stated authorised decision.",
          "choices": [
            {
              "text": "I will add a note that payment terms are under discussion.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "A discussion note leaves the quoted price’s status unclear. State precisely which approved term activates it."
            },
            {
              "text": "I can quote the reduced price now and replace the payment clause once Finance confirms what procurement expects.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "Probably is not approval. A reduced final quote may commit you before the reciprocal term is authorised."
            },
            {
              "text": "I can show both options, with the discount conditional on written approval of ten-day payment.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Two conditional options let procurement progress without presenting an unapproved concession as final."
            }
          ]
        },
        {
          "message": "Finance needs longer. The sponsor is asking why the quote has not been finalised.",
          "tip": "What remains an estimate or a condition rather than an agreement?",
          "phrase": "Keep the agreed scope",
          "meaning": "Preserve an existing commitment while discussing changes to another term.",
          "choices": [
            {
              "text": "Could we confirm the original terms by Tuesday, with the discounted option available if Finance approves in time?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "An explicit default preserves the decision deadline and leaves the concession open without assigning blame."
            },
            {
              "text": "We should wait for Finance before finalising.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Waiting may miss the deadline although an approved original option exists. Offer a workable default."
            },
            {
              "text": "Tell the sponsor Finance is delaying approval; ask procurement to hurry.",
              "score": [
                2,
                1,
                2
              ],
              "feedback": "The remaining approval and the need for a timely decision are real. However, assigning blame to Finance and asking procurement to hurry risks internal relationships without giving a fallback. Offer the original terms as a clear default."
            }
          ]
        }
      ]
    }
  },
  "delay": {
    "beginner": {
      "context": "A training portal was due Wednesday. A login defect means reliable delivery is now expected Friday. The client has Thursday training. A demonstration using sample accounts and synthetic records only is safe; real staff accounts cannot be used until the defect is fixed.",
      "objective": "Explain the delay and offer an accurately labelled fallback.",
      "emailSummary": "I will update you by noon tomorrow with test results and remaining risks, even if testing is incomplete.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Is the portal ready for Thursday training?",
          "tip": "What does the recipient need to plan, beyond reassurance?",
          "phrase": "We expect…",
          "meaning": "Present an estimate without claiming certainty.",
          "choices": [
            {
              "text": "We are finishing the login work, checking the remaining defects with the developers and will let you know when we have enough information to confirm how Thursday training should proceed.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "The update does not answer whether Thursday’s real-account training is possible. Give the actual limitation."
            },
            {
              "text": "Most of the portal works, so Thursday training should be possible if staff avoid the parts still being tested.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "Avoiding unspecified parts is not the defined safe fallback. Separate sample demonstration from staff-account use."
            },
            {
              "text": "Real accounts are not ready; we expect Friday. We can discuss a sample-account demonstration for Thursday. That gives you a meaningful planning boundary, rather than leaving you to decide whether a working demonstration also means production is ready.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The reply states the limitation and expected date, then offers the available safe fallback."
            }
          ]
        },
        {
          "message": "Can the sample demonstration include our staff records?",
          "tip": "Would a proposed fallback actually respect the stated limitations?",
          "phrase": "Keep a fallback",
          "meaning": "Retain an alternative plan while readiness is uncertain.",
          "choices": [
            {
              "text": "Use sample accounts and sample records only; we will label it as a demonstration.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Both accounts and records stay within the stated sample-only fallback. Labelling makes its status clear."
            },
            {
              "text": "We can label the accounts as samples. This keeps the earlier plan in place, with the team watching closely for anything that might require an adjustment before the work is completed.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "Labelling accounts does not answer the records question. Explicitly keep real staff records out of the fallback."
            },
            {
              "text": "We can import staff records into sample accounts so the demonstration looks familiar, then remove the records afterwards.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "Deleting later does not make unapproved real-data use safe. Keep the demonstration fully synthetic."
            }
          ]
        },
        {
          "message": "Please tell me whether Friday is still realistic by tomorrow lunchtime.",
          "tip": "Which commitment remains reliable even if the technical work is unfinished?",
          "phrase": "Our next decision update",
          "meaning": "Commit to a controllable checkpoint rather than an unverified completion date.",
          "choices": [
            {
              "text": "We will confirm the date once all testing finishes. Waiting for the complete outcome will avoid sending several provisional messages that may need to be revised as more information becomes available.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Seeking certainty is reasonable, but the client needs a noon update. Report the evidence and remaining uncertainty then."
            },
            {
              "text": "I will update you by noon tomorrow with test results and remaining risks, even if testing is incomplete.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The commitment meets the requested checkpoint without pretending incomplete testing can produce certainty."
            },
            {
              "text": "I will contact you when testing finishes.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Waiting for completion may miss the requested planning checkpoint. Update on progress even without resolution."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "A data migration is late. Import tests pass, but reconciliation of totals is incomplete. Friday go-live is possible only if reconciliation passes by Thursday 16:00. The client can keep the old system through Monday, but must decide staff cover by Thursday noon.",
      "objective": "Separate technical confidence from operational planning deadlines.",
      "emailSummary": "Keep the old system; revised go-live needs a reconciliation pass, not just a new date.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "The imports passed. Shall I tell staff Friday is confirmed?",
          "tip": "What does the recipient need to plan, beyond reassurance?",
          "phrase": "We expect…",
          "meaning": "Present an estimate without claiming certainty.",
          "choices": [
            {
              "text": "The imports look good, so Friday remains our target. We will continue reconciliation in parallel and let you know promptly if the remaining work affects the launch arrangements you make.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Target is less definite than confirmed, but it omits the outstanding release gate and fallback. Make both visible."
            },
            {
              "text": "Reconciliation must pass before Friday can be confirmed. Repeating the request for a guarantee will not change that; you should plan Monday cover.",
              "score": [
                3,
                1,
                2
              ],
              "feedback": "The readiness boundary and fallback are sound, but the comment about repeating a request dismisses a reasonable planning question. State the limitation and fallback without criticising the client."
            },
            {
              "text": "Not yet: reconciliation remains open. Let us keep Monday as the fallback until Thursday’s check.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The reply distinguishes a successful component test from release readiness and retains the available fallback."
            }
          ]
        },
        {
          "message": "I must arrange cover by noon, four hours before your final check. What should I do?",
          "tip": "Would a proposed fallback actually respect the stated limitations?",
          "phrase": "Keep a fallback",
          "meaning": "Retain an alternative plan while readiness is uncertain.",
          "choices": [
            {
              "text": "Plan Monday cover at noon unless we already have a pass; keep Friday conditional until reconciliation is complete.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "A noon decision rule respects the staffing deadline while preserving Friday only if evidence arrives early."
            },
            {
              "text": "Wait for our 16:00 result if possible.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "The stated noon constraint means waiting may not be possible. Provide a decision rule within it."
            },
            {
              "text": "Arrange Friday cover because imports have passed; that gives us the best chance of preserving the original launch plan.",
              "score": [
                0,
                2,
                1
              ],
              "feedback": "Import success does not settle reconciliation. Staffing the optimistic date transfers an unresolved technical risk to the client."
            }
          ]
        },
        {
          "message": "Reconciliation failed Thursday afternoon. Imports are fine; can we launch and repair the totals on Monday?",
          "tip": "Which commitment remains reliable even if the technical work is unfinished?",
          "phrase": "Our next decision update",
          "meaning": "Commit to a controllable checkpoint rather than an unverified completion date.",
          "choices": [
            {
              "text": "Launch Friday with a discrepancy note and manual spot checks.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "A discrepancy note and manual spot checks do not replace required reconciliation. Use the available old system."
            },
            {
              "text": "Keep the old system; revised go-live needs a reconciliation pass, not just a new date.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "A failed readiness gate remains a gate. The fallback protects continuity without presuming Monday readiness."
            },
            {
              "text": "Let us move go-live to Monday.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "A later date helps planning but is not evidence of correct totals. Make Monday conditional on the same gate."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "A programme sponsor has publicly announced a Monday rollout. A late access-control defect blocks production, though a preview with synthetic data is safe. The sponsor wants a concise steering-group update. Tuesday is an estimate, not a verified release date.",
      "objective": "Help a sponsor correct expectations without minimising a release risk.",
      "emailSummary": "Monday is a safe preview; production follows validated access controls, with our next decision update on Tuesday.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "It would be helpful if the update did not sound like we are backing away from Monday.",
          "tip": "What does the recipient need to plan, beyond reassurance?",
          "phrase": "We expect…",
          "meaning": "Present an estimate without claiming certainty.",
          "choices": [
            {
              "text": "We can describe Monday as the start of a phased rollout, make the preview the first phase and explain that additional production access will follow as the validation work progresses.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Phased rollout suggests production has begun. Call the synthetic-data session a preview so the change is not obscured."
            },
            {
              "text": "Keep Monday’s production target; explain checks later.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "Keeping a production target visible while relegating the blocking checks to later explanation hides the changed readiness boundary. State that Monday is a preview."
            },
            {
              "text": "We can keep Monday’s preview, while stating that production waits for access-control validation.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "A real preview preserves a useful Monday milestone while the production boundary stays explicit."
            }
          ]
        },
        {
          "message": "Could we say Tuesday confidently? The group will want something definite.",
          "tip": "Would a proposed fallback actually respect the stated limitations?",
          "phrase": "Keep a fallback",
          "meaning": "Retain an alternative plan while readiness is uncertain.",
          "choices": [
            {
              "text": "I can commit to a Tuesday checkpoint, with release conditional on validation; that gives the group a dependable next decision. The alternative should remain useful without asking you to take on the unresolved release risk in order to preserve the earlier date.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Commit to the controllable checkpoint and distinguish it from an evidence-dependent release date."
            },
            {
              "text": "Tuesday is our best estimate.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "Best estimate is honest but does not give a reliable planning commitment. Add a specific checkpoint and release condition."
            },
            {
              "text": "We can announce Tuesday to give the group a firm date, and explain that any further delay would result from the access-control testing team needing additional time to complete its checks.",
              "score": [
                0,
                2,
                1
              ],
              "feedback": "The proposed update is concrete, but converts an unverified estimate into a release commitment and assigns any further delay to another team. Commit to a checkpoint, with release dependent on validation."
            }
          ]
        },
        {
          "message": "Please draft one sentence I can use without inviting a long discussion about who caused this.",
          "tip": "Which commitment remains reliable even if the technical work is unfinished?",
          "phrase": "Our next decision update",
          "meaning": "Commit to a controllable checkpoint rather than an unverified completion date.",
          "choices": [
            {
              "text": "Monday stays a milestone; production should follow shortly afterwards. Waiting for the complete outcome will avoid sending several provisional messages that may need to be revised as more information becomes available.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Shortly afterwards introduces unsupported timing. Preserve the concrete checkpoint instead of implying a release window."
            },
            {
              "text": "Monday is a safe preview; production follows validated access controls, with our next decision update on Tuesday.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The sentence gives a usable boundary and checkpoint without speculation about blame or an unverified release promise."
            },
            {
              "text": "We are refining the rollout plan and will provide another update Tuesday. Waiting for the complete outcome will avoid sending several provisional messages that may need to be revised as more information becomes available.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Refining the plan conceals the production change. State the preview and validation boundary directly."
            }
          ]
        }
      ]
    }
  },
  "complaint": {
    "beginner": {
      "context": "A customer could not download a report for a meeting. The cause is unknown. Support can securely provide the report today. The customer can share an error code without sending the confidential report itself.",
      "objective": "Acknowledge disruption, gather minimal evidence and offer a remedy.",
      "emailSummary": "I will send an investigation update tomorrow at noon; I will confirm a cause only when we have evidence.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "We missed the meeting report. What will you do?",
          "tip": "What would help the recipient’s immediate business need?",
          "phrase": "I am sorry for the disruption.",
          "meaning": "Acknowledge the consequence of a service failure.",
          "choices": [
            {
              "text": "I am sorry the download disrupted your meeting. We can securely provide the report today while we investigate.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The reply acknowledges the concrete impact and offers the available same-day remedy without guessing a cause."
            },
            {
              "text": "I am sorry; I will ask our team to inspect the download, check whether other customers have the same problem and let you know when they have decided what to do.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Investigation is useful but leaves the missed report need unanswered. Add the available secure delivery."
            },
            {
              "text": "I will arrange another download attempt and check whether the failure occurred because your browser session had expired before the report was ready.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "A retry may help, but a session explanation is unverified. Offer the known remedy and investigate separately."
            }
          ]
        },
        {
          "message": "What should I send you? The report is confidential.",
          "tip": "Is the proposed evidence or commitment necessary and authorised?",
          "phrase": "A verified replacement",
          "meaning": "Distinguish a checked remedy from an untested attempt.",
          "choices": [
            {
              "text": "Please send a redacted report with the error code so we can inspect its layout and reproduce the download.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "The report content is not needed for this first investigation. Requesting it adds avoidable exposure and customer work."
            },
            {
              "text": "Please send only the error code; keep the report confidential.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The error code is the stated useful evidence and avoids unnecessary confidential data."
            },
            {
              "text": "Please supply evidence first.",
              "score": [
                2,
                1,
                2
              ],
              "feedback": "Evidence is useful, but this bare instruction dismisses the customer’s confidentiality concern and does not identify the minimum needed. Request the error code and reassure them not to send the report."
            }
          ]
        },
        {
          "message": "When will you tell us why it failed?",
          "tip": "What would demonstrate reliability rather than merely describe activity?",
          "phrase": "Before resuming…",
          "meaning": "State a condition that should be met before normal activity restarts.",
          "choices": [
            {
              "text": "I will explain the cause tomorrow.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Tomorrow’s explanation presumes the cause will be established. Promise an update rather than a finding."
            },
            {
              "text": "We will explain everything when all checks are finished.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Completing every check may take longer than the customer expects. Give a timed update, including unresolved questions."
            },
            {
              "text": "I will send an investigation update tomorrow at noon; I will confirm a cause only when we have evidence.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The checkpoint is reliable even if the cause remains unknown, and avoids presenting a guess as a finding."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "An export outage affected a client’s board pack. Two retries failed. A verified manual report can be delivered by 14:00; root-cause analysis continues. The client needs reliable data, not another trial. Contractual compensation requires a separate commercial review.",
      "objective": "Prioritise a verified remedy and separate investigation from commercial commitments.",
      "emailSummary": "We will agree a verification test using the board-pack case and share the result before asking you to resume exports.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Please stop asking us to retry. We need a reliable board pack by 14:00.",
          "tip": "What would help the recipient’s immediate business need?",
          "phrase": "I am sorry for the disruption.",
          "meaning": "Acknowledge the consequence of a service failure.",
          "choices": [
            {
              "text": "Agreed. We will deliver the verified manual report by 14:00 and investigate the export separately.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The verified workaround meets the urgent need and stops using the customer’s deadline as a test window."
            },
            {
              "text": "We will escalate the export issue immediately, assign a senior engineer to reproduce the failure and keep your team informed as we work towards restoring the normal report-generation process.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Escalation addresses the defect but gives no reliable board pack. Add the available verified remedy."
            },
            {
              "text": "Arrange another supervised export retry.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "A supervised retry still risks the deadline after two failures. Supply the verified report first."
            }
          ]
        },
        {
          "message": "We expect a service credit for this. Can you confirm it today?",
          "tip": "Is the proposed evidence or commitment necessary and authorised?",
          "phrase": "A verified replacement",
          "meaning": "Distinguish a checked remedy from an untested attempt.",
          "choices": [
            {
              "text": "We can confirm a credit today in principle and let the commercial team calculate the amount after the investigation.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "Confirming a credit in principle is already a commercial commitment. Keep entitlement subject to the required review."
            },
            {
              "text": "I will refer the credit request for commercial review today and confirm who will respond and when. We should be precise about what is needed and what has been established, so your team is not asked to take unnecessary risk or effort.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The reply takes ownership of routing and a response checkpoint without granting unauthorised compensation."
            },
            {
              "text": "We will review the credit request.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "A review is appropriate but leaves the client without an owner or timing. Supply both."
            }
          ]
        },
        {
          "message": "Your manual report is correct. What will reassure us before we use automated exports again?",
          "tip": "What would demonstrate reliability rather than merely describe activity?",
          "phrase": "Before resuming…",
          "meaning": "State a condition that should be met before normal activity restarts.",
          "choices": [
            {
              "text": "We will confirm when the fix is deployed. Giving the investigation priority should provide reassurance that we are doing everything possible, even before we have a result to demonstrate.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Deployment alone does not demonstrate that the failed use case now works. Share a verification result."
            },
            {
              "text": "Engineering will monitor exports and prioritise any further issues. Giving the investigation priority should provide reassurance that we are doing everything possible, even before we have a result to demonstrate.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Monitoring helps detect recurrence, but reassurance requires a demonstrated successful case before reuse."
            },
            {
              "text": "We will agree a verification test using the board-pack case and share the result before asking you to resume exports.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "A relevant agreed test supplies evidence of restored reliability rather than treating deployment as proof."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "A client director says a report failure has embarrassed her team. Your team owns the export service; the cause is unresolved. A verified replacement is available today. She asks for a message she can forward to senior colleagues without exposing confidential investigation details.",
      "objective": "Restore credibility through precise ownership and useful evidence.",
      "emailSummary": "A daily 15:00 update, early notice of material changes, and agreed verification before automated exports resume.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "My team now looks unprepared. I need more than an apology from you.",
          "tip": "What would help the recipient’s immediate business need?",
          "phrase": "I am sorry for the disruption.",
          "meaning": "Acknowledge the consequence of a service failure.",
          "choices": [
            {
              "text": "We take responsibility for the failed export. We can supply today’s verified replacement and a forwardable account of what is known. The immediate remedy and the service investigation are different commitments; addressing one should not require you to wait for the other.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Concrete ownership and a usable remedy help the director restore credibility without attributing an unverified cause."
            },
            {
              "text": "We recognise the impact and will treat this seriously. Our account team will give the investigation priority and ensure that your concerns are discussed at our next internal service meeting.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Recognition is appropriate, but seriousness alone gives her nothing usable for colleagues. Offer the remedy and factual account."
            },
            {
              "text": "We can explain that the failure was outside your team’s control and that our technical partners are reviewing the underlying service.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "Technical partners may be involved, but this framing distances your service from responsibility. Own the failure without speculating."
            }
          ]
        },
        {
          "message": "Can the message say this was exceptional and is now fully resolved?",
          "tip": "Is the proposed evidence or commitment necessary and authorised?",
          "phrase": "A verified replacement",
          "meaning": "Distinguish a checked remedy from an untested attempt.",
          "choices": [
            {
              "text": "We can call it an isolated incident, while noting that engineering is completing checks before closing the investigation.",
              "score": [
                0,
                3,
                2
              ],
              "feedback": "The summary is calm and includes continuing checks, but “isolated” claims evidence about recurrence that you do not have. State the verified replacement and keep the service investigation open."
            },
            {
              "text": "It can confirm the replacement is verified; the export’s cause and permanent remedy are still under investigation.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The response separates the reliable replacement from an unresolved service defect and avoids an unsupported rarity claim."
            },
            {
              "text": "We can say the immediate reporting need is resolved. The extra information or commitment would demonstrate how seriously we are treating the problem, rather than leaving the customer to wait for another review.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "The immediate need may be resolved, but clarify that this does not mean the export service is permanently fixed."
            }
          ]
        },
        {
          "message": "I cannot take another surprise to the board. What will you commit to?",
          "tip": "What would demonstrate reliability rather than merely describe activity?",
          "phrase": "Before resuming…",
          "meaning": "State a condition that should be met before normal activity restarts.",
          "choices": [
            {
              "text": "We will keep you closely informed.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Closely informed is well intentioned but not actionable. Specify a time, escalation rule and resumption condition."
            },
            {
              "text": "We will copy you into every engineering update. Giving the investigation priority should provide reassurance that we are doing everything possible, even before we have a result to demonstrate.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Every internal update adds noise and may disclose confidential details. Provide an accountable client-facing summary and change alerts."
            },
            {
              "text": "A daily 15:00 update, early notice of material changes, and agreed verification before automated exports resume.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "A predictable checkpoint, exception rule and readiness gate reduce surprises without flooding her with internal detail."
            }
          ]
        }
      ]
    }
  },
  "scope": {
    "beginner": {
      "context": "A website agreement includes a contact form and three pages. The client now asks for a booking calendar. The calendar is not included, and its cost and delivery time have not been estimated. The three-page launch can proceed as agreed.",
      "objective": "Clarify an addition without blocking the agreed work.",
      "emailSummary": "Keep the agreed launch; we will confirm the calendar’s timing and price before any change is approved.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Could you add a booking calendar while you build the contact form?",
          "tip": "Does shared purpose mean the requested function is already agreed?",
          "phrase": "Additional scope",
          "meaning": "Identify work beyond the current agreement without blaming the requester.",
          "choices": [
            {
              "text": "Start the addition and confirm details later.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Starting before an estimate and approval exposes both sides to unknown cost. Agree the change first."
            },
            {
              "text": "The calendar adds scope. I can estimate it separately while the agreed pages continue.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The reply identifies the change and offers an estimate without silently changing the existing commitment."
            },
            {
              "text": "I can ask the team about the calendar, check whether they have built a similar feature before and let you know whether they think it could fit into the current work.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "Checking is sensible but leaves the request’s scope status unclear. Explain that it is an addition."
            }
          ]
        },
        {
          "message": "I thought the contact form included bookings.",
          "tip": "Whose preference, approval and estimate are still distinct?",
          "phrase": "Record your preference",
          "meaning": "Acknowledge a proposed direction without implying all approvals are complete.",
          "choices": [
            {
              "text": "The contract calls it a contact form.",
              "score": [
                3,
                1,
                2
              ],
              "feedback": "The contract wording supports the boundary but does not explain the difference. Describe the user action. A bare procedural correction also makes the exchange less collaborative; explain the practical route forward."
            },
            {
              "text": "We can use the form for booking requests and label it a booking form, so customers know which details to enter.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "Booking requests might help, but a booking label can imply confirmed reservations. Clarify the actual function before proposing it."
            },
            {
              "text": "The form sends enquiries; it does not reserve times. Let us check what you need before pricing a calendar. This records the direction you want without assuming that all the people responsible for the requirements have already authorised it.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The functional distinction resolves the misunderstanding without relying on labels or blaming the client."
            }
          ]
        },
        {
          "message": "Could the extra calendar delay the three-page launch?",
          "tip": "What must happen before a revised plan is a credible commitment?",
          "phrase": "A separately approved enhancement",
          "meaning": "Frame an addition constructively while keeping its decision status clear.",
          "choices": [
            {
              "text": "Keep the agreed launch; we will confirm the calendar’s timing and price before any change is approved.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The original work stays protected while the unestimated addition receives a separate approval decision."
            },
            {
              "text": "It might; we will see during development. Keeping it within the original plan will make the communication simpler, even if the precise consequences need to be settled during delivery.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "An open possibility makes the original commitment uncertain. Establish that no launch change happens without agreement."
            },
            {
              "text": "Approve the calendar now and accept possible launch movement. Keeping it within the original plan will make the communication simpler, even if the precise consequences need to be settled during delivery.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Approving an idea is not informed approval of cost and timing. Estimate the change before revising the launch."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "A portal release includes search and CSV export. A newly requested approval workflow would add one week, or replace CSV export within the same date and budget. Compliance owns the approval requirements; the product lead cannot approve them alone.",
      "objective": "Expose scope alternatives and obtain the right decision authority.",
      "emailSummary": "Let us re-estimate the approved workflow, then explicitly agree the scope or timing trade-off before committing to a release date.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Can we fit the approval workflow into the existing release?",
          "tip": "Does shared purpose mean the requested function is already agreed?",
          "phrase": "Additional scope",
          "meaning": "Identify work beyond the current agreement without blaming the requester.",
          "choices": [
            {
              "text": "We can start with a simple approval workflow and refine Compliance’s requirements after the release to protect the date.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "A simple workflow may fail the actual approval requirements. Do not defer a required definition to after release."
            },
            {
              "text": "Either add a week or replace CSV export; we also need Compliance to approve the workflow requirements. The addition may support the same business goal, but we should agree its effect before it changes the work already promised.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Both feasible trade-offs and the required approver are visible before implementation is authorised."
            },
            {
              "text": "Compliance must approve the workflow requirements. Please stop treating a product preference as permission to start.",
              "score": [
                3,
                1,
                2
              ],
              "feedback": "The approval boundary is accurate and gives a useful condition for starting. However, “stop treating” corrects the client confrontationally. Record the preference and invite Compliance into the decision."
            }
          ]
        },
        {
          "message": "Keep the date. I approve replacing CSV; Compliance has not reviewed the workflow yet.",
          "tip": "Whose preference, approval and estimate are still distinct?",
          "phrase": "Record your preference",
          "meaning": "Acknowledge a proposed direction without implying all approvals are complete.",
          "choices": [
            {
              "text": "We will replace CSV and request Compliance’s comments. The team can make progress on the obvious parts first, leaving the detailed approvals to catch up when the relevant people have time to review.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "Comments after replacement may arrive too late to affect the committed plan. Treat their approval as a gate."
            },
            {
              "text": "We can begin the workflow based on your approval and keep some time available for Compliance to adjust the details after reviewing our first version.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "Space in the schedule does not authorise unknown compliance work. Confirm requirements and estimate before starting it."
            },
            {
              "text": "We can record your scope preference now; implementation waits for Compliance’s approved requirements and a confirmed estimate.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The product preference is recorded without treating it as approval from the missing decision owner."
            }
          ]
        },
        {
          "message": "Compliance’s approved workflow is larger than the version you estimated. Can the date stay?",
          "tip": "What must happen before a revised plan is a credible commitment?",
          "phrase": "A separately approved enhancement",
          "meaning": "Frame an addition constructively while keeping its decision status clear.",
          "choices": [
            {
              "text": "Let us re-estimate the approved workflow, then explicitly agree the scope or timing trade-off before committing to a release date.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "A changed definition invalidates the old estimate. Re-estimation enables a credible decision rather than assuming the old trade-off."
            },
            {
              "text": "We should add another week.",
              "score": [
                0,
                3,
                2
              ],
              "feedback": "This gives a concrete scheduling suggestion, but reuses the old one-week estimate after Compliance enlarged the requirement. Re-estimate the new definition before choosing a date."
            },
            {
              "text": "Keep the date; reduce testing and review compliance during live use. Keeping it within the original plan will make the communication simpler, even if the precise consequences need to be settled during delivery.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Reducing testing shifts risk instead of resolving the larger requirement. Revise scope or timing through informed agreement."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "A sponsor describes a late reporting addition as “finishing what we always intended”. The signed scope covers summary totals, not drill-down. Drill-down would delay a regulatory submission; a separate later phase is feasible. The sponsor wants to avoid appearing to have missed a requirement.",
      "objective": "Set a boundary while making correction easy to accept.",
      "emailSummary": "Summary reporting protects the submission; drill-down is proposed as a separately approved enhancement afterwards.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Surely drill-down is just completing the original reporting promise?",
          "tip": "Does shared purpose mean the requested function is already agreed?",
          "phrase": "Additional scope",
          "meaning": "Identify work beyond the current agreement without blaming the requester.",
          "choices": [
            {
              "text": "We can treat drill-down as part of the original intent and discuss a small schedule adjustment without calling it a change.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Avoiding the change label hides its consequence and may jeopardise the regulatory deadline. Record scope and timing transparently."
            },
            {
              "text": "It supports the same goal, but adds detail beyond the agreed totals. Could we phase it after the submission?",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Shared purpose is acknowledged while the functional addition and protected deadline stay explicit."
            },
            {
              "text": "The signed scope contains summary totals only. We can share the signed document with the steering group and explain that the reporting promise was recorded accurately before development began.",
              "score": [
                3,
                1,
                2
              ],
              "feedback": "The contract boundary is valid, but a bare correction offers no route forward. Connect it to the feasible later phase. A bare procedural correction also makes the exchange less collaborative; explain the practical route forward."
            }
          ]
        },
        {
          "message": "I would rather not take a change request to the steering group. Can this be handled quietly?",
          "tip": "Whose preference, approval and estimate are still distinct?",
          "phrase": "Record your preference",
          "meaning": "Acknowledge a proposed direction without implying all approvals are complete.",
          "choices": [
            {
              "text": "We can discuss the later phase privately.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "Private discussion can prepare a decision, but does not authorise changed scope. Provide a reviewable record."
            },
            {
              "text": "We can ask the developers to begin small drill-down tasks now, record their work internally and leave the formal commercial paperwork until after the next steering meeting has taken place.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "Quiet work creates an unapproved commitment and may affect the submission. Prepare the decision before starting additions."
            },
            {
              "text": "We can draft a concise phased decision for your review, so the group sees a protected submission and a clear later option.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "A low-friction decision helps preserve face without bypassing the group’s visibility of scope and timing."
            }
          ]
        },
        {
          "message": "What wording can I use so this does not sound like we forgot something?",
          "tip": "What must happen before a revised plan is a credible commitment?",
          "phrase": "A separately approved enhancement",
          "meaning": "Frame an addition constructively while keeping its decision status clear.",
          "choices": [
            {
              "text": "Summary reporting protects the submission; drill-down is proposed as a separately approved enhancement afterwards.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The wording frames the addition constructively without implying it was owed or already approved."
            },
            {
              "text": "We are completing the reporting capability in phases.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Completing the capability can imply the first phase is incomplete against the agreement. Name the agreed totals and proposed enhancement."
            },
            {
              "text": "We will add the remaining drill-down when the team is available.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Remaining functionality suggests an existing obligation, and availability is not approval. Keep the enhancement’s decision status explicit."
            }
          ]
        }
      ]
    }
  },
  "security": {
    "beginner": {
      "context": "A client needs support with an account error. Your policy prohibits receiving passwords. Support can use an error code and a screen capture with personal details removed. The client controls the account and must never share its login.",
      "objective": "Request useful evidence through a safe support route.",
      "emailSummary": "Change it now and report the disclosure through the security process; support will not use it.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Shall I send my password so you can check the account?",
          "tip": "Does urgency or trust replace the stated handling controls?",
          "phrase": "Keep it private",
          "meaning": "Set a clear boundary against sharing confidential information.",
          "choices": [
            {
              "text": "You could change the password after we finish, use a temporary password just for this support session and ask us to confirm that we have deleted it from our messages.",
              "score": [
                2,
                3,
                0
              ],
              "feedback": "Changing later still exposes credentials during support. Use evidence that does not require the password."
            },
            {
              "text": "We can avoid logging in if you send a screen capture, but include all the account details so we can identify it.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "Avoiding login is good, but requesting all details ignores minimisation. Ask for the error code and remove personal details."
            },
            {
              "text": "Please keep your password private; send the error code instead. We can keep the investigation moving through the approved route without asking anyone to give up the controls protecting the account or information.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The reply clearly rejects credential sharing and gives the known safe alternative."
            }
          ]
        },
        {
          "message": "The screen capture shows names and email addresses. Is it okay to send?",
          "tip": "What does the current evidence allow you to claim?",
          "phrase": "Remove personal details",
          "meaning": "Redact information that support does not need before sharing evidence.",
          "choices": [
            {
              "text": "Remove the names and email addresses, then send it through the approved support channel.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Redaction plus an approved channel allows useful evidence while limiting exposure."
            },
            {
              "text": "Send the error code first. If that identifies the account, we can decide later whether the screen capture needs redaction and use whichever route is most convenient for your team.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "The error code is useful, but convenient routing and later redaction decisions leave the confidentiality question unresolved. Explain that any screen capture must be redacted before approved-channel sharing."
            },
            {
              "text": "You can send the screen capture if you mark the message confidential and ask support to delete it after checking.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "A confidential label and later deletion do not prevent unnecessary initial disclosure. Redact before sending."
            }
          ]
        },
        {
          "message": "I sent my password before seeing your message. What should I do?",
          "tip": "Has the proposed action changed the scope or duration of the exposure?",
          "phrase": "Report the disclosure",
          "meaning": "Escalate exposed credentials through the security process rather than relying on deletion.",
          "choices": [
            {
              "text": "After deletion is confirmed, change the password if concerned. That avoids changing credentials unnecessarily if support has removed the message containing them and no one has used them.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Waiting for deletion leaves the disclosed credential active. Change it immediately and follow the incident process."
            },
            {
              "text": "Change it now and report the disclosure through the security process; support will not use it.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Immediate rotation and reporting address a disclosure that deletion alone cannot reverse."
            },
            {
              "text": "Change your password now.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Rotation is necessary, but the exposure should also enter the security process. Confirm support will not use the credential."
            }
          ]
        }
      ]
    },
    "advanced": {
      "context": "An analyst needs a production error investigation. Production contains customer identifiers. Policy permits an approved read-only support role for two hours, with audit logging and named access approval. A redacted log may answer the question before access is needed.",
      "objective": "Use minimum necessary evidence and bounded authorised access.",
      "emailSummary": "End the session at the approved limit and seek fresh authorisation for the remaining check before access resumes.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "Can you give the analyst production access to diagnose this quickly?",
          "tip": "Does urgency or trust replace the stated handling controls?",
          "phrase": "Keep it private",
          "meaning": "Set a clear boundary against sharing confidential information.",
          "choices": [
            {
              "text": "The named approver must authorise the two-hour read-only role with audit logging before anyone begins. Please arrange that instead of asking the analyst to bypass the normal controls.",
              "score": [
                2,
                1,
                2
              ],
              "feedback": "The proposed access controls are useful, but the bypass accusation treats a legitimate support question as misconduct. Try redacted logs first and explain the approval route constructively."
            },
            {
              "text": "We can grant two-hour access now, record the analyst’s name and ask the client to approve it before the session ends.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "Approval after access begins is retrospective. Obtain authorisation before activating the bounded role."
            },
            {
              "text": "Try redacted logs first; if insufficient, obtain named approval for two-hour read-only access with logging.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The reply tests the less intrusive route first and preserves every stated control if access proves necessary."
            }
          ]
        },
        {
          "message": "The log is insufficient. The client approves named access for two hours; can we use the analyst’s usual admin account?",
          "tip": "What does the current evidence allow you to claim?",
          "phrase": "Named authorisation",
          "meaning": "Require an accountable decision from an identified approver.",
          "choices": [
            {
              "text": "Use the approved read-only support role with logging, not the broader admin account.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The approved task requires a technically restricted role. Duration and good intentions do not replace least privilege."
            },
            {
              "text": "Limit the admin session to two hours.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "A short window does not remove unnecessary administrative powers. Use the specified restricted role."
            },
            {
              "text": "Use the admin account only to inspect records, with a written promise not to change anything during the approved window.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "A behavioural promise cannot enforce read-only access. Apply the authorised role and audit logging."
            }
          ]
        },
        {
          "message": "The two hours are over, but one check remains. Should we keep the session open?",
          "tip": "Has the proposed action changed the scope or duration of the exposure?",
          "phrase": "Fresh authorisation",
          "meaning": "Seek a new access decision when the approved duration has ended.",
          "choices": [
            {
              "text": "Leave access open but idle while awaiting the client’s reply.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "An idle open session still extends access. Close it and preserve investigation notes separately."
            },
            {
              "text": "End the session at the approved limit and seek fresh authorisation for the remaining check before access resumes.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The time boundary applies to the active access, not only work. A fresh approval is needed for continuation."
            },
            {
              "text": "Finish the check, then close access.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "A small remaining task is still outside the approved window. Request extension before continuing."
            }
          ]
        }
      ]
    },
    "expert": {
      "context": "A senior client offers an unapproved personal file-sharing link to speed a confidential incident review. The approved secure portal is available but requires a short upload step. Security policy has no informal exception, and the client is worried that procedure will delay the board response.",
      "objective": "Decline unsafe shortcuts while preserving collaboration and urgency.",
      "emailSummary": "We can confirm approved transfer; the incident review will assess any earlier exposure.",
      "emailNext": "Please confirm the proposed next step and let us know if the stated conditions have changed.",
      "steps": [
        {
          "message": "I trust you. Let us use my private link and avoid involving Security at this stage.",
          "tip": "Does urgency or trust replace the stated handling controls?",
          "phrase": "Keep it private",
          "meaning": "Set a clear boundary against sharing confidential information.",
          "choices": [
            {
              "text": "We cannot accept a personal link under our policy. Our team follows the same procedure for every confidential investigation, and we need you to arrange the approved transfer before we can begin.",
              "score": [
                3,
                1,
                2
              ],
              "feedback": "The boundary is correct, but it does not address the urgency. Add the available assistance through the approved route. A bare procedural correction also makes the exchange less collaborative; explain the practical route forward."
            },
            {
              "text": "Use the private link for this file only.",
              "score": [
                1,
                3,
                0
              ],
              "feedback": "Limited downloading still uses an unapproved channel, and later approval cannot authorise it retrospectively."
            },
            {
              "text": "Thank you. Let us use the secure portal; I can help with the upload so the review moves quickly.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "Acknowledging trust and offering practical help protects the relationship without treating trust as an authorisation exception."
            }
          ]
        },
        {
          "message": "Could the board summary simply say the files were shared securely? I do not want a procedural debate.",
          "tip": "What does the current evidence allow you to claim?",
          "phrase": "Named authorisation",
          "meaning": "Require an accountable decision from an identified approver.",
          "choices": [
            {
              "text": "We can say that once the portal transfer is verified; until then, the files are awaiting approved transfer. The safeguard should be established before we rely on it, rather than replaced by a promise about how carefully people intend to behave.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The summary reflects the verified handling status rather than converting intended confidentiality into a completed control."
            },
            {
              "text": "We can describe the sharing route in the appendix.",
              "score": [
                2,
                2,
                1
              ],
              "feedback": "An appendix does not make an inaccurate headline acceptable. Use accurate current status in the summary."
            },
            {
              "text": "We can say the files are under controlled review because only our incident team will open the private link.",
              "score": [
                1,
                2,
                1
              ],
              "feedback": "Restricting viewers does not establish an approved secure transfer. Do not use controlled review to imply compliance."
            }
          ]
        },
        {
          "message": "The portal upload is complete. Can you assure the board there is no confidentiality risk now?",
          "tip": "Has the proposed action changed the scope or duration of the exposure?",
          "phrase": "Approved transfer",
          "meaning": "Distinguish an authorised handling route from an informal assurance of trust.",
          "choices": [
            {
              "text": "The files are confidential within our team; only routine checks remain. We can restrict further handling to the incident team and tell the board that the secure transfer has addressed the main confidentiality concern.",
              "score": [
                2,
                3,
                1
              ],
              "feedback": "Confidential within our team and routine review may minimise an unresolved incident. Name the exposure question accurately."
            },
            {
              "text": "We can confirm approved transfer; the incident review will assess any earlier exposure.",
              "score": [
                3,
                3,
                3
              ],
              "feedback": "The verified transfer is distinct from possible prior exposure. The reply makes assurance proportional to evidence."
            },
            {
              "text": "The transfer is now secure. We can restrict further handling to the incident team and reassure the board that using the approved route has addressed the confidentiality concern without discussing earlier handling.",
              "score": [
                1,
                3,
                1
              ],
              "feedback": "Current transfer security is useful but does not answer earlier exposure. State the remaining review boundary."
            }
          ]
        }
      ]
    }
  }
};
