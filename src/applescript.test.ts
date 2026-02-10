import { describe, it, expect } from 'vitest'
import { guessListForReminder, escapeAppleScript, formatAppleScriptDate } from './applescript.js'
import type { ListForGuessing } from './applescript.js'

const defaultLists: ListForGuessing[] = [
  { name: 'Reminders' },
  { name: 'Groceries' },
  { name: 'Shopping' },
  { name: 'Work' },
  { name: 'Home' },
  { name: 'Health' },
  { name: 'Finance' },
  { name: 'Travel' },
  { name: 'Family' },
]

describe('escapeAppleScript', () => {
  it('escapes backslashes', () => {
    expect(escapeAppleScript('a\\b')).toBe('a\\\\b')
  })

  it('escapes double quotes', () => {
    expect(escapeAppleScript('say "hello"')).toBe('say \\"hello\\"')
  })

  it('handles combined escaping', () => {
    expect(escapeAppleScript('path\\to\\"file"')).toBe('path\\\\to\\\\\\"file\\"')
  })

  it('passes through normal strings', () => {
    expect(escapeAppleScript('Hello, World!')).toBe('Hello, World!')
  })

  it('handles empty string', () => {
    expect(escapeAppleScript('')).toBe('')
  })
})

describe('formatAppleScriptDate', () => {
  it('formats a date into AppleScript date literal', () => {
    const date = new Date(2024, 0, 15, 9, 30) // Jan 15, 2024 09:30
    const result = formatAppleScriptDate(date)
    expect(result).toBe('date "1/15/2024 9:30"')
  })

  it('pads minutes with zero', () => {
    const date = new Date(2024, 5, 1, 14, 5) // Jun 1, 2024 14:05
    const result = formatAppleScriptDate(date)
    expect(result).toBe('date "6/1/2024 14:05"')
  })

  it('handles midnight', () => {
    const date = new Date(2024, 11, 25, 0, 0) // Dec 25, 2024 00:00
    const result = formatAppleScriptDate(date)
    expect(result).toBe('date "12/25/2024 0:00"')
  })
})

describe('guessListForReminder', () => {
  it('returns null for empty available lists', () => {
    expect(guessListForReminder('Buy milk', undefined, [])).toBeNull()
  })

  it('matches exact list name in title (case-insensitive)', () => {
    expect(guessListForReminder('Add to groceries', undefined, defaultLists)).toBe('Groceries')
  })

  it('matches exact list name in notes', () => {
    expect(guessListForReminder('Something', 'put this in shopping list', defaultLists)).toBe('Shopping')
  })

  it('matches grocery keywords to Groceries list', () => {
    expect(guessListForReminder('Buy milk', undefined, defaultLists)).toBe('Groceries')
    expect(guessListForReminder('Get eggs', undefined, defaultLists)).toBe('Groceries')
    expect(guessListForReminder('Need bread', undefined, defaultLists)).toBe('Groceries')
  })

  it('matches work keywords to Work list', () => {
    expect(guessListForReminder('Prepare presentation', undefined, defaultLists)).toBe('Work')
    expect(guessListForReminder('Email client about deadline', undefined, defaultLists)).toBe('Work')
  })

  it('matches home keywords to Home list', () => {
    expect(guessListForReminder('Clean the house', undefined, defaultLists)).toBe('Home')
    expect(guessListForReminder('Fix the fence', undefined, defaultLists)).toBe('Home')
  })

  it('matches health keywords to Health list', () => {
    expect(guessListForReminder('Doctor appointment', undefined, defaultLists)).toBe('Health')
    expect(guessListForReminder('Go to dentist', undefined, defaultLists)).toBe('Health')
  })

  it('matches finance keywords to Finance list', () => {
    expect(guessListForReminder('Pay electric bill', undefined, defaultLists)).toBe('Finance')
    expect(guessListForReminder('Check bank statement', undefined, defaultLists)).toBe('Finance')
  })

  it('matches travel keywords to Travel list', () => {
    expect(guessListForReminder('Book flight', undefined, defaultLists)).toBe('Travel')
    expect(guessListForReminder('Pack suitcase', undefined, defaultLists)).toBe('Travel')
  })

  it('matches family keywords to Family list', () => {
    expect(guessListForReminder('Visit mom this weekend', undefined, defaultLists)).toBe('Family')
    expect(guessListForReminder('Pick up kid from school', undefined, defaultLists)).toBe('Family')
  })

  it('returns null when no keywords match', () => {
    expect(guessListForReminder('Something random', undefined, defaultLists)).toBeNull()
  })

  it('prefers exact list name match over keyword match', () => {
    expect(guessListForReminder('Check groceries', undefined, defaultLists)).toBe('Groceries')
  })

  it('uses notes for matching when title has no keywords', () => {
    expect(guessListForReminder('Remember this', 'schedule dentist visit', defaultLists)).toBe('Health')
  })

  it('is case-insensitive', () => {
    expect(guessListForReminder('BUY MILK', undefined, defaultLists)).toBe('Groceries')
  })

  it('handles lists with no keyword matches', () => {
    const customLists: ListForGuessing[] = [{ name: 'Custom List' }]
    expect(guessListForReminder('Buy milk', undefined, customLists)).toBeNull()
  })
})
