window.agentRuntimeBlueprint = {
  createRunState(runId, mode) {
    return {
      runId,
      mode,
      status: 'idle',
      plan: [],
      timeline: [],
      draft: null,
      approval: null,
      verification: null
    };
  },

  applyEvent(state, event) {
    const next = { ...state, timeline: [...state.timeline, event] };

    switch (event.kind) {
      case 'run_started':
        next.status = 'running';
        break;
      case 'plan_updated':
        next.plan = event.payload.steps || [];
        break;
      case 'draft_ready':
        next.draft = event.payload;
        break;
      case 'approval_required':
        next.approval = event.payload;
        next.status = 'waiting_approval';
        break;
      case 'verification_result':
        next.verification = event.payload;
        break;
      case 'run_completed':
        next.status = 'completed';
        break;
      case 'run_failed':
        next.status = 'failed';
        break;
      default:
        break;
    }

    return next;
  }
};
