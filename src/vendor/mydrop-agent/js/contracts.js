window.agentContracts = {
  modes: {
    chat: 'chat',
    postCreation: 'post_creation',
    mediaCreation: 'media_creation',
    draftRefinement: 'draft_refinement',
    brandStrategy: 'brand_strategy',
    universal: 'universal'
  },
  streamEvents: {
    runStarted: 'run_started',
    planUpdated: 'plan_updated',
    statusText: 'status_text',
    toolCallStarted: 'tool_call_started',
    toolCallCompleted: 'tool_call_completed',
    partialMessage: 'partial_message',
    draftReady: 'draft_ready',
    approvalRequired: 'approval_required',
    verificationResult: 'verification_result',
    runCompleted: 'run_completed',
    runFailed: 'run_failed'
  },
  approvalModes: {
    none: 'none',
    softConfirm: 'soft_confirm',
    hardConfirm: 'hard_confirm'
  }
};

