export class Deal {
  constructor(
    public readonly id: string,
    public companyId: string,
    public contactId: string,
    public title: string,
    public description: string | null,
    public value: number,
    public currency: string,
    public stage: string,
    public probability: number,
    public expectedCloseDate: Date | null,
    public closedAt: Date | null,
    public assignedTo: string | null,
    public createdBy: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  isProspecting(): boolean {
    return this.stage === 'prospecting';
  }

  isQualified(): boolean {
    return this.stage === 'qualified';
  }

  isNegotiation(): boolean {
    return this.stage === 'negotiation';
  }

  isWon(): boolean {
    return this.stage === 'closed_won';
  }

  isLost(): boolean {
    return this.stage === 'closed_lost';
  }

  isClosed(): boolean {
    return this.isWon() || this.isLost();
  }

  close(won: boolean): void {
    this.stage = won ? 'closed_won' : 'closed_lost';
    this.closedAt = new Date();
    this.probability = won ? 100 : 0;
  }

  advanceStage(newStage: string, newProbability: number): void {
    this.stage = newStage;
    this.probability = newProbability;
  }
}
