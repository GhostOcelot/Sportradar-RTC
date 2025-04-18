export interface Score {
  [key: string]: {
    type: string
    home: string
    away: string
  }
}

export interface MappedEvent {
  [key: string]: {
    id: string
    status: string
    scores: Score | null
    startTime: string
    sport: string
    competitors: {
      HOME: {
        type: "HOME"
        name: string
      }
      AWAY: {
        type: "AWAY"
        name: string
      }
    }
    competition: string
  }
}
