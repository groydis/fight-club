export enum CharacterReportReason {
  INAPPROPRIATE = 'INAPPROPRIATE',
  HATE_SPEECH = 'HATE_SPEECH',
  GRAPHIC_VIOLENCE = 'GRAPHIC_VIOLENCE',
  IMPERSONATION = 'IMPERSONATION',
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  NSFW = 'NSFW',
  TOS_VIOLATION = 'TOS_VIOLATION',
  LOW_QUALITY = 'LOW_QUALITY',
  UNINTELLIGIBLE = 'UNINTELLIGIBLE',
  COPYRIGHTED_CONTENT = 'COPYRIGHTED_CONTENT',
  OTHER = 'OTHER',
}

export const CharacterReportReasonLabels: Record<CharacterReportReason, string> = {
  [CharacterReportReason.INAPPROPRIATE]: 'Inappropriate Content',
  [CharacterReportReason.HATE_SPEECH]: 'Hate Speech',
  [CharacterReportReason.GRAPHIC_VIOLENCE]: 'Graphic Violence',
  [CharacterReportReason.IMPERSONATION]: 'Impersonation',
  [CharacterReportReason.SPAM]: 'Spam or Advertising',
  [CharacterReportReason.HARASSMENT]: 'Harassment or Bullying',
  [CharacterReportReason.NSFW]: 'Sexual or NSFW Content',
  [CharacterReportReason.TOS_VIOLATION]: 'Violates Terms of Service',
  [CharacterReportReason.LOW_QUALITY]: 'Low Quality or Nonsense',
  [CharacterReportReason.UNINTELLIGIBLE]: 'Unintelligible or Gibberish',
  [CharacterReportReason.COPYRIGHTED_CONTENT]: 'Copyrighted or Stolen Content',
  [CharacterReportReason.OTHER]: 'Other (Please Specify)',
}
